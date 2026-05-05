"use client"

import { useState } from "react"
import { useGenerationStore } from "../../store/use-generation-store"
import { useQuotaStore } from "../../store/use-quota-store"
import { useGenerationActions } from "../../hooks/use-generation-actions"
import { PromptForm } from "./prompt-form"
import { GenerationOptions } from "./generation-options"

import { GenerateRequestSchema } from "@/lib/schemas"
import { STYLE_PACKS } from "@/lib/style-packs"
import { isLocalEnvironment } from "@/lib/environment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect } from "react"

const SUGGESTIONS = Object.keys(STYLE_PACKS)

export function FloatingInput() {
  const [prompt, setPrompt] = useState("")
  const [showQuotaAlert, setShowQuotaAlert] = useState(false)
  const { generate, cancelGeneration } = useGenerationActions()
  
  const {
    isGenerating,
    imageCount,
    setImageCount,
    outputQuality,
    setOutputQuality,
    selectedStyle,
    setSelectedStyle,
    aspectRatio,
    setAspectRatio,
    resolution,
    setResolution,
    uploadedImages,
    setUploadedImages
  } = useGenerationStore()

  const { fetchQuota } = useQuotaStore()
  const quotaRemaining = useQuotaStore((state) => state.quotaRemaining)
  const isLocal = isLocalEnvironment()
  const isQuotaExceeded = quotaRemaining <= 0 && !isLocal

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  useEffect(() => {
    if (isQuotaExceeded) {
      setShowQuotaAlert(true)
    }
  }, [isQuotaExceeded])

  const validationResult = GenerateRequestSchema.safeParse({
    base64Images: uploadedImages,
    selectedStyle,
    prompt,
    imageCount,
    outputQuality,
    aspectRatio,
    resolution,
  })

  const isValid = validationResult.success

  const getPlaceholder = () => {
    if (isQuotaExceeded) return "Quota exceeded for today"
    if (uploadedImages.length === 0) return "Attach an image first..."
    if (!isValid) return "Select a style or type 20+ chars..."
    return "Describe your custom background..."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || isGenerating || isQuotaExceeded) return
    
    const currentPrompt = prompt
    setPrompt("")
    await generate(currentPrompt)
    setUploadedImages([])
    setSelectedStyle(null)
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 px-4 sm:bottom-10 sm:gap-4 sm:px-container">
      <div className="flex max-w-full items-center justify-center gap-2">
        <GenerationOptions
          imageCount={imageCount}
          onImageCountChange={setImageCount}
          quality={outputQuality}
          onQualityChange={setOutputQuality}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          resolution={resolution}
          onResolutionChange={setResolution}
          styles={SUGGESTIONS}
          selectedStyle={selectedStyle}
          onStyleSelect={setSelectedStyle}
          disabled={isGenerating || isQuotaExceeded}
        />
      </div>

      <PromptForm
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        onCancel={cancelGeneration}
        isGenerating={isGenerating}
        uploadedImages={uploadedImages}
        onImagesUpload={setUploadedImages}
        isValid={isValid}
        placeholder={getPlaceholder()}
        disabled={isQuotaExceeded}
      />

      <AlertDialog open={showQuotaAlert} onOpenChange={setShowQuotaAlert}>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[400px] rounded-[2rem] p-6 sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              Quota Exhausted
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground leading-relaxed">
              You have exhausted your generation limits for today. Please come back tomorrow to continue creating high-quality Amazon listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogAction 
              className="rounded-full bg-primary hover:bg-primary/90 px-8 h-12 text-base font-medium transition-colors"
              onClick={() => setShowQuotaAlert(false)}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
