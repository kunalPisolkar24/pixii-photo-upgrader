import { IImageGenerator, GenerationParams, GenerationResult } from "@/lib/interfaces/image-generator.interface"
import { KieImageGenerator } from "@/lib/adapters/kie-image-generator"

export class GenerationService {
  private static generator: IImageGenerator = new KieImageGenerator()

  static async generate(params: GenerationParams): Promise<GenerationResult[]> {
    if (params.outputQuality === "Test") {
      return this.generateTestImages(params.imageCount)
    }

    return this.generator.generate(params)
  }

  private static async generateTestImages(count: number): Promise<GenerationResult[]> {
    return Array.from({ length: count }).map(() => {
      const seed = crypto.randomUUID()
      return {
        url: `https://picsum.photos/seed/${seed}/800/800`
      }
    })
  }
}
