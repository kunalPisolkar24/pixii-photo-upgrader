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

export default cloudinary
