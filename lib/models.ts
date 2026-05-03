import { OutputQuality } from "@/store/use-generation-store"

export const QUALITY_MODELS: Record<OutputQuality, string> = {
  "Extra High": "gemini-3-pro-image-preview",
  "High": "gemini-3-pro-image-preview",
  "Medium": "gemini-3.1-flash-image-preview",
  "Low": "gemini-2.5-flash-image",
  "Very Low": "gemini-2.5-flash-image",
  "Test": "gpt-image-1.5",
}
