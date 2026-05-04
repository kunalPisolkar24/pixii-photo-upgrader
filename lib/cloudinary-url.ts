export function getOptimizedCloudinaryUrl(url: string, width = 800, height = 800) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return url
  const parts = url.split("/upload/")
  if (parts.length !== 2) return url
  return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`
}
