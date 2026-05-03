import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { imageCount } = await request.json()

  // Mock processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const mockImages = [
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
    `https://images.unsplash.com/photo-1774624513295-a0bac2eb4661?q=80&w=870&auto=format`,
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800`,
    `https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800`,
  ]

  const generatedImages = mockImages.slice(0, imageCount || 4)

  return NextResponse.json({
    images: generatedImages,
  })
}
