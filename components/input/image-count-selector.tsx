"use client"

import type { ComponentType } from "react"
import { Columns2, Grid2X2, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ImageGenerationCount } from "@/store/use-generation-store"

interface ImageCountSelectorProps {
  value: ImageGenerationCount
  onChange: (value: ImageGenerationCount) => void
  disabled?: boolean
}

interface ImageCountOption {
  value: ImageGenerationCount
  label: string
  icon: ComponentType<{ className?: string }>
}

const IMAGE_COUNT_OPTIONS: ImageCountOption[] = [
  { value: 1, label: "Generate 1 image", icon: Square },
  { value: 2, label: "Generate 2 images", icon: Columns2 },
  { value: 4, label: "Generate 4 images", icon: Grid2X2 },
]

export function ImageCountSelector({
  value,
  onChange,
  disabled,
}: ImageCountSelectorProps) {
  return (
    <div
      className="pointer-events-auto inline-flex items-center rounded-full border border-outline-variant/30 bg-card/80 p-1 shadow-sm backdrop-blur-sm"
      aria-label="Number of images to generate"
    >
      {IMAGE_COUNT_OPTIONS.map((option) => {
        const Icon = option.icon
        const isSelected = value === option.value

        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-pressed={isSelected}
            aria-label={option.label}
            title={option.label}
            className={cn(
              "h-8 rounded-full px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-100",
              isSelected &&
                "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => onChange(option.value)}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{option.value}</span>
          </Button>
        )
      })}
    </div>
  )
}
