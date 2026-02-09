import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

// Read API key from .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const apiKey = envContent
  .split("\n")
  .find((line) => line.startsWith("GEMINI_API_KEY="))
  ?.split("=")[1]
  ?.trim();

if (!apiKey) {
  console.error("No GEMINI_API_KEY found in .env.local");
  process.exit(1);
}

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`;

async function generateImage(prompt, filename) {
  console.log(`\nGenerating: ${filename}`);
  console.log(`Prompt: ${prompt.slice(0, 100)}...`);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`API error for ${filename}:`, error);
    return false;
  }

  const data = await response.json();

  // Find image part in response
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        const outputPath = path.join(IMAGES_DIR, filename);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Saved: ${outputPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
        return true;
      }
    }
  }

  console.error(`No image found in response for ${filename}`);
  console.log("Response:", JSON.stringify(data).slice(0, 500));
  return false;
}

const images = [
  {
    filename: "hero-woman-site.png",
    prompt:
      "Professional photograph of a confident woman in her 30s at a modern construction development site. She wears a smart navy blazer over a white blouse with a hard hat, holding architectural blueprints. Behind her is a partially completed luxury residential building with cranes and scaffolding. Golden hour lighting, warm tones. The image should feel premium, editorial quality like a Financial Times profile photo. Shallow depth of field, shot on a 85mm lens. No text or watermarks.",
  },
  {
    filename: "testimonial-developer.png",
    prompt:
      "Professional headshot portrait of a British man in his 40s named James, a property developer. He has short brown hair, clean-shaven, wearing a navy suit with an open collar white shirt. Confident, approachable expression. Neutral grey background with soft studio lighting. High-end corporate portrait style. Square crop suitable for a circular avatar. No text or watermarks.",
  },
  {
    filename: "testimonial-architect.png",
    prompt:
      "Professional headshot portrait of an East Asian woman in her 30s named Sarah, a managing partner at a property group. She has shoulder-length dark hair, wearing a charcoal blazer with a cream blouse. Confident, intelligent expression. Neutral grey background with soft studio lighting. High-end corporate portrait style. Square crop suitable for a circular avatar. No text or watermarks.",
  },
];

async function main() {
  console.log("Generating images with Gemini API...");
  console.log(`Output directory: ${IMAGES_DIR}`);

  for (const img of images) {
    try {
      await generateImage(img.prompt, img.filename);
    } catch (err) {
      console.error(`Failed to generate ${img.filename}:`, err.message);
    }
  }

  console.log("\nDone!");
}

main();
