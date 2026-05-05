import JSZip from "jszip"

export const IMAGE_EXPORT_PRESETS = [
  { id: "1024", label: "1024 x 1024", width: 1024, height: 1024 },
  { id: "1600", label: "1600 x 1600", width: 1600, height: 1600 },
  { id: "2048", label: "2048 x 2048", width: 2048, height: 2048 },
  { id: "3000", label: "3000 x 3000", width: 3000, height: 3000 },
] as const

export type ImageExportPreset = (typeof IMAGE_EXPORT_PRESETS)[number]

interface DownloadImagesAsZipParams {
  images: string[]
  preset: ImageExportPreset
  filenamePrefix: string
}

const CLOUDINARY_UPLOAD_SEGMENT = "/upload/"
const DEFAULT_FILENAME_PREFIX = "pixii-export"

export function getCloudinaryExportUrl(url: string, preset: ImageExportPreset) {
  if (!url.includes("res.cloudinary.com") || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url
  }

  const uploadIndex = url.indexOf(CLOUDINARY_UPLOAD_SEGMENT)
  const prefix = url.slice(0, uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length)
  const suffix = url.slice(uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length)
  const transformation = `c_pad,w_${preset.width},h_${preset.height},b_rgb:ffffff/q_auto/f_jpg`

  return `${prefix}${transformation}/${suffix}`
}

export async function downloadImagesAsZip({
  images,
  preset,
  filenamePrefix,
}: DownloadImagesAsZipParams) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Image export is only available in the browser")
  }

  const exportableImages = images.filter(Boolean)
  if (exportableImages.length === 0) {
    throw new Error("No images are available to export")
  }

  const zip = new JSZip()
  const imageBlobs = await Promise.all(
    exportableImages.map((imageUrl, index) => fetchExportImage(imageUrl, preset, index))
  )

  imageBlobs.forEach(({ blob }, index) => {
    zip.file(createImageFilename(index, preset), blob)
  })

  const archive = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  })

  triggerBrowserDownload(archive, createArchiveFilename(filenamePrefix, preset))
}

async function fetchExportImage(
  imageUrl: string,
  preset: ImageExportPreset,
  index: number
) {
  const exportUrl = getCloudinaryExportUrl(imageUrl, preset)

  try {
    const response = await fetch(exportUrl)
    if (!response.ok) {
      throw new Error(`Image request failed with status ${response.status}`)
    }

    return { blob: await response.blob() }
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown export error"
    throw new Error(`Image ${index + 1} could not be exported. ${detail}`)
  }
}

function createImageFilename(index: number, preset: ImageExportPreset) {
  return `image-${String(index + 1).padStart(2, "0")}-${preset.width}x${preset.height}.jpg`
}

function createArchiveFilename(filenamePrefix: string, preset: ImageExportPreset) {
  const prefix = sanitizeFilename(filenamePrefix) || DEFAULT_FILENAME_PREFIX
  return `${prefix}-${preset.width}x${preset.height}.zip`
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = filename
  anchor.rel = "noopener"
  document.body.append(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
