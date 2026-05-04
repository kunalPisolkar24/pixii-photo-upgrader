export async function compressImage(
  base64Str: string, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.8,
  timeoutMs = 10000
): Promise<string> {
  if (typeof window === "undefined") return base64Str

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Image compression timed out"))
    }, timeoutMs)

    const img = new Image()
    img.src = base64Str
    
    img.onload = () => {
      clearTimeout(timeout)
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

    img.onerror = (e) => {
      clearTimeout(timeout)
      reject(new Error("Failed to load image for compression"))
    }
  })
}
