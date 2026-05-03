import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Generation {
  id: string
  prompt: string
  images: string[]
  quality?: OutputQuality
  createdAt: string
}

export type ImageGenerationCount = 1 | 2 | 4
export type OutputQuality =
  | "Very Low"
  | "Low"
  | "Medium"
  | "High"
  | "Extra High"

export interface GenerationState {
  isGenerating: boolean
  currentGenerations: string[]
  imageCount: ImageGenerationCount
  outputQuality: OutputQuality
  history: Generation[]
  quotaRemaining: number
  quotaLimit: number
  setImageCount: (count: ImageGenerationCount) => void
  setOutputQuality: (quality: OutputQuality) => void
  generate: (prompt: string) => Promise<void>
  fetchQuota: () => Promise<void>
  removeHistoryItem: (id: string) => void
  clearHistory: () => void
}

export const IMAGE_GENERATION_COUNTS = [1, 2, 4] as const
export const OUTPUT_QUALITIES = [
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Extra High",
] as const

const isImageGenerationCount = (
  value: unknown
): value is ImageGenerationCount => {
  return IMAGE_GENERATION_COUNTS.some((count) => count === value)
}

const isOutputQuality = (value: unknown): value is OutputQuality => {
  return OUTPUT_QUALITIES.some((quality) => quality === value)
}

const isGeneration = (value: unknown): value is Generation => {
  if (!value || typeof value !== "object") return false

  const generation = value as Partial<Generation>

  return (
    typeof generation.id === "string" &&
    typeof generation.prompt === "string" &&
    typeof generation.createdAt === "string" &&
    Array.isArray(generation.images) &&
    generation.images.every((image) => typeof image === "string")
  )
}

const getPersistedHistory = (persistedState: unknown): Generation[] => {
  if (!persistedState || typeof persistedState !== "object") return []

  const { history } = persistedState as { history?: unknown }

  return Array.isArray(history) ? history.filter(isGeneration) : []
}

const getPersistedImageCount = (
  persistedState: unknown
): ImageGenerationCount => {
  if (!persistedState || typeof persistedState !== "object") return 4

  const { imageCount } = persistedState as { imageCount?: unknown }

  return isImageGenerationCount(imageCount) ? imageCount : 4
}

const getPersistedOutputQuality = (persistedState: unknown): OutputQuality => {
  if (!persistedState || typeof persistedState !== "object") return "Medium"

  const { outputQuality } = persistedState as { outputQuality?: unknown }

  return isOutputQuality(outputQuality) ? outputQuality : "Medium"
}

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      currentGenerations: [],
      imageCount: 4,
      outputQuality: "Medium",
      history: [],
      quotaRemaining: 3,
      quotaLimit: 3,
      setImageCount: (imageCount: ImageGenerationCount) => set({ imageCount }),
      setOutputQuality: (outputQuality: OutputQuality) =>
        set({ outputQuality }),
      fetchQuota: async () => {
        try {
          const res = await fetch("/api/quota")
          if (res.ok) {
            const data = await res.json()
            set({ quotaRemaining: data.remaining, quotaLimit: data.limit })
          }
        } catch (error) {
          // Error handling
        }
      },
      generate: async (prompt: string) => {
        const { imageCount, outputQuality } = get()

        set({ isGenerating: true })

        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
              imageCount,
              outputQuality,
            }),
          })

          if (!response.ok) {
            if (response.status === 429) {
              // Handle rate limit
              await get().fetchQuota()
              set({ isGenerating: false })
              return
            }
            throw new Error("Failed to generate images")
          }

          const data = await response.json()
          const generatedImages = data.images

          const newGeneration: Generation = {
            id: Math.random().toString(36).substring(7),
            prompt,
            images: generatedImages,
            quality: outputQuality,
            createdAt: new Date().toISOString(),
          }

          set({
            isGenerating: false,
            currentGenerations: generatedImages,
            history: [newGeneration, ...get().history],
          })
        } catch (error) {
          set({ isGenerating: false })
          console.error("Generation error:", error)
        } finally {
          // Refresh quota after generation attempt
          await get().fetchQuota()
        }
      },
      removeHistoryItem: (id: string) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "pixii-generation-storage",
      partialize: (state) => ({
        history: state.history,
        imageCount: state.imageCount,
        outputQuality: state.outputQuality,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        imageCount: getPersistedImageCount(persistedState),
        outputQuality: getPersistedOutputQuality(persistedState),
        history: getPersistedHistory(persistedState),
      }),
    }
  )
)
