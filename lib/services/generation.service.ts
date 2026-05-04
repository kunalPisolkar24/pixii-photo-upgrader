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
    return Array.from({ length: count }).map(() => {
      const seed = crypto.randomUUID()
      return `https://picsum.photos/seed/${seed}/800/800`
    })
  }
}
