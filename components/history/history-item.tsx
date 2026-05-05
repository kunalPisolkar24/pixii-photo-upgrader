"use client"

import { Trash2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useGenerationStore } from "@/store/use-generation-store"
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary-url"
import { ImageExportMenu } from "@/components/image-export-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistoryItemProps {
  id: string
  prompt: string
  images: string[]
}

export function HistoryItem({ id, prompt, images }: HistoryItemProps) {
  const removeHistoryItem = useGenerationStore((state) => state.removeHistoryItem)

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <p className="text-sm font-medium leading-tight text-foreground/90 line-clamp-2 sm:flex-1">
          {prompt}
        </p>
        <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start">
          <ImageExportMenu
            images={images}
            filenamePrefix={`pixii-${prompt || id}`}
            label="Download"
            ariaLabel="Download generation images"
            size="sm"
            triggerClassName="h-8 gap-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary shadow-none hover:bg-primary/20"
            errorClassName="max-w-44 text-[11px]"
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon-sm" 
                className="shadow-none"
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove generation</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this generation and its images from your history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  variant="destructive"
                  onClick={() => removeHistoryItem(id)}
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 xs:grid-cols-4">
        {images.map((img) => (
          <div 
            key={img} 
            className="relative aspect-square rounded-lg bg-muted overflow-hidden border border-outline-variant/10"
          >
            <Image 
              src={getOptimizedCloudinaryUrl(img, 400, 400)} 
              alt="" 
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 150px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
