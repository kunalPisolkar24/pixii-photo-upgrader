import { useRef } from "react"
import { useGenerationStore } from "@/store/use-generation-store"
import { useQuotaStore } from "@/store/use-quota-store"
import { APIClient } from "@/lib/api-client"

export function useGenerationActions() {
  const {
    imageCount,
    outputQuality,
    uploadedImages,
    selectedStyle,
    aspectRatio,
    resolution,
    setGenerating,
    addGeneration,
    removeHistoryItem,
  } = useGenerationStore()
  
  const { fetchQuota } = useQuotaStore()
  const abortControllerRef = useRef<AbortController | null>(null)
  const activeGenerationIdRef = useRef<string | null>(null)

  const generate = async (prompt: string) => {
    abortControllerRef.current = new AbortController()
    setGenerating(true)
    try {
      const result = await APIClient.generateImages({
        prompt,
        imageCount,
        outputQuality,
        base64Images: uploadedImages,
        selectedStyle,
        aspectRatio,
        resolution,
      }, { signal: abortControllerRef.current.signal })
      
      const allTaskIds = result.images.map(img => img.taskId).filter(Boolean) as string[]
      const allUrls = result.images.map(img => img.url).filter(Boolean) as string[]
      
      const generationId = crypto.randomUUID()
      activeGenerationIdRef.current = generationId
      
      const status = allTaskIds.length > 0 ? "pending" : "completed"
      
      addGeneration({
        prompt, 
        images: allUrls, 
        quality: outputQuality, 
        aspectRatio,
        resolution,
        status, 
        taskIds: allTaskIds, 
        id: generationId
      })
      
      if (allTaskIds.length > 0) {
        startPolling(generationId, allTaskIds, abortControllerRef.current.signal)
      } else {
        setGenerating(false)
        await fetchQuota()
        activeGenerationIdRef.current = null
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Generation cancelled by user")
      } else {
        console.error("Generation failed:", error)
      }
      setGenerating(false)
      await fetchQuota()
      activeGenerationIdRef.current = null
    }
  }

  const startPolling = async (generationId: string, taskIds: string[], signal?: AbortSignal) => {
    const completedUrls: string[] = []
    const pendingIds = [...taskIds]

    const poll = async () => {
      if (signal?.aborted) return

      for (let i = pendingIds.length - 1; i >= 0; i--) {
        const taskId = pendingIds[i]
        try {
          const statusResult = await APIClient.getTaskStatus(taskId, { signal })
          if (statusResult.state === "success" && statusResult.url) {
            completedUrls.push(statusResult.url)
            pendingIds.splice(i, 1)
            
            useGenerationStore.getState().updateGenerationImages(generationId, [...completedUrls])
          } else if (statusResult.state === "failed") {
            pendingIds.splice(i, 1)
          }
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error(`Error polling task ${taskId}:`, error)
          }
        }
      }

      if (signal?.aborted) return

      if (pendingIds.length > 0) {
        setTimeout(poll, 3000)
      } else {
        useGenerationStore.getState().updateGenerationStatus(generationId, "completed")
        setGenerating(false)
        await fetchQuota()
        activeGenerationIdRef.current = null
      }
    }

    setTimeout(poll, 3000)
  }

  const cancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (activeGenerationIdRef.current) {
      removeHistoryItem(activeGenerationIdRef.current)
      activeGenerationIdRef.current = null
    }
    setGenerating(false)
  }

  return { generate, cancelGeneration }
}
