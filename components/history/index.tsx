"use client"

import { useState, useMemo, useDeferredValue } from "react"
import { X, SearchX } from "lucide-react"
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
  const [searchQuery, setSearchQuery] = useState("")
  const deferredQuery = useDeferredValue(searchQuery)

  const filteredHistory = useMemo(() => {
    if (!deferredQuery.trim()) return history
    const query = deferredQuery.toLowerCase()
    return history.filter(item => item.prompt.toLowerCase().includes(query))
  }, [history, deferredQuery])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-[100dvh] w-full sm:max-w-md ml-auto rounded-none border-l">
        <div className="flex flex-col h-full overflow-hidden">
          <DrawerHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <DrawerTitle className="text-xl font-heading font-semibold tracking-tight">History</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <HistorySearch value={searchQuery} onChange={setSearchQuery} />

          <ScrollArea className="flex-1 min-h-0 px-6">
            <div className="space-y-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
              {filteredHistory.map((item) => (
                <HistoryItem key={item.id} id={item.id} prompt={item.prompt} images={item.images} />
              ))}
              
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <p className="text-muted-foreground text-sm font-medium">No history yet.</p>
                  <p className="text-xs text-muted-foreground/60">Your generated images will appear here.</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground/50">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">No results found</p>
                    <p className="text-xs text-muted-foreground/60">Try searching for something else</p>
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
