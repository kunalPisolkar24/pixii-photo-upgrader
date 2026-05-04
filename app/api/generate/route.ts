import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { GenerateRequestSchema } from "@/lib/schemas"
import { GenerationService } from "@/lib/services/generation.service"
import { ApiResponse } from "@/lib/types"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = GenerateRequestSchema.parse(body)
    
    const generatedImages = await GenerationService.generate(validatedData)

    const response: ApiResponse<{ images: string[] }> = {
      data: { images: generatedImages },
      status: 200
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Generation route error:", error)
    
    const message = error instanceof Error ? error.message : "Failed to generate images"
    const status = error instanceof Error && "name" in error && error.name === "ZodError" ? 400 : 500
    
    const response: ApiResponse<never> = {
      error: message,
      status
    }

    return NextResponse.json(response, { status })
  }
}
