"use client"

import { Button } from "@/components/ui/button"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  disabled?: boolean
}

export function SuggestionChips({ suggestions, onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="flex items-center gap-2 pointer-events-auto">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          disabled={disabled}
          className="rounded-full bg-white/80 backdrop-blur-sm border-outline-variant/30 text-muted-foreground text-xs hover:bg-white hover:text-foreground transition-all h-9 px-4 shadow-sm"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
