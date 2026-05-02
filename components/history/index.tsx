"use client"

import { X } from "lucide-react"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGenerationStore, type GenerationState } from "../../store/use-generation-store"
import { HistorySearch } from "./history-search"
import { HistoryItem } from "./history-item"

interface HistoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  const history = useGenerationStore((state: GenerationState) => state.history)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full max-w-md ml-auto rounded-none border-l">
        <div className="flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <DrawerTitle className="text-xl font-heading font-semibold tracking-tight">History</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <HistorySearch />

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 pb-8">
              {history.map((item) => (
                <HistoryItem key={item.id} prompt={item.prompt} images={item.images} />
              ))}
              
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">No history yet.</p>
                  <p className="text-xs text-muted-foreground/60">Your generated images will appear here.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
