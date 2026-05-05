import { useGenerationStore } from "@/store/use-generation-store"
import { useQuotaStore } from "@/store/use-quota-store"
import { APIClient } from "@/lib/api-client"

export function useGenerationActions() {
  const {
    imageCount,
    outputQuality,
    uploadedImages,
    selectedStyle,
    setGenerating,
    addGeneration,
  } = useGenerationStore()
  
  const { fetchQuota } = useQuotaStore()

  const generate = async (prompt: string) => {
    setGenerating(true)
    try {
      const result = await APIClient.generateImages({
        prompt,
        imageCount,
        outputQuality,
        base64Images: uploadedImages,
        selectedStyle,
      })
      
      const allTaskIds = result.images.map(img => img.taskId).filter(Boolean) as string[]
      const allUrls = result.images.map(img => img.url).filter(Boolean) as string[]
      
      const generationId = crypto.randomUUID()
      const status = allTaskIds.length > 0 ? "pending" : "completed"
      
      addGeneration(prompt, allUrls, outputQuality, status, allTaskIds, generationId)
      
      if (allTaskIds.length > 0) {
        startPolling(generationId, allTaskIds)
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setGenerating(false)
      await fetchQuota()
    }
  }

  const startPolling = async (generationId: string, taskIds: string[]) => {
    const completedUrls: string[] = []
    const pendingIds = [...taskIds]

    const poll = async () => {
      for (let i = pendingIds.length - 1; i >= 0; i--) {
        const taskId = pendingIds[i]
        try {
          const statusResult = await APIClient.getTaskStatus(taskId)
          if (statusResult.state === "success" && statusResult.url) {
            completedUrls.push(statusResult.url)
            pendingIds.splice(i, 1)
            
            useGenerationStore.getState().updateGenerationImages(generationId, [...completedUrls])
          } else if (statusResult.state === "failed") {
            pendingIds.splice(i, 1)
          }
        } catch (error) {
          console.error(`Error polling task ${taskId}:`, error)
        }
      }

      if (pendingIds.length > 0) {
        setTimeout(poll, 3000)
      } else {
        useGenerationStore.getState().updateGenerationStatus(generationId, "completed")
      }
    }

    setTimeout(poll, 3000)
  }

  return { generate }
}
