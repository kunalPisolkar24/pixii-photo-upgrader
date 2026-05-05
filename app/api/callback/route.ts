import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ApiResponseFactory } from "@/lib/api-response-factory"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    console.log("Kie AI Webhook received:", JSON.stringify(payload, null, 2))
    
    return NextResponse.json(ApiResponseFactory.success({ message: "Webhook processed" }))
  } catch (error) {
    console.error("Webhook route error:", error)
    return NextResponse.json(ApiResponseFactory.error("Internal server error", 500), { status: 500 })
  }
}
