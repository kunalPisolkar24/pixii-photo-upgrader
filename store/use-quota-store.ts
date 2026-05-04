import { create } from "zustand"
import { APIClient } from "@/lib/api-client"

interface QuotaState {
  quotaRemaining: number
  quotaLimit: number
  isLoading: boolean
  error: string | null
  fetchQuota: () => Promise<void>
}

export const useQuotaStore = create<QuotaState>((set) => ({
  quotaRemaining: 3,
  quotaLimit: 3,
  isLoading: false,
  error: null,
  fetchQuota: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await APIClient.getQuota()
      set({ 
        quotaRemaining: data.remaining, 
        quotaLimit: data.limit,
        isLoading: false 
      })
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : "Failed to fetch quota",
        isLoading: false 
      })
    }
  },
}))
