import { v2 as cloudinary } from "cloudinary"

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadToCloudinary(base64Image: string, folder: string = "pixii"): Promise<string> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: "auto",
    })
    return uploadResponse.secure_url
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export function getOptimizedCloudinaryUrl(url: string, width = 800, height = 800) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return url
  const parts = url.split("/upload/")
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`
}

export default cloudinary
