"use client"

import { Aperture, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGenerationStore } from "@/store/use-generation-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { ImageExportMenu } from "@/components/image-export-menu"

interface TopNavProps {
  onHistoryClick: () => void
}

export function TopNav({ onHistoryClick }: TopNavProps) {
  const currentGenerations = useGenerationStore((state) => state.currentGenerations)
  const hasImages = currentGenerations.length > 0

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-4 py-3 backdrop-blur-md sm:px-container sm:py-4">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Aperture className="h-5 w-5" />
        </div>
        <span className="truncate font-heading text-lg font-semibold tracking-tight text-foreground">
          Pixii{" "}
          <span className="font-normal text-muted-foreground">Studio</span>
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 px-2 text-muted-foreground hover:text-foreground sm:gap-2 sm:px-2.5"
          onClick={onHistoryClick}
          aria-label="Open history"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
        {hasImages && (
          <ImageExportMenu
            images={currentGenerations}
            filenamePrefix="pixii-current"
            label="Export"
            ariaLabel="Export current images"
            variant="outline"
            size="sm"
            triggerClassName="gap-1 rounded-md px-2 shadow-sm sm:gap-2 sm:px-2.5"
            labelClassName="hidden sm:inline"
          />
        )}
      </div>
    </nav>
  )
}
