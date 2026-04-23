/**
 * YouTube video IDs for location market update videos.
 * Key format: "countySlug/townSlug" → YouTube video ID.
 *
 * Populated after batch upload to YouTube.
 * Generate with: node remotion/scripts/upload-youtube.mjs (future)
 */
export const LOCATION_VIDEOS: Record<string, string> = {
  // Example (uncomment after upload):
  // "hertfordshire/st-albans": "dQw4w9WgXcQ",
};

export function getLocationVideoId(
  countySlug: string,
  townSlug: string,
): string | undefined {
  return LOCATION_VIDEOS[`${countySlug}/${townSlug}`];
}
