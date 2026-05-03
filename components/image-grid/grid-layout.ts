import { cn } from "@/lib/utils"

export function getImageGridLayoutClassName(itemCount: number) {
  return cn(
    "mx-auto grid w-full grid-cols-1 gap-6 px-container",
    itemCount === 1 ? "max-w-xl" : "max-w-5xl md:grid-cols-2"
  )
}
