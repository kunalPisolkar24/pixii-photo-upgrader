"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoryItemProps {
  prompt: string
  images: string[]
}

export function HistoryItem({ prompt, images }: HistoryItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-tight text-foreground/90 line-clamp-2">
          {prompt}
        </p>
        <Button size="sm" className="h-8 gap-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold shrink-0 shadow-none">
          Download
          <Download className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className="aspect-square rounded-lg bg-muted overflow-hidden border border-outline-variant/10"
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
