"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/** 94.2 → "1:34" */
function clock(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The golf-day film, shot vertical, filling a rounded card edge to edge.
 * Until someone presses play it shows the poster with one lime play button
 * and the running time; after that the native controls take over. Loads only
 * its metadata until played.
 *
 * The card is 9:16 by default; a page that stands it beside something taller
 * or shorter passes its own sizing in `className` (the film is cover-cropped,
 * so a slightly different shape trims the edges rather than letterboxing).
 */
export default function VideoFrame({
  src = "/images/golf-day-film.mp4",
  poster = "/images/golf-day/film-poster.webp",
  label = "A day with Get Lucky",
  className = "aspect-[9/16]",
}: {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const start = () => {
    setStarted(true);
    void video.current?.play();
  };

  return (
    <div
      className={`reveal relative w-full overflow-hidden rounded-3xl bg-night shadow-[0_40px_80px_-40px_rgba(12,22,14,0.6)] ${className}`}
    >
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        controls={started}
        preload="metadata"
        playsInline
        poster={poster}
        aria-label={label}
        onPlay={() => setStarted(true)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label={`Play the film: ${label}`}
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-night/70 via-night/5 to-night/15"
        >
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-lime text-green-dark shadow-[0_20px_50px_-15px_rgba(214,251,75,0.7)] transition-transform duration-300 ease-out group-hover:scale-110">
            <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8 fill-current" />
          </span>
          <span className="chip chip--dark absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="live-dot" aria-hidden />
            {label}
            {duration !== null && <span className="tabular-nums text-white/60">· {clock(duration)}</span>}
          </span>
        </button>
      )}
    </div>
  );
}
