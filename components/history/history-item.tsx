"use client"

import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGenerationStore } from "@/store/use-generation-store"
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
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium leading-tight text-foreground/90 line-clamp-2">
          {prompt}
        </p>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button size="sm" className="h-8 gap-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold shadow-none">
            Download
            <Download className="w-3.5 h-3.5" />
          </Button>
          
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
