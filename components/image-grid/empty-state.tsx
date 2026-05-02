"use client"

import { Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-container">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
           <Sparkles className="w-8 h-8 opacity-20" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-foreground/80 tracking-tight">Start creating</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Describe your product background below to generate high-quality Amazon listings instantly.
        </p>
      </div>
    </div>
  )
}
