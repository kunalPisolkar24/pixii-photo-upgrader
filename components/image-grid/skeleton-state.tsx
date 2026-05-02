"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Aperture } from "lucide-react"

export function SkeletonState() {
  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-container">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
        <div className="aspect-square rounded-xl bg-surface-container-low border border-outline-variant/10 flex flex-col items-center justify-center space-y-4 shadow-sm border-dashed">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
            <Aperture className="w-5 h-5 text-primary absolute inset-0 m-auto" />
          </div>
          <span className="text-muted-foreground text-sm font-medium animate-pulse">Rendering lighting...</span>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground/60 font-medium">
        2 / 3 generations left today
      </p>
    </div>
  )
}
