import { 
  Generation, 
  ImageGenerationCount, 
  OutputQuality 
} from "@/lib/types"

export const IMAGE_GENERATION_COUNTS = [1, 2, 4] as const
export const OUTPUT_QUALITIES = ["Very Low", "Low", "Medium", "High", "Test"] as const

export const isImageGenerationCount = (value: unknown): value is ImageGenerationCount => {
  return IMAGE_GENERATION_COUNTS.some((count) => count === value)
}

export const isOutputQuality = (value: unknown): value is OutputQuality => {
  return OUTPUT_QUALITIES.some((quality) => quality === value)
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export const isGeneration = (value: unknown): value is Generation => {
  if (!value || typeof value !== "object") return false
  const gen = value as Partial<Generation>
  return (
    typeof gen.id === "string" &&
    typeof gen.prompt === "string" &&
    typeof gen.createdAt === "string" &&
    Array.isArray(gen.images) &&
    gen.images.every((img) => typeof img === "string")
  )
}

export const getPersistedHistory = (persistedState: unknown): Generation[] => {
  if (!isRecord(persistedState)) return []
  const { history } = persistedState
  return Array.isArray(history) ? history.filter(isGeneration) : []
}

export const getPersistedImageCount = (persistedState: unknown): ImageGenerationCount => {
  if (!isRecord(persistedState)) return 4
  const { imageCount } = persistedState
  return isImageGenerationCount(imageCount) ? imageCount : 4
}

export const getPersistedOutputQuality = (persistedState: unknown): OutputQuality => {
  if (!isRecord(persistedState)) return "Medium"
  const { outputQuality } = persistedState
  return isOutputQuality(outputQuality) ? outputQuality : "Medium"
}
