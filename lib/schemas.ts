import { z } from "zod";

export const GenerateRequestSchema = z.object({
  base64Image: z.string().min(1, "An input image is required."),
  selectedStyle: z.string().nullable(),
  prompt: z.string().optional(),
  imageCount: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  outputQuality: z.enum(["High", "Medium", "Low", "Test"]),
}).refine((data) => {
  const hasStyle = data.selectedStyle !== null;
  const hasValidPrompt = data.prompt && data.prompt.trim().length >= 20;
  return hasStyle || hasValidPrompt;
}, {
  message: "Please select a style chip OR provide a custom prompt with at least 20 characters.",
  path: ["prompt"]
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
