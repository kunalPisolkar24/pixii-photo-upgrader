"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { HistoryDrawer } from "@/components/history-drawer"
import { ImageGrid } from "@/components/image-grid"
import { FloatingInput } from "@/components/floating-input"

export default function Page() {
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary overflow-x-hidden">
      <TopNav onHistoryClick={() => setHistoryOpen(true)} />
      
      <main className="flex-1 flex flex-col pt-12 pb-56">
        <ImageGrid />
      </main>

      <FloatingInput />
      
      <HistoryDrawer 
        open={historyOpen} 
        onOpenChange={setHistoryOpen} 
      />
    </div>
  )
}
