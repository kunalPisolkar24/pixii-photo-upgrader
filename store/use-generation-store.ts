import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
  Generation, 
  ImageGenerationCount, 
  OutputQuality 
} from "@/lib/types"
import { 
  getPersistedHistory, 
  getPersistedImageCount, 
  getPersistedOutputQuality 
} from "./persistence"

export interface GenerationState {
  isGenerating: boolean
  currentGenerations: string[]
  imageCount: ImageGenerationCount
  outputQuality: OutputQuality
  uploadedImage: string | null
  selectedStyle: string | null
  history: Generation[]
  
  setImageCount: (count: ImageGenerationCount) => void
  setOutputQuality: (quality: OutputQuality) => void
  setUploadedImage: (image: string | null) => void
  setSelectedStyle: (style: string | null) => void
  
  addGeneration: (prompt: string, images: string[], quality: OutputQuality) => void
  removeHistoryItem: (id: string) => void
  clearHistory: () => void
  setGenerating: (isGenerating: boolean) => void
  setCurrentGenerations: (images: string[]) => void
}

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set) => ({
      isGenerating: false,
      currentGenerations: [],
      imageCount: 4,
      outputQuality: "Medium",
      uploadedImage: null,
      selectedStyle: null,
      history: [],

      setImageCount: (imageCount) => set({ imageCount }),
      setOutputQuality: (outputQuality) => set({ outputQuality }),
      setUploadedImage: (uploadedImage) => set({ uploadedImage }),
      setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      setCurrentGenerations: (currentGenerations) => set({ currentGenerations }),

      addGeneration: (prompt, images, quality) => {
        const newGeneration: Generation = {
          id: crypto.randomUUID(),
          prompt,
          images,
          quality,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          history: [newGeneration, ...state.history],
          currentGenerations: images,
        }))
      },

      removeHistoryItem: (id) =>
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
