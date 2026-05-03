import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { GenerateRequestSchema } from "@/lib/schemas"
import { BASE_PROMPTS } from "@/lib/prompts"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { puter } from "@/lib/puter"
import { QUALITY_MODELS } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = GenerateRequestSchema.parse(body)
    const { base64Image, selectedStyle, customPrompt, imageCount, outputQuality } = validatedData

    if (outputQuality === "Test") {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const mockImages = [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
      ]
      return NextResponse.json({ images: mockImages.slice(0, imageCount) })
    }

    const model = QUALITY_MODELS[outputQuality] || QUALITY_MODELS["Medium"]
    
    const generationPromises = Array.from({ length: imageCount }).map(async (_, i) => {
      let finalPrompt = BASE_PROMPTS[i]
      if (selectedStyle) finalPrompt += ` | Style: ${selectedStyle}`
      if (customPrompt) finalPrompt += ` | Additional Details: ${customPrompt}`

      // @ts-ignore - puter.ai.txt2img return type in Node environment
      const image = await puter.ai.txt2img(finalPrompt, {
        model,
        input_image: base64Image.split(",")[1] || base64Image,
        input_image_mime_type: "image/png",
      })

      const imageUrl = image.src || image.toString()
      return uploadToCloudinary(imageUrl, "pixii-generations")
    })

    const generatedImages = await Promise.all(generationPromises)

    return NextResponse.json({ images: generatedImages })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate images" },
      { status: 400 }
    )
  }
}
