"use client"

import { Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PromptFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isGenerating: boolean
}

export function PromptForm({ value, onChange, onSubmit, isGenerating }: PromptFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className={cn(
        "w-full max-w-2xl bg-card rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-outline-variant/20 flex items-center p-2 pl-3 gap-2 pointer-events-auto transition-all duration-300"
      )}
    >
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="rounded-full text-muted-foreground hover:bg-muted h-10 w-10"
      >
        <Paperclip className="w-5 h-5" />
      </Button>

      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isGenerating}
        placeholder="Describe your custom background..." 
        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 px-2 disabled:opacity-100 disabled:cursor-not-allowed"
      />

      <Button 
        type="submit" 
        size="icon" 
        className={cn(
          "rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shrink-0 w-11 h-11 transition-all active:scale-95",
          isGenerating && "disabled:opacity-100 disabled:cursor-not-allowed"
        )}
        disabled={!value.trim() || isGenerating}
      >
        <Send className="w-5 h-5 text-white" />
      </Button>
    </form>
  )
}
