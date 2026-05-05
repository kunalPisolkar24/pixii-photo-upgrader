import {
  ImageGenerationCount,
  OutputQuality, 
  QuotaInfo,
  ApiResponse
} from "./types"

export class APIClient {
  private static async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")
    
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      throw new Error(text || `Unexpected response format: ${response.status}`)
    }

    const json: ApiResponse<T> = await response.json()
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded")
    }

    if (json.error || !response.ok) {
      throw new Error(json.error || `Server error: ${response.status}`)
    }

    if (json.data === undefined) {
      throw new Error("API returned no data")
    }

    return json.data
  }

  static async generateImages(params: {
    prompt: string
    imageCount: ImageGenerationCount
    outputQuality: OutputQuality
    base64Images: string[]
    selectedStyle: string | null
  }): Promise<{ images: { url?: string; taskId?: string }[] }> {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    return this.handleResponse<{ images: { url?: string; taskId?: string }[] }>(response)
  }

  static async getTaskStatus(taskId: string): Promise<{ state: string; url?: string }> {
    const response = await fetch(`/api/status?taskId=${taskId}`)
    return this.handleResponse<{ state: string; url?: string }>(response)
  }

  static async getQuota(): Promise<QuotaInfo> {
    const response = await fetch("/api/quota")
    return this.handleResponse<QuotaInfo>(response)
  }
}
