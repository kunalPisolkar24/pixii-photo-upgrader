"use client"

import { Button } from "@/components/ui/button"

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
  disabled?: boolean
}

export function SuggestionChips({
  suggestions,
  onSelect,
  disabled,
}: SuggestionChipsProps) {
  return (
    <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          disabled={disabled}
          className="h-9 rounded-full border-outline-variant/30 bg-card/80 px-3 text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-100 sm:px-4"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
