import { OutputQuality } from "@/store/use-generation-store"

export const QUALITY_MODELS: Record<OutputQuality, string> = {
  "Extra High": "google/gemini-3-pro-image-preview",
  "High": "google/gemini-2.5-flash-image",
  "Medium": "openai/gpt-5-image",
  "Low": "openai/gpt-5-image-mini",
  "Very Low": "",
}
