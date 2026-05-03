import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { GenerateRequestSchema } from "@/lib/schemas"
import { BASE_PROMPTS } from "@/lib/prompts"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { puter } from "@/lib/puter"
import { QUALITY_MODELS } from "@/lib/models"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = GenerateRequestSchema.parse(body)
    const { base64Image, selectedStyle, customPrompt, imageCount, outputQuality } = validatedData

    if (outputQuality === "Test") {
      const testGenerationPromises = Array.from({ length: imageCount }).map(async () => {
        const response = await fetch(`https://picsum.photos/seed/${Math.random()}/800/800`)
        const buffer = await response.arrayBuffer()
        const base64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`
        
        return uploadToCloudinary(base64, "pixii-tests")
      })
      
      const testImages = await Promise.all(testGenerationPromises)
      return NextResponse.json({ images: testImages })
    }

    const model = QUALITY_MODELS[outputQuality] || QUALITY_MODELS["Medium"]
    
    const generationPromises = Array.from({ length: imageCount }).map(async (_, i) => {
      let finalPrompt = BASE_PROMPTS[i]
      if (selectedStyle) finalPrompt += ` | Style: ${selectedStyle}`
      if (customPrompt) finalPrompt += ` | Additional Details: ${customPrompt}`

      // Ensure base64 string is properly formatted for Puter
      const cleanBase64 = base64Image.includes(",") 
        ? base64Image.split(",")[1] 
        : base64Image

      // @ts-ignore - puter.ai.txt2img return type in Node environment
      const image = await puter.ai.txt2img(finalPrompt, {
        model,
        input_image: cleanBase64,
        input_image_mime_type: "image/png",
      })

      const imageUrl = image.src || image.toString()
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("Puter failed to return a valid image URL")
      }

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
