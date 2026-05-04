import { createHash } from "crypto"

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration")
}

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET

interface CloudinaryUploadResponse {
  secure_url?: string
  error?: {
    message?: string
  }
}

function getUploadSignature(params: Record<string, string>) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&")

  return createHash("sha1")
    .update(`${payload}${cloudinaryApiSecret}`)
    .digest("hex")
}

export async function uploadToCloudinary(base64Image: string, folder: string = "pixii"): Promise<string> {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = getUploadSignature({ folder, timestamp })
    const formData = new FormData()

    formData.append("file", base64Image)
    formData.append("folder", folder)
    formData.append("timestamp", timestamp)
    formData.append("api_key", cloudinaryApiKey)
    formData.append("signature", signature)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
    const uploadResponse = (await response.json()) as CloudinaryUploadResponse

    if (!response.ok || !uploadResponse.secure_url) {
      throw new Error(uploadResponse.error?.message || `Upload failed with status ${response.status}`)
    }

    return uploadResponse.secure_url
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
