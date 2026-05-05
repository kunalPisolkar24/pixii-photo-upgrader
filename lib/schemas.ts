import { z } from "zod";

export const GenerateRequestSchema = z.object({
  base64Images: z.array(z.string()).min(1, "At least one input image is required.").max(3, "Maximum 3 images allowed."),
  selectedStyle: z.string().nullable(),
  prompt: z.string().optional(),
  imageCount: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  outputQuality: z.enum(["High", "Medium", "Low", "Test"]),
  aspectRatio: z.enum(["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "auto"]).default("auto"),
  resolution: z.enum(["1k", "2k", "4k"]).default("1k"),
}).refine((data) => {
  const hasStyle = data.selectedStyle !== null;
  const hasValidPrompt = data.prompt && data.prompt.trim().length >= 20;
  return hasStyle || hasValidPrompt;
}, {
  message: "Please select a style chip OR provide a custom prompt with at least 20 characters.",
  path: ["prompt"]
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
