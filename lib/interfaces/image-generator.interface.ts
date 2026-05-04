import { ImageGenerationCount, OutputQuality } from "../types"

export interface GenerationParams {
  prompt?: string
  imageCount: ImageGenerationCount
  outputQuality: OutputQuality
  base64Image: string
  selectedStyle: string | null
}

export interface IImageGenerator {
  generate(params: GenerationParams): Promise<string[]>
}
