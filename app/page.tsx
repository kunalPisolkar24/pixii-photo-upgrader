"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { HistoryDrawer } from "@/components/history"
import { ImageGrid } from "@/components/image-grid"
import { FloatingInput } from "@/components/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Page() {
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary overflow-hidden">
      <TopNav onHistoryClick={() => setHistoryOpen(true)} />
      
      <ScrollArea className="flex-1 min-h-0 overflow-hidden">
        <main className="flex flex-col min-h-full pb-56">
          <ImageGrid />
        </main>
      </ScrollArea>

      <FloatingInput />
      
      <HistoryDrawer 
        open={historyOpen} 
        onOpenChange={setHistoryOpen} 
      />
    </div>
  )
}
