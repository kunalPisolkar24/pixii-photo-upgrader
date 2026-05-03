import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function compressImage(base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> {
  if (typeof window === "undefined") return base64Str

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64Str
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = (e) => reject(e)
  })
}

export function getOptimizedCloudinaryUrl(url: string, width = 800, height = 800) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return url
  const parts = url.split("/upload/")
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`
}
