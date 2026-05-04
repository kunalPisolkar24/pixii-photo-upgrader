import { uploadToCloudinary } from "@/lib/cloudinary"
import { IImageGenerator, GenerationParams } from "@/lib/interfaces/image-generator.interface"
import { PuterImageGenerator } from "@/lib/adapters/puter-image-generator"

export class GenerationService {
  private static generator: IImageGenerator = new PuterImageGenerator()

  static async generate(params: GenerationParams): Promise<string[]> {
    if (params.outputQuality === "Test") {
      return this.generateTestImages(params.imageCount)
    }

    return this.generator.generate(params)
  }

  private static async generateTestImages(count: number): Promise<string[]> {
    const testPromises = Array.from({ length: count }).map(async () => {
      const seed = crypto.randomUUID()
      const response = await fetch(`https://picsum.photos/seed/${seed}/800/800`)
      const buffer = await response.arrayBuffer()
      const base64 = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`
      return uploadToCloudinary(base64, "pixii-tests")
    })
    return Promise.all(testPromises)
  }
}
