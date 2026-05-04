"use client"

import { useState, useEffect } from "react"
import { TopNav } from "@/components/top-nav"
import { HistoryDrawer } from "@/components/history"
import { ImageGrid } from "@/components/image-grid"
import { FloatingInput } from "@/components/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGenerationStore } from "@/store/use-generation-store"

export default function Page() {
  const [historyOpen, setHistoryOpen] = useState(false)
  const fetchQuota = useGenerationStore((state) => state.fetchQuota)

  useEffect(() => {
    fetchQuota()
  }, [fetchQuota])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background selection:bg-primary/10 selection:text-primary">
      <TopNav onHistoryClick={() => setHistoryOpen(true)} />

      <ScrollArea className="min-h-0 flex-1 overflow-hidden">
        <main className="flex min-h-full flex-col pb-[calc(11rem+env(safe-area-inset-bottom))] sm:pb-56">
          <ImageGrid />
        </main>
      </ScrollArea>

      <FloatingInput />

      <HistoryDrawer open={historyOpen} onOpenChange={setHistoryOpen} />
    </div>
  )
}
