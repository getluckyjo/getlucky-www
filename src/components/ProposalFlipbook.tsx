"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, Maximize2, X } from "lucide-react";

const TOTAL_PAGES = 17;
const PDF_HREF = "/GLG_Golf_Course_Proposal_2026.pdf";

const pageSrc = (n: number) =>
  `/proposal-pages/page-${String(n).padStart(2, "0")}.jpg`;

export default function ProposalFlipbook() {
  const [page, setPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(
    () => setPage((p) => Math.max(1, p - 1)),
    [],
  );
  const goNext = useCallback(
    () => setPage((p) => Math.min(TOTAL_PAGES, p + 1)),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, fullscreen]);

  useEffect(() => {
    if (fullscreen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [fullscreen]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const Viewer = ({ inFullscreen }: { inFullscreen: boolean }) => (
    <div
      className={
        inFullscreen
          ? "relative w-full h-full flex items-center justify-center"
          : "relative w-full"
      }
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={
          inFullscreen
            ? "relative w-full max-w-6xl aspect-[4/3]"
            : "relative w-full aspect-[4/3] bg-cream-dark rounded-2xl overflow-hidden shadow-lg"
        }
      >
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
          <Image
            key={n}
            src={pageSrc(n)}
            alt={`Get Lucky Golf Course Proposal — page ${n}`}
            fill
            priority={n === 1}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
            className={`object-contain transition-opacity duration-300 ${
              n === page ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        ))}

        <button
          type="button"
          onClick={goPrev}
          disabled={page === 1}
          aria-label="Previous page"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-green-dark rounded-full p-2 sm:p-3 shadow-md transition"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={page === TOTAL_PAGES}
          aria-label="Next page"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-green-dark rounded-full p-2 sm:p-3 shadow-md transition"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {inFullscreen && (
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-green-dark rounded-full p-2 shadow-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <Viewer inFullscreen={false} />

      <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-charcoal-light/70">
          <span className="font-semibold text-green-dark">{page}</span>
          <span>/ {TOTAL_PAGES}</span>
        </div>

        <div className="flex-1 mx-2 hidden sm:block">
          <input
            type="range"
            min={1}
            max={TOTAL_PAGES}
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            aria-label="Jump to page"
            className="w-full accent-green-dark cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-green-dark hover:text-green border border-green-dark/20 hover:border-green-dark/40 rounded-full px-3 py-1.5 transition"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <a
            href={PDF_HREF}
            download
            className="inline-flex items-center gap-1.5 text-sm bg-green-dark hover:bg-green text-cream rounded-full px-3 py-1.5 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Proposal fullscreen view"
        >
          <Viewer inFullscreen={true} />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/70 text-sm">
            {page} / {TOTAL_PAGES}
          </div>
        </div>
      )}
    </div>
  );
}
