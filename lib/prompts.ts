export const INTENTIONS = [
  "Professional studio product photography of the product isolated on a pure white background, central composition, clean minimalist style",
  "Product in a simple ambient real-life setting, natural lighting, lifestyle photography, authentic environment",
  "Product displayed on a sleek modern podium or geometric presentation surface, elegant hero shot, dynamic studio lighting",
  "Extreme close-up macro shot of the product, emphasizing fine details, textures, and material quality"
];

const HARD_CONSTRAINTS = "CRITICAL RULES: The product must remain completely unmodified. Do not change the shape, text, or color of the product. The scene must be purely inanimate. Absolutely NO hands, NO people, NO faces, NO body parts, NO text, and NO unrelated objects.";

export function buildPrompt(index: number, userPrompt?: string, style?: string): string {
  const intent = INTENTIONS[index % INTENTIONS.length];
  const styleStr = style ? `Aesthetic and lighting style: ${style}.` : "neutral professional lighting.";
  const customStr = userPrompt ? `Environmental context: ${userPrompt}.` : "";
  
  return `${intent}. ${customStr} ${styleStr} ${HARD_CONSTRAINTS}`;
}
