export type ImageGenerationCount = 1 | 2 | 4
export type OutputQuality = "Low" | "Medium" | "High" | "Test"
export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9" | "auto"
export type Resolution = "1k" | "2k" | "4k"

export interface Generation {
  id: string
  prompt: string
  images: string[]
  quality?: OutputQuality
  aspectRatio?: AspectRatio
  resolution?: Resolution
  createdAt: string
  status?: "pending" | "completed" | "failed"
  taskIds?: string[]
}

export interface QuotaInfo {
  limit: number
  remaining: number
  reset: number
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}
