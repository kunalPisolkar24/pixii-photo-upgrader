import { useEffect, useCallback } from "react"
import { useQuotaStore } from "@/store/use-quota-store"

export function useAppInitialization() {
  const fetchQuota = useQuotaStore((state) => state.fetchQuota)

  const initialize = useCallback(() => {
    fetchQuota()
  }, [fetchQuota])

  useEffect(() => {
    initialize()
  }, [initialize])
}
