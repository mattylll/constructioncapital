/**
 * Fish Audio TTS helper — POSTs narration text to the Fish Audio REST API
 * and writes the returned MP3 to disk.
 *
 * Auth is via FISH_API_KEY in .env.local. The voice is pinned via
 * FISH_VOICE_ID for brand consistency across all guide videos.
 *
 * The exact endpoint shape depends on which Fish Audio account tier you
 * have. Defaults below match Fish Audio's public REST API (`/v1/tts`).
 * Override via FISH_API_BASE / FISH_TTS_PATH if your account needs them.
 *
 * Usage:
 *   import { synthesise } from "./lib/fish-audio";
 *   const { durationSeconds } = await synthesise({
 *     text: "Bridging finance gives you...",
 *     outPath: "/abs/path/to/scene.mp3",
 *   });
 */

import { writeFileSync } from "fs";
import { mkdirSync } from "fs";
import { dirname } from "path";

const FISH_API_BASE = process.env.FISH_API_BASE ?? "https://api.fish.audio";
const FISH_TTS_PATH = process.env.FISH_TTS_PATH ?? "/v1/tts";

export interface SynthesiseOptions {
  text: string;
  outPath: string;
  /** Voice/model reference. Defaults to env FISH_VOICE_ID. */
  voiceId?: string;
  /** Output format — Fish supports mp3/wav/opus. Default mp3. */
  format?: "mp3" | "wav" | "opus";
  /** Latency mode — "normal" (higher quality) or "balanced". Default normal. */
  latency?: "normal" | "balanced";
  /** Bitrate kbps for mp3. Default 128. */
  mp3Bitrate?: 64 | 128 | 192;
  /** Optional model id (e.g., 's1' for Fish Speech 1.x). Default uses account default. */
  model?: string;
}

export interface SynthesiseResult {
  outPath: string;
  bytes: number;
  /** Duration estimated from MP3 byte length × bitrate. Accurate enough for Remotion sequence timing. */
  durationSeconds: number;
}

export class FishAudioError extends Error {
  constructor(message: string, public status?: number, public body?: string) {
    super(message);
    this.name = "FishAudioError";
  }
}

function getApiKey(): string {
  const key = process.env.FISH_API_KEY;
  if (!key) {
    throw new FishAudioError(
      "FISH_API_KEY not set in .env.local. Add it before running voiceover generation.",
    );
  }
  return key;
}

function getVoiceId(opts: SynthesiseOptions): string {
  const v = opts.voiceId ?? process.env.FISH_VOICE_ID;
  if (!v) {
    throw new FishAudioError(
      "voiceId not provided and FISH_VOICE_ID not set in .env.local.",
    );
  }
  return v;
}

export async function synthesise(opts: SynthesiseOptions): Promise<SynthesiseResult> {
  const apiKey = getApiKey();
  const voiceId = getVoiceId(opts);
  const format = opts.format ?? "mp3";
  const mp3Bitrate = opts.mp3Bitrate ?? 128;

  const body: Record<string, unknown> = {
    text: opts.text,
    reference_id: voiceId, // Fish Audio's name for the voice/model reference
    format,
    mp3_bitrate: mp3Bitrate,
    latency: opts.latency ?? "normal",
  };
  if (opts.model) body.model = opts.model;

  const res = await fetch(`${FISH_API_BASE}${FISH_TTS_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new FishAudioError(
      `Fish Audio TTS failed: ${res.status} ${res.statusText}`,
      res.status,
      text.slice(0, 500),
    );
  }

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) {
    throw new FishAudioError("Fish Audio returned empty body");
  }

  mkdirSync(dirname(opts.outPath), { recursive: true });
  writeFileSync(opts.outPath, buf);

  // Estimate duration from MP3 size and bitrate.
  // size_bytes ÷ (bitrate_kbps × 1000 / 8) = seconds
  // Strip an estimated 200 bytes of headers as a small correction.
  const usableBytes = Math.max(0, buf.length - 200);
  const durationSeconds = format === "mp3"
    ? usableBytes / ((mp3Bitrate * 1000) / 8)
    : NaN;

  return {
    outPath: opts.outPath,
    bytes: buf.length,
    durationSeconds,
  };
}

/** Convert a duration in seconds into Remotion frames (rounded up). */
export function secondsToFrames(seconds: number, fps = 30): number {
  return Math.ceil(seconds * fps);
}
