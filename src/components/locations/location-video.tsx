"use client";

import { useState } from "react";
import { Play } from "lucide-react";

import {
  EditorialSection,
  SectionHeader,
} from "@/components/editorial/primitives";

interface LocationVideoProps {
  townName: string;
  countyName: string;
  countySlug: string;
  townSlug: string;
  youtubeId?: string;
}

/**
 * Embeds a YouTube video for the location market update.
 * Uses privacy-enhanced mode (youtube-nocookie.com) and lazy loading.
 * Only renders when a youtubeId is provided.
 */
export function LocationVideo({
  townName,
  countyName,
  youtubeId,
}: LocationVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;

  return (
    <EditorialSection tone="stone">
      <SectionHeader
        tone="stone"
        eyebrow="Market update"
        title={
          <>
            {townName}
            <br />
            <span className="italic" style={{ color: "var(--navy)" }}>
              property market video.
            </span>
          </>
        }
        body={`Watch our data-driven market update for ${townName}, ${countyName} — prices, transactions and development opportunities.`}
      />

      <div className="mt-16 mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden border aspect-video"
          style={{ borderColor: "var(--stone-dark)", background: "var(--navy-dark)" }}
        >
          {isPlaying ? (
            <iframe
              src={embedUrl}
              title={`${townName} Property Market Update - Construction Capital`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading="lazy"
            />
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="group absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${townName} market update video`}
            >
              {/* YouTube thumbnail */}
              <img
                src={thumbnailUrl}
                alt={`${townName} property market update thumbnail`}
                className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                loading="lazy"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, oklch(0.12 0.045 255 / 0.2) 0%, oklch(0.12 0.045 255 / 0.55) 100%)",
                }}
              />

              {/* Play button overlay */}
              <div
                className="relative z-10 flex h-20 w-20 items-center justify-center border transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "var(--gold)",
                  borderColor: "var(--gold-dark)",
                }}
              >
                <Play className="ml-1 h-7 w-7" fill="currentColor" style={{ color: "var(--navy-dark)" }} />
              </div>

              <div
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px] w-24"
                style={{ background: "var(--gold)" }}
              />
            </button>
          )}
        </div>
      </div>
    </EditorialSection>
  );
}
