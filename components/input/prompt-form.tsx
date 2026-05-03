"use client"

import { useRef } from "react"
import { Paperclip, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn, compressImage } from "@/lib/utils"

interface PromptFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isGenerating: boolean
  uploadedImage: string | null
  onImageUpload: (image: string | null) => void
  isValid: boolean
  disabled?: boolean
}

export function PromptForm({ 
  value, 
  onChange, 
  onSubmit, 
  isGenerating,
  uploadedImage,
  onImageUpload,
  isValid,
  disabled 
}: PromptFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string)
        onImageUpload(compressed)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form 
      onSubmit={onSubmit}
      className={cn(
        "w-full max-w-2xl bg-card rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-outline-variant/20 flex items-center p-2 pl-3 gap-2 pointer-events-auto transition-all duration-300"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {uploadedImage ? (
        <div className="relative h-10 w-10 shrink-0">
          <img 
            src={uploadedImage} 
            alt="Upload preview" 
            className="h-full w-full rounded-lg object-cover border border-outline-variant/30"
          />
          <button
            type="button"
            onClick={() => onImageUpload(null)}
            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white shadow-sm hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          disabled={isGenerating || disabled}
          className="rounded-full text-muted-foreground hover:bg-muted h-10 w-10 shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
      )}

      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isGenerating || disabled}
        placeholder={disabled ? "Quota exceeded for today" : "Describe your custom background..."} 
        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 px-2 disabled:opacity-100 disabled:cursor-not-allowed"
      />

      <Button 
        type="submit" 
        size="icon" 
        className={cn(
          "rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 w-11 h-11 transition-all active:scale-95",
          (!isValid || isGenerating || disabled) && "disabled:opacity-100 disabled:cursor-not-allowed"
        )}
        disabled={!isValid || isGenerating || disabled}
      >
        <Send className="w-5 h-5 text-white" />
      </Button>
    </form>
  )
}
