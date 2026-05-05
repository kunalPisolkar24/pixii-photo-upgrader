"use client"

import { useState } from "react"
import { 
  Settings2, 
  Square, 
  Columns2, 
  Grid2X2, 
  Check,
  ChevronDown,
  Monitor,
  Smartphone,
  Maximize,
  Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger,
  DrawerFooter,
  DrawerClose
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { ImageGenerationCount, OutputQuality, AspectRatio, Resolution } from "@/lib/types"

interface GenerationOptionsProps {
  imageCount: ImageGenerationCount
  onImageCountChange: (value: ImageGenerationCount) => void
  quality: OutputQuality
  onQualityChange: (value: OutputQuality) => void
  aspectRatio: AspectRatio
  onAspectRatioChange: (value: AspectRatio) => void
  resolution: Resolution
  onResolutionChange: (value: Resolution) => void
  styles: string[]
  selectedStyle: string | null
  onStyleSelect: (style: string | null) => void
  disabled?: boolean
}

const ASPECT_RATIOS: { value: AspectRatio; label: string; description: string }[] = [
  { value: "auto", label: "Auto", description: "Model decides" },
  { value: "1:1", label: "1:1", description: "Square" },
  { value: "4:5", label: "4:5", description: "Instagram" },
  { value: "9:16", label: "9:16", description: "Vertical / Reels" },
  { value: "3:4", label: "3:4", description: "Portrait" },
  { value: "2:3", label: "2:3", description: "Portrait" },
  { value: "4:3", label: "4:3", description: "Standard" },
  { value: "3:2", label: "3:2", description: "Landscape" },
  { value: "16:9", label: "16:9", description: "Widescreen" },
  { value: "21:9", label: "21:9", description: "Cinematic" },
  { value: "5:4", label: "5:4", description: "Landscape" },
]

const MODELS: { value: OutputQuality; label: string; description: string }[] = [
  { value: "High" as OutputQuality, label: "High Quality", description: "Nano Banana 2" },
  { value: "Medium" as OutputQuality, label: "Balanced", description: "Nano Banana Pro" },
  { value: "Low" as OutputQuality, label: "Fast", description: "Nano Banana Edit" },
  { value: "Test" as OutputQuality, label: "Test", description: "Low cost preview" },
].filter(model => process.env.NODE_ENV === "development" || model.value !== "Test")

const RESOLUTIONS: Resolution[] = ["1k", "2k", "4k"]

const AspectRatioIcon = ({ ratio, isSelected }: { ratio: AspectRatio; isSelected: boolean }) => {
  if (ratio === "auto") {
    return <Sparkles className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground/60")} />
  }
  
  const [w, h] = ratio.split(":").map(Number)
  const isPortrait = h > w
  const isSquare = w === h
  
  return (
    <div 
      className={cn(
        "rounded-[2px] border-[1.5px] transition-colors",
        isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/40"
      )}
      style={{ 
        width: isSquare ? "14px" : isPortrait ? "12px" : "18px",
        height: isSquare ? "14px" : isPortrait ? "18px" : "12px",
      }} 
    />
  )
}

export function GenerationOptions({
  imageCount,
  onImageCountChange,
  quality,
  onQualityChange,
  aspectRatio,
  onAspectRatioChange,
  resolution,
  onResolutionChange,
  styles,
  selectedStyle,
  onStyleSelect,
  disabled
}: GenerationOptionsProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [isOpen, setIsOpen] = useState(false)

  const showResolution = quality === "High" || quality === "Medium"

  const OptionsContent = () => (
    <div className="flex flex-col gap-6 p-4 sm:p-2">
      {/* Styles */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Visual Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map((style) => {
            const isSelected = selectedStyle === style
            return (
              <Button
                key={style}
                variant="outline"
                size="sm"
                className={cn(
                  "h-10 rounded-xl border-outline-variant/30 bg-secondary/30 text-[11px]",
                  isSelected && "border-primary bg-primary/10 text-primary"
                )}
                onClick={() => onStyleSelect(isSelected ? null : style)}
              >
                {style}
              </Button>
            )
          })}
        </div>
      </div>

      <DropdownMenuSeparator className="hidden sm:block" />

      {/* Batch Count */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Batch Count
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 4].map((count) => {
            const Icon = count === 1 ? Square : count === 2 ? Columns2 : Grid2X2
            const isSelected = imageCount === count
            return (
              <Button
                key={count}
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 flex-col gap-1 rounded-xl border-outline-variant/30 bg-secondary/30",
                  isSelected && "border-primary bg-primary/10 text-primary"
                )}
                onClick={() => onImageCountChange(count as ImageGenerationCount)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-medium">{count} Image{count > 1 ? "s" : ""}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <DropdownMenuSeparator className="hidden sm:block" />

      {/* Model Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Model
        </label>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map((model) => {
            const isSelected = quality === model.value
            return (
              <Button
                key={model.value}
                variant="outline"
                size="sm"
                className={cn(
                  "h-auto flex-col items-start gap-0.5 rounded-xl border-outline-variant/30 bg-secondary/30 p-3 text-left",
                  isSelected && "border-primary bg-primary/10 text-primary"
                )}
                onClick={() => onQualityChange(model.value)}
              >
                <span className="text-xs font-semibold">{model.label}</span>
                <span className="text-[10px] opacity-60">{model.description}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <DropdownMenuSeparator className="hidden sm:block" />

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-3">
          {ASPECT_RATIOS.map((ratio) => {
            const isSelected = aspectRatio === ratio.value
            return (
              <Button
                key={ratio.value}
                variant="outline"
                size="sm"
                className={cn(
                  "flex h-14 flex-col gap-1.5 rounded-xl border-outline-variant/30 bg-secondary/30 p-1 transition-all",
                  isSelected && "border-primary bg-primary/10 text-primary"
                )}
                onClick={() => onAspectRatioChange(ratio.value)}
              >
                <AspectRatioIcon ratio={ratio.value} isSelected={isSelected} />
                <span className="text-[10px] font-medium">{ratio.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {showResolution && (
        <>
          <DropdownMenuSeparator className="hidden sm:block" />
          {/* Resolution */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RESOLUTIONS.map((res) => {
                const isSelected = resolution === res
                return (
                  <Button
                    key={res}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-10 rounded-xl border-outline-variant/30 bg-secondary/30 uppercase text-[11px]",
                      isSelected && "border-primary bg-primary/10 text-primary"
                    )}
                    onClick={() => onResolutionChange(res)}
                  >
                    {res}
                  </Button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )

  const TriggerButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      className="pointer-events-auto flex h-10 items-center gap-2 rounded-full border-outline-variant/30 bg-card/80 px-4 py-2 shadow-sm backdrop-blur-sm transition-all hover:bg-muted"
    >
      <Settings2 className="h-4 w-4" />
      <span className="hidden text-xs font-medium sm:inline">Options</span>
      <span className="text-[11px] font-semibold text-muted-foreground">
        {quality} • {aspectRatio}
      </span>
      <ChevronDown className={cn("h-3 w-3 opacity-70 transition-transform", isOpen && "rotate-180")} />
    </Button>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="rounded-t-[2rem]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="px-4 text-xl font-bold tracking-tight">Generation Settings</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="h-[70vh] w-full px-4 pb-8">
            <OptionsContent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="center" 
        side="top" 
        sideOffset={12}
        className="w-[320px] rounded-[1.5rem] border-outline-variant/30 bg-card/95 p-0 shadow-2xl backdrop-blur-xl"
      >
        <ScrollArea className="h-[480px] w-full">
          <div className="p-2">
            <OptionsContent />
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
