import { create } from "zustand"
import { persist } from "zustand/middleware"
import { 
  Generation, 
  ImageGenerationCount, 
  OutputQuality,
  AspectRatio,
  Resolution 
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
  uploadedImages: string[]
  selectedStyle: string | null
  aspectRatio: AspectRatio
  resolution: Resolution
  history: Generation[]
  
  setImageCount: (count: ImageGenerationCount) => void
  setOutputQuality: (quality: OutputQuality) => void
  setUploadedImages: (images: string[]) => void
  setSelectedStyle: (style: string | null) => void
  setAspectRatio: (ratio: AspectRatio) => void
  setResolution: (res: Resolution) => void
  
  addGeneration: (params: {
    prompt: string, 
    images: string[], 
    quality: OutputQuality, 
    aspectRatio: AspectRatio, 
    resolution: Resolution,
    status?: "pending" | "completed", 
    taskIds?: string[], 
    id?: string
  }) => void
  removeHistoryItem: (id: string) => void
  clearHistory: () => void
  setGenerating: (isGenerating: boolean) => void
  setCurrentGenerations: (images: string[]) => void
  updateGenerationImages: (id: string, images: string[]) => void
  updateGenerationStatus: (id: string, status: "pending" | "completed" | "failed") => void
}

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set) => ({
      isGenerating: false,
      currentGenerations: [],
      imageCount: 4,
      outputQuality: "Medium",
      uploadedImages: [],
      selectedStyle: null,
      aspectRatio: "auto",
      resolution: "1k",
      history: [],

      setImageCount: (imageCount) => set({ imageCount }),
      setOutputQuality: (outputQuality) => set({ outputQuality }),
      setUploadedImages: (uploadedImages) => set({ uploadedImages }),
      setSelectedStyle: (selectedStyle) => set({ selectedStyle }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setResolution: (resolution) => set({ resolution }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      setCurrentGenerations: (currentGenerations) => set({ currentGenerations }),

      addGeneration: ({ prompt, images, quality, aspectRatio, resolution, status = "completed", taskIds, id }) => {
        const newGeneration: Generation = {
          id: id || crypto.randomUUID(),
          prompt,
          images,
          quality,
          aspectRatio,
          resolution,
          createdAt: new Date().toISOString(),
          status,
          taskIds,
        }
        set((state) => ({
          history: [newGeneration, ...state.history],
          currentGenerations: images,
        }))
      },

      updateGenerationImages: (id, images) => {
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, images } : item
          ),
          currentGenerations: state.history.find((item) => item.id === id)
            ? images
            : state.currentGenerations,
        }))
      },

      updateGenerationStatus: (id, status) => {
        set((state) => ({
          history: state.history.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
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
        aspectRatio: state.aspectRatio,
        resolution: state.resolution,
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
