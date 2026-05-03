import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Generation {
  id: string;
  prompt: string;
  images: string[];
  createdAt: string;
}

export interface GenerationState {
  isGenerating: boolean;
  currentGenerations: string[];
  history: Generation[];
  generate: (prompt: string) => Promise<void>;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

const isGeneration = (value: unknown): value is Generation => {
  if (!value || typeof value !== 'object') return false;

  const generation = value as Partial<Generation>;

  return (
    typeof generation.id === 'string' &&
    typeof generation.prompt === 'string' &&
    typeof generation.createdAt === 'string' &&
    Array.isArray(generation.images) &&
    generation.images.every((image) => typeof image === 'string')
  );
};

const getPersistedHistory = (persistedState: unknown): Generation[] => {
  if (!persistedState || typeof persistedState !== 'object') return [];

  const { history } = persistedState as { history?: unknown };

  return Array.isArray(history) ? history.filter(isGeneration) : [];
};

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      isGenerating: false,
      currentGenerations: [],
      history: [],
      generate: async (prompt: string) => {
        set({ isGenerating: true });
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        const mockImages = [
          `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
          `https://images.unsplash.com/photo-1526170315873-3a561629993d?auto=format&fit=crop&q=80&w=800`,
          `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800`,
          `https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800`,
        ];

        const newGeneration: Generation = {
          id: Math.random().toString(36).substring(7),
          prompt,
          images: mockImages,
          createdAt: new Date().toISOString(),
        };

        set({
          isGenerating: false,
          currentGenerations: mockImages,
          history: [newGeneration, ...get().history],
        });
      },
      removeHistoryItem: (id: string) => 
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'pixii-generation-storage',
      partialize: (state) => ({ history: state.history }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        history: getPersistedHistory(persistedState),
      }),
    }
  )
);
