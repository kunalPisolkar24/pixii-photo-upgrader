import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Generation {
  id: string
  prompt: string
  images: string[]
  createdAt: string
}

export type ImageGenerationCount = 1 | 2 | 4

export interface GenerationState {
  isGenerating: boolean
  currentGenerations: string[]
  imageCount: ImageGenerationCount
  history: Generation[]
  setImageCount: (count: ImageGenerationCount) => void
  generate: (prompt: string) => Promise<void>
  removeHistoryItem: (id: string) => void
  clearHistory: () => void
}

export const IMAGE_GENERATION_COUNTS = [1, 2, 4] as const

const isImageGenerationCount = (
  value: unknown
): value is ImageGenerationCount => {
  return IMAGE_GENERATION_COUNTS.some((count) => count === value)
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

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      currentGenerations: [],
      imageCount: 4,
      history: [],
      setImageCount: (imageCount: ImageGenerationCount) => set({ imageCount }),
      generate: async (prompt: string) => {
        set({ isGenerating: true })

        await new Promise((resolve) => setTimeout(resolve, 3000))

        const mockImages = [
          `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
          `https://images.unsplash.com/photo-1774624513295-a0bac2eb4661?q=80&w=870&auto=format`,
          `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800`,
          `https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800`,
        ]
        const generatedImages = mockImages.slice(0, get().imageCount)

        const newGeneration: Generation = {
          id: Math.random().toString(36).substring(7),
          prompt,
          images: generatedImages,
          createdAt: new Date().toISOString(),
        }

        set({
          isGenerating: false,
          currentGenerations: generatedImages,
          history: [newGeneration, ...get().history],
        })
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
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        imageCount: getPersistedImageCount(persistedState),
        history: getPersistedHistory(persistedState),
      }),
    }
  )
)
