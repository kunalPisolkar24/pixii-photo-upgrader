"use client"

import { useRef, useEffect } from "react"
import { Paperclip, Send, X, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { compressImage } from "@/lib/image"

interface PromptFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isGenerating: boolean
  uploadedImages: string[]
  onImagesUpload: (images: string[]) => void
  isValid: boolean
  placeholder: string
  disabled?: boolean
  onCancel?: () => void
}

export function PromptForm({ 
  value, 
  onChange, 
  onSubmit, 
  isGenerating,
  uploadedImages,
  onImagesUpload,
  isValid,
  placeholder,
  disabled,
  onCancel
}: PromptFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`
    }
  }, [value])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remainingSlots = 3 - uploadedImages.length
    const filesToProcess = files.slice(0, remainingSlots)

    if (filesToProcess.length === 0) return

    const newImages: string[] = []

    for (const file of filesToProcess) {
      const reader = new FileReader()
      const promise = new Promise<string>((resolve) => {
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string)
          resolve(compressed)
        }
      })
      reader.readAsDataURL(file)
      const compressed = await promise
      newImages.push(compressed)
    }

    onImagesUpload([...uploadedImages, ...newImages])
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    const updated = uploadedImages.filter((_, i) => i !== index)
    onImagesUpload(updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isValid && !isGenerating && !disabled) {
        onSubmit(e as unknown as React.FormEvent)
      }
    }
  }

  return (
    <form 
      onSubmit={onSubmit}
      className={cn(
        "w-full max-w-2xl bg-card rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-outline-variant/20 flex flex-col p-3 sm:p-4 pointer-events-auto transition-all duration-500 ease-out overflow-hidden",
        uploadedImages.length > 0 && "rounded-[2rem]"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      
      {/* Uploaded Images Preview (Top Row) */}
      {uploadedImages.length > 0 && (
        <div className="flex items-center gap-3 px-2 pb-4 pt-1 animate-in fade-in slide-in-from-top-4 duration-300">
          {uploadedImages.map((img, idx) => (
            <div key={idx} className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 group">
              <img 
                src={img} 
                alt={`Upload ${idx + 1}`} 
                className="h-full w-full rounded-xl object-cover border border-outline-variant/30 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md"
              />
              <button
                type="button"
                disabled={disabled || isGenerating}
                onClick={() => removeImage(idx)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/90 hover:scale-110 z-10 disabled:cursor-not-allowed disabled:opacity-0"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Text Input (Middle Row) */}
      <Textarea 
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isGenerating || disabled}
        placeholder={placeholder} 
        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] sm:text-base min-h-[24px] max-h-[200px] px-2 py-2 resize-none disabled:opacity-100 disabled:cursor-not-allowed custom-scrollbar"
      />

      {/* Action Bar (Bottom Row) */}
      <div className="flex items-center justify-between px-1 pt-3 mt-1 border-t border-outline-variant/10">
        <div className="flex items-center gap-2">
          {uploadedImages.length < 3 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              disabled={isGenerating || disabled}
              className="rounded-full text-muted-foreground hover:bg-muted h-10 w-10 shrink-0 border border-outline-variant/20 transition-colors active:scale-95"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          )}
        </div>

        {isGenerating ? (
          <Button 
            type="button" 
            size="icon" 
            onClick={onCancel}
            className="rounded-full shrink-0 w-10 h-10 sm:w-11 sm:h-11 transition-all duration-300 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 active:scale-90"
          >
            <Square className="w-4 h-4 fill-current" />
          </Button>
        ) : (
          <Button 
            type="submit" 
            size="icon" 
            className={cn(
              "rounded-full shrink-0 w-10 h-10 sm:w-11 sm:h-11 transition-all duration-300",
              (!isValid || disabled) 
                ? "bg-muted text-muted-foreground opacity-50 shadow-none cursor-not-allowed" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-90"
            )}
            disabled={!isValid || disabled}
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>
    </form>
  )
}
