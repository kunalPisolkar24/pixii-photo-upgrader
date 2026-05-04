import { puter } from "../puter"
import { QUALITY_MODELS } from "../models"
import { BASE_PROMPTS } from "../prompts"
import { uploadToCloudinary } from "../cloudinary"
import { IImageGenerator, GenerationParams } from "../interfaces/image-generator.interface"

export class PuterImageGenerator implements IImageGenerator {
  async generate(params: GenerationParams): Promise<string[]> {
    const { prompt, imageCount, outputQuality, base64Image, selectedStyle } = params
    const model = QUALITY_MODELS[outputQuality] || QUALITY_MODELS["Medium"]
    const cleanBase64 = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image

    const generationPromises = Array.from({ length: imageCount }).map(async (_, i) => {
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
        throw new Error("Puter generation failed to return a valid image")
      }

      return uploadToCloudinary(imageUrl, "pixii-generations")
    })

    return Promise.all(generationPromises)
  }
}
