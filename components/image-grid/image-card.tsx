"use client"

import { cn } from "@/lib/utils"

interface ImageCardProps {
  src: string
  alt: string
}

export function ImageCard({ src, alt }: ImageCardProps) {
  return (
    <div 
      className={cn(
        "aspect-square rounded-xl overflow-hidden bg-card border border-outline-variant/20 shadow-ambient transition-all duration-700 hover:shadow-lg hover:border-primary/20 group"
      )}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
    </div>
  )
}
