"use client"

import { Aperture, History, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopNavProps {
  onHistoryClick: () => void
}

export function TopNav({ onHistoryClick }: TopNavProps) {
  return (
    <nav className="flex items-center justify-between px-container py-4 bg-background/80 backdrop-blur-md border-b sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Aperture className="w-5 h-5" />
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Pixii <span className="text-muted-foreground font-normal">Studio</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={onHistoryClick}
        >
          <History className="w-4 h-4" />
          History
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 rounded-md shadow-sm"
        >
          Export
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  )
}
