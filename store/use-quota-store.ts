import { create } from "zustand"
import { APIClient } from "@/lib/api-client"

interface QuotaState {
  quotaRemaining: number
  quotaLimit: number
  isLoading: boolean
  error: string | null
  fetchQuota: () => Promise<void>
}

export const useQuotaStore = create<QuotaState>((set, get) => ({
  quotaRemaining: 3,
  quotaLimit: 3,
  isLoading: false,
  error: null,
  fetchQuota: async () => {
    if (get().isLoading) {
      return
    }

    set({ isLoading: true, error: null })
    try {
      const data = await APIClient.getQuota()
      set({ 
        quotaRemaining: data.remaining, 
        quotaLimit: data.limit,
        isLoading: false,
        error: null
      })
    } catch (err) {
      console.error("Quota fetch failed:", err)
      set({ 
        error: err instanceof Error ? err.message : "Unable to reach quota service",
        isLoading: false 
      })
    }
  },
}))
