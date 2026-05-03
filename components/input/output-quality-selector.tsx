"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  OUTPUT_QUALITIES,
  type OutputQuality,
} from "@/store/use-generation-store"

interface OutputQualitySelectorProps {
  value: OutputQuality
  onChange: (value: OutputQuality) => void
  disabled?: boolean
}

export function OutputQualitySelector({
  value,
  onChange,
  disabled,
}: OutputQualitySelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const handleSelect = (quality: OutputQuality) => {
    onChange(quality)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="pointer-events-auto relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        className="h-10 rounded-full border-outline-variant/30 bg-card/80 px-3 text-xs text-muted-foreground shadow-sm backdrop-blur-sm hover:bg-card hover:text-foreground disabled:cursor-not-allowed disabled:opacity-100"
        onClick={() => setOpen((current) => !current)}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>{value}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-44 -translate-x-1/2 rounded-xl border border-outline-variant/30 bg-card/95 p-1 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-md sm:right-0 sm:left-auto sm:translate-x-0"
        >
          {OUTPUT_QUALITIES.map((quality) => {
            const selected = value === quality

            return (
              <button
                key={quality}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className={cn(
                  "flex h-9 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  selected && "bg-muted text-foreground"
                )}
                onClick={() => handleSelect(quality)}
              >
                <span>{quality}</span>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
