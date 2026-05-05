export type ImageGenerationCount = 1 | 2 | 4
export type OutputQuality = "Low" | "Medium" | "High" | "Test"

export interface Generation {
  id: string
  prompt: string
  images: string[]
  quality?: OutputQuality
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
