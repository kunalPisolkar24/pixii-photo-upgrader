"use client"

import { Aperture, History, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGenerationStore } from "@/store/use-generation-store"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopNavProps {
  onHistoryClick: () => void
}

export function TopNav({ onHistoryClick }: TopNavProps) {
  const hasImages = useGenerationStore(
    (state) => state.currentGenerations.length > 0
  )

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-background/80 px-container py-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Aperture className="h-5 w-5" />
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Pixii{" "}
          <span className="font-normal text-muted-foreground">Studio</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onHistoryClick}
        >
          <History className="h-4 w-4" />
          History
        </Button>
        {hasImages && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-md shadow-sm"
          >
            Export
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  )
}
