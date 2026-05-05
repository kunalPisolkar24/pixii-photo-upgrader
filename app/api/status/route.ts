import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ApiResponseFactory } from "@/lib/api-response-factory"
import { uploadToCloudinary } from "@/lib/cloudinary"

export const maxDuration = 60

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json(ApiResponseFactory.error("taskId is required", 400), { status: 400 })
    }

    const apiKey = process.env.KIE_AI_API_KEY
    const response = await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch task info: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (result.code !== 200) {
      throw new Error(result.msg || "Kie AI recordInfo failed")
    }

    const data = result.data
    if (data.state === "success" && data.resultJson) {
      const resultJson = JSON.parse(data.resultJson)
      const kieUrls = resultJson.resultUrls || []
      
      if (kieUrls.length > 0) {
        const finalUrl = await uploadToCloudinary(kieUrls[0], "pixii-generations")
        return NextResponse.json(ApiResponseFactory.success({ 
          state: "success", 
          url: finalUrl 
        }))
      }
    }

    return NextResponse.json(ApiResponseFactory.success({ 
      state: data.state || "pending" 
    }))

  } catch (error) {
    console.error("Status route error:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch task status"
    return NextResponse.json(ApiResponseFactory.error(message, 500), { status: 500 })
  }
}
