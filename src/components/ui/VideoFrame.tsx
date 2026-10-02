"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/** 94.2 → "1:34" */
function clock(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The golf-day film, shot vertical, played inside a phone on a dark green
 * stage — the way most people will watch it. Until someone presses play the
 * screen shows the poster with one lime play button and the running time;
 * after that the native controls take over. Loads only its metadata until
 * played, and fills its parent's height, so a page can stand it beside a
 * gallery or a list.
 */
export default function VideoFrame({
  src = "/images/golf-day-film.mp4",
  poster = "/images/golf-day/film-poster.webp",
  label = "A day with Get Lucky",
  className = "",
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
      className={`reveal relative isolate flex h-full items-center justify-center overflow-hidden rounded-3xl bg-green-dark px-6 py-10 sm:py-12 ${className}`}
    >
      <div aria-hidden className="dot-grid absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/25 blur-[90px]"
      />

      {/* The phone: bezel, side buttons, the island, and the screen. */}
      <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
        <span aria-hidden className="absolute -left-[3px] top-[18%] h-10 w-[3px] rounded-l-sm bg-black/80" />
        <span aria-hidden className="absolute -left-[3px] top-[28%] h-14 w-[3px] rounded-l-sm bg-black/80" />
        <span aria-hidden className="absolute -right-[3px] top-[24%] h-20 w-[3px] rounded-r-sm bg-black/80" />

        <div className="rounded-[44px] bg-[#0b0f0c] p-[9px] shadow-[0_50px_90px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/15">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[36px] bg-black">
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

            {/* The island sits over the picture until the film starts, then
                gets out of the way of the native controls. */}
            {!started && (
              <span
                aria-hidden
                className="absolute left-1/2 top-3 z-10 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-black"
              />
            )}

            {!started && (
              <button
                type="button"
                onClick={start}
                aria-label={`Play the film: ${label}`}
                className="group absolute inset-0 flex items-center justify-center bg-gradient-to-t from-night/70 via-night/5 to-night/20"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-green-dark shadow-[0_20px_50px_-15px_rgba(214,251,75,0.7)] transition-transform duration-300 ease-out group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
                <span className="chip chip--dark absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="live-dot" aria-hidden />
                  {label}
                  {duration !== null && <span className="tabular-nums text-white/60">· {clock(duration)}</span>}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
