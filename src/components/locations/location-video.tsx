"use client";

import { useState } from "react";
import { Play } from "lucide-react";

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
  countySlug,
  townSlug,
  youtubeId,
}: LocationVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!youtubeId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div
            className="mb-5 h-[2px] w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--gold), var(--gold-light))",
            }}
          />
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
            style={{ color: "var(--gold-dark)" }}
          >
            Market Update
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {townName} Property Market Video
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Watch our data-driven market update for {townName}, {countyName} -
            covering prices, transactions, and development opportunities.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg aspect-video">
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
                className="group absolute inset-0 flex items-center justify-center bg-navy-dark"
                aria-label={`Play ${townName} market update video`}
              >
                {/* YouTube thumbnail */}
                <img
                  src={thumbnailUrl}
                  alt={`${townName} property market update thumbnail`}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-90"
                  loading="lazy"
                />

                {/* Play button overlay */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gold shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-gold-dark">
                  <Play className="ml-1 h-8 w-8 text-navy-dark" fill="currentColor" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
