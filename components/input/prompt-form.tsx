"use client"

import { useRef, useEffect } from "react"
import { Paperclip, Send, X } from "lucide-react"
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
  disabled 
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
        "w-full max-w-2xl bg-card rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-outline-variant/20 flex flex-col p-2 pointer-events-auto transition-all duration-300 overflow-hidden",
        uploadedImages.length > 0 && "rounded-[1.5rem]"
      )}
    >
      <div className="flex items-end gap-2 pl-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        
        <div className="flex items-center gap-1.5 py-1 min-h-[48px]">
          {uploadedImages.map((img, idx) => (
            <div key={idx} className="relative h-10 w-10 shrink-0 group">
              <img 
                src={img} 
                alt={`Upload ${idx + 1}`} 
                className="h-full w-full rounded-lg object-cover border border-outline-variant/30 transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -right-1.5 -top-1.5 rounded-full bg-destructive p-0.5 text-white shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/90"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {uploadedImages.length < 3 && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              disabled={isGenerating || disabled}
              className="rounded-xl text-muted-foreground hover:bg-muted h-10 w-10 shrink-0 border border-dashed border-outline-variant/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          )}
        </div>

        <Textarea 
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating || disabled}
          placeholder={placeholder} 
          className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base min-h-[48px] max-h-[160px] py-3 px-2 resize-none disabled:opacity-100 disabled:cursor-not-allowed custom-scrollbar"
        />

        <Button 
          type="submit" 
          size="icon" 
          className={cn(
            "rounded-full shrink-0 w-11 h-11 mb-0.5 transition-all",
            (!isValid || isGenerating || disabled) 
              ? "bg-muted text-muted-foreground opacity-50 shadow-none cursor-not-allowed" 
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95"
          )}
          disabled={!isValid || isGenerating || disabled}
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  )
}
