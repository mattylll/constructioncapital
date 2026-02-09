/**
 * Generate Images Script
 *
 * Uses Google Gemini API (Imagen 3) to generate images for the website.
 * Generates hero image, testimonial portrait, and other assets.
 *
 * Usage:
 *   npx tsx scripts/generate-images.ts
 *
 * Requires:
 *   - GEMINI_API_KEY in .env.local or environment
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Env loader (reused from generate-content.ts)
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  return true;
}

function loadEnv(): void {
  const root = path.resolve(__dirname, "..");
  loadEnvFile(path.join(root, ".env.local")) ||
    loadEnvFile(path.join(root, ".env"));
}

// ---------------------------------------------------------------------------
// Image generation prompts
// ---------------------------------------------------------------------------

interface ImageTask {
  name: string;
  filename: string;
  prompt: string;
}

const IMAGE_TASKS: ImageTask[] = [
  {
    name: "Hero Image",
    filename: "hero-woman-site.png",
    prompt:
      "Professional photograph of a confident woman in her 30s wearing a hard hat and high-visibility vest, standing at a modern residential construction development site in London. She is holding architectural plans and looking at the camera with a warm, professional smile. Behind her is a partially completed luxury apartment building with cranes and scaffolding visible. Golden hour lighting, sharp focus, editorial quality photography. The scene conveys expertise, confidence, and modern property development. Photorealistic, 16:9 aspect ratio, high resolution.",
  },
  {
    name: "Testimonial Portrait - Developer",
    filename: "testimonial-developer.png",
    prompt:
      "Professional corporate headshot portrait of a British man in his 40s, wearing a navy blue suit with a white shirt and no tie. He has a confident, approachable expression with a slight smile. Clean, neutral blurred office background with warm lighting. The image conveys trustworthiness and success. Professional photography, shallow depth of field, sharp focus on the face. Square crop portrait format.",
  },
  {
    name: "Testimonial Portrait - Architect",
    filename: "testimonial-architect.png",
    prompt:
      "Professional corporate headshot portrait of a British woman in her late 30s, wearing smart business attire - a dark blazer. She has a warm, genuine smile and looks directly at the camera. Clean, modern office background slightly blurred. Natural lighting, professional photography quality. The image conveys expertise and approachability. Square crop portrait format.",
  },
  {
    name: "London Skyline Development",
    filename: "london-development.png",
    prompt:
      "Aerial view of a modern residential property development under construction in London. Multiple apartment buildings in various stages of completion with tower cranes. The city skyline is visible in the background with recognisable landmarks. Blue sky with some clouds, golden hour light creating warm tones. Professional architectural photography, wide angle, high resolution.",
  },
];

// ---------------------------------------------------------------------------
// Gemini API - Image Generation using Imagen 3
// ---------------------------------------------------------------------------

async function generateImageWithGemini(
  prompt: string,
  apiKey: string
): Promise<Buffer> {
  // Use nano-banana-pro-preview for image generation
  const url = `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();

  // Extract image from response
  const candidates = data.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error("No candidates in Gemini response");
  }

  const parts = candidates[0].content?.parts;
  if (!parts) {
    throw new Error("No parts in Gemini response");
  }

  // Find the inline_data part with the image
  for (const part of parts) {
    if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
      const base64Data = part.inlineData.data;
      return Buffer.from(base64Data, "base64");
    }
  }

  throw new Error(
    "No image data found in Gemini response. Parts: " +
      JSON.stringify(parts.map((p: Record<string, unknown>) => Object.keys(p)))
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  loadEnv();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[error] GEMINI_API_KEY not found. Set it in .env.local");
    process.exit(1);
  }

  const outputDir = path.resolve(__dirname, "..", "public", "images");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`[info] Output directory: ${outputDir}`);
  console.log(`[info] Generating ${IMAGE_TASKS.length} images...\n`);

  let success = 0;
  let failed = 0;

  for (const task of IMAGE_TASKS) {
    const outputPath = path.join(outputDir, task.filename);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  [skip] ${task.name} → ${task.filename} (already exists)`);
      success++;
      continue;
    }

    console.log(`  [gen] ${task.name}...`);

    try {
      const imageBuffer = await generateImageWithGemini(task.prompt, apiKey);
      fs.writeFileSync(outputPath, imageBuffer);

      const sizeKb = (imageBuffer.length / 1024).toFixed(0);
      console.log(
        `  [done] ${task.name} → ${task.filename} (${sizeKb} KB)`
      );
      success++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  [fail] ${task.name}: ${message}`);
      failed++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log("\n========================================");
  console.log("  Image generation complete");
  console.log(`  Success: ${success}`);
  console.log(`  Failed:  ${failed}`);
  console.log("========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
