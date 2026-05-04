"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-4 bg-background">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      
      <div className="space-y-2 text-center max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected application error occurred. We've been notified and are working on it."}
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => reset()} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button onClick={() => window.location.reload()} variant="default">
          Refresh page
        </Button>
      </div>
      
      {error.digest && (
        <p className="text-[10px] font-mono text-muted-foreground/50">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
