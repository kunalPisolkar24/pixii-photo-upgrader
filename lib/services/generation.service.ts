import { puter } from "@/lib/puter"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { QUALITY_MODELS } from "@/lib/models"
import { BASE_PROMPTS } from "@/lib/prompts"
import { OutputQuality, ImageGenerationCount } from "@/lib/types"

export class GenerationService {
  static async generate(params: {
    prompt?: string
    imageCount: ImageGenerationCount
    outputQuality: OutputQuality
    base64Image: string
    selectedStyle: string | null
  }): Promise<string[]> {
    const { prompt, imageCount, outputQuality, base64Image, selectedStyle } = params
    
    if (outputQuality === "Test") {
      return this.generateTestImages(imageCount)
    }

    const model = QUALITY_MODELS[outputQuality] || QUALITY_MODELS["Medium"]
    const cleanBase64 = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image

    const generationPromises = Array.from({ length: imageCount }).map(async (_, i) => {
      // Use modulo to avoid out-of-bounds access if BASE_PROMPTS changes
      const basePrompt = BASE_PROMPTS[i % BASE_PROMPTS.length]
      let finalPrompt = basePrompt
      
      if (selectedStyle) finalPrompt += ` | Style: ${selectedStyle}`
      if (prompt) finalPrompt += ` | Additional Details: ${prompt}`

      // @ts-ignore - puter.ai.txt2img type assertion
      const result = await puter.ai.txt2img(finalPrompt, {
        model,
        input_image: cleanBase64,
        input_image_mime_type: "image/png",
      })

      const imageUrl = result.src || result.toString()
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("AI generation service failed to return a valid image")
      }

      return uploadToCloudinary(imageUrl, "pixii-generations")
    })

    return Promise.all(generationPromises)
  }

  private static async generateTestImages(count: number): Promise<string[]> {
    const testPromises = Array.from({ length: count }).map(async () => {
      const seed = crypto.randomUUID()
      const response = await fetch(`https://picsum.photos/seed/${seed}/800/800`)
      const buffer = await response.arrayBuffer()
      const base64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`
      return uploadToCloudinary(base64, "pixii-tests")
    })
    return Promise.all(testPromises)
  }
}
