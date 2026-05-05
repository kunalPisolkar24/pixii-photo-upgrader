import { ImageGenerationCount, OutputQuality, AspectRatio, Resolution } from "../types"

export interface GenerationResult {
  url?: string
  taskId?: string
}

export interface GenerationParams {
  prompt?: string
  imageCount: ImageGenerationCount
  outputQuality: OutputQuality
  base64Images: string[]
  selectedStyle: string | null
  aspectRatio: AspectRatio
  resolution: Resolution
}

export interface IImageGenerator {
  generate(params: GenerationParams): Promise<GenerationResult[]>
}
