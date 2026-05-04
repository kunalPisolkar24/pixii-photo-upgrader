import { 
  Generation, 
  ImageGenerationCount, 
  OutputQuality, 
  QuotaInfo 
} from "./types"

export class APIClient {
  static async generateImages(params: {
    prompt: string
    imageCount: ImageGenerationCount
    outputQuality: OutputQuality
    base64Image: string | null
    selectedStyle: string | null
  }): Promise<{ images: string[] }> {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Failed to generate images")
    }

    return response.json()
  }

  static async getQuota(): Promise<QuotaInfo> {
    const response = await fetch("/api/quota")
    if (!response.ok) {
      throw new Error("Failed to fetch quota")
    }
    return response.json()
  }
}
