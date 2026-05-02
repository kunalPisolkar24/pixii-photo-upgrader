"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HistorySearch() {
  return (
    <div className="px-6 py-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search your previous prompts..." 
          className="pl-9 bg-surface-container-low border-none rounded-xl h-11"
        />
      </div>
    </div>
  )
}
