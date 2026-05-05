"use client"

import * as React from "react"
import { ChevronDown, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  downloadImagesAsZip,
  IMAGE_EXPORT_PRESETS,
  type ImageExportPreset,
} from "@/lib/image-export"
import { cn } from "@/lib/utils"

type ButtonProps = React.ComponentProps<typeof Button>
type DropdownContentProps = React.ComponentProps<typeof DropdownMenuContent>

interface ImageExportMenuProps {
  images: string[]
  filenamePrefix: string
  label?: string
  className?: string
  triggerClassName?: string
  labelClassName?: string
  errorClassName?: string
  contentClassName?: string
  ariaLabel?: string
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  align?: DropdownContentProps["align"]
  side?: DropdownContentProps["side"]
  disabled?: boolean
}

export function ImageExportMenu({
  images,
  filenamePrefix,
  label = "Download",
  className,
  triggerClassName,
  labelClassName,
  errorClassName,
  contentClassName,
  ariaLabel,
  variant = "outline",
  size = "sm",
  align = "end",
  side = "bottom",
  disabled = false,
}: ImageExportMenuProps) {
  const [isExporting, setIsExporting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const errorId = React.useId()
  const isDisabled = disabled || isExporting || images.length === 0

  const handleExport = async (preset: ImageExportPreset) => {
    setIsExporting(true)
    setError(null)

    try {
      await downloadImagesAsZip({ images, preset, filenamePrefix })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed"
      setError(message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={cn("inline-flex flex-col items-end gap-1", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={triggerClassName}
            disabled={isDisabled}
            aria-busy={isExporting}
            aria-describedby={error ? errorId : undefined}
            aria-label={ariaLabel ?? `${label} images`}
          >
            <span className={cn(labelClassName)}>
              {isExporting ? "Preparing" : label}
            </span>
            {isExporting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download />
            )}
            <ChevronDown className="opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          side={side}
          className={cn("w-52 min-w-52 max-w-[calc(100vw-2rem)]", contentClassName)}
        >
          <DropdownMenuLabel>Export resolution</DropdownMenuLabel>
          {IMAGE_EXPORT_PRESETS.map((preset) => (
            <DropdownMenuItem
              key={preset.id}
              disabled={isExporting}
              onSelect={() => void handleExport(preset)}
              className="justify-between gap-4 py-2"
            >
              <span>{preset.label}</span>
              <span className="text-xs font-medium text-muted-foreground">
                ZIP
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? (
        <p
          id={errorId}
          role="status"
          aria-live="polite"
          className={cn(
            "max-w-52 text-right text-xs leading-snug text-destructive",
            errorClassName
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
