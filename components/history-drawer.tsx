"use client"

import { Search, Download, X } from "lucide-react"
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGenerationStore } from "@/store/use-generation-store"

interface HistoryDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HistoryDrawer({ open, onOpenChange }: HistoryDrawerProps) {
  const history = useGenerationStore((state) => state.history)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full max-w-md ml-auto rounded-none border-l">
        <div className="flex flex-col h-full">
          <DrawerHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
            <DrawerTitle className="text-xl font-heading font-semibold">History</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search your previous prompts..." 
                className="pl-9 bg-surface-container-low border-none rounded-xl h-11"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-6">
            <div className="space-y-8 pb-8">
              {history.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-medium leading-tight text-foreground/90">
                      {item.prompt}
                    </p>
                    <Button variant="secondary" size="sm" className="h-8 gap-1.5 rounded-lg text-primary text-xs font-semibold">
                      Download
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {item.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-lg bg-surface-container overflow-hidden"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <p className="text-muted-foreground text-sm">No history yet.</p>
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
