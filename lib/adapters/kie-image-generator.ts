import { QUALITY_MODELS } from "../models"
import { BASE_PROMPTS } from "../prompts"
import { uploadToCloudinary } from "../cloudinary"
import { IImageGenerator, GenerationParams, GenerationResult } from "../interfaces/image-generator.interface"

export class KieImageGenerator implements IImageGenerator {
  private readonly apiKey = process.env.KIE_AI_API_KEY
  private readonly callbackUrl = process.env.KIE_AI_CALLBACK_URL
  private readonly baseUrl = "https://api.kie.ai/api/v1/jobs"

  async generate(params: GenerationParams): Promise<GenerationResult[]> {
    const { prompt, imageCount, outputQuality, base64Image, selectedStyle } = params
    const model = QUALITY_MODELS[outputQuality]
    
    const inputImageUrl = await uploadToCloudinary(base64Image, "pixii-uploads")

    const generationPromises = Array.from({ length: imageCount }).map(async (_, i) => {
      const basePrompt = BASE_PROMPTS[i % BASE_PROMPTS.length]
      let finalPrompt = basePrompt
      
      if (selectedStyle) finalPrompt += ` | Style: ${selectedStyle}`
      if (prompt) finalPrompt += ` | Additional Details: ${prompt}`

      const response = await fetch(`${this.baseUrl}/createTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          callBackUrl: this.callbackUrl,
          input: {
            prompt: finalPrompt,
            image_urls: [inputImageUrl],
            output_format: "png",
            image_size: "16:9",
            aspect_ratio: "16:9",
            resolution: "1K"
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.msg || `Kie AI request failed with status ${response.status}`)
      }

      const result = await response.json()
      if (result.code !== 200 || !result.data?.taskId) {
        throw new Error(result.msg || "Failed to create Kie AI task")
      }

      return { taskId: result.data.taskId }
    })

    return Promise.all(generationPromises)
  }
}
