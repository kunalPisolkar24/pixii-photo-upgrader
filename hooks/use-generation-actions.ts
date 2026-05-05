import { useGenerationStore } from "@/store/use-generation-store"
import { useQuotaStore } from "@/store/use-quota-store"
import { APIClient } from "@/lib/api-client"

export function useGenerationActions() {
  const {
    imageCount,
    outputQuality,
    uploadedImage,
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
        base64Image: uploadedImage,
        selectedStyle,
      })
      
      addGeneration(prompt, result.images, outputQuality)
    } catch (error) {
      console.error("Generation failed:", error)
      // We could add a toast notification here in the future
    } finally {
      setGenerating(false)
      await fetchQuota()
    }
  }

  return { generate }
}
