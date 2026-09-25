"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/** 94.2 → "1:34" */
function clock(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The golf-day film in a quiet frame. Until someone presses play it shows
 * the poster with one lime play button and the running time, instead of
 * the browser's control bar; after that the native controls take over.
 * Loads only its metadata until played.
 */
export default function VideoFrame({
  src = "/images/golf-day-video.mp4",
  poster = "/images/golf-day/video-poster.png",
  label = "A day with Get Lucky",
}: {
  src?: string;
  poster?: string;
  label?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const start = () => {
    setStarted(true);
    void video.current?.play();
  };

  return (
    <div className="reveal relative overflow-hidden rounded-3xl bg-night shadow-[0_40px_80px_-40px_rgba(12,22,14,0.6)] ring-1 ring-black/5">
      <video
        ref={video}
        className="w-full aspect-video object-cover"
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
          className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-night/70 via-night/10 to-transparent"
        >
          <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-lime text-green-dark shadow-[0_20px_50px_-15px_rgba(214,251,75,0.7)] transition-transform duration-300 ease-out group-hover:scale-110">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
          </span>
          <span className="chip chip--dark absolute left-4 bottom-4 sm:left-6 sm:bottom-6">
            <span className="live-dot" aria-hidden />
            {label}
            {duration !== null && <span className="text-white/60 tabular-nums">· {clock(duration)}</span>}
          </span>
        </button>
      )}
    </div>
  );
}
