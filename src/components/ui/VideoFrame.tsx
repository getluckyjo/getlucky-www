/**
 * The golf-day film in a quiet frame: rounded, no border, a deep shadow.
 * Loads only its metadata until someone presses play.
 */
export default function VideoFrame({
  src = "/images/golf-day-video.mp4",
  poster = "/images/golf-day/video-poster.png",
  label = "Get Lucky Hole-in-One Challenge at a golf day",
}: {
  src?: string;
  poster?: string;
  label?: string;
}) {
  return (
    <div className="reveal overflow-hidden rounded-3xl bg-night shadow-[0_40px_80px_-40px_rgba(12,22,14,0.6)] ring-1 ring-black/5">
      <video
        className="w-full aspect-video object-cover"
        controls
        preload="metadata"
        playsInline
        poster={poster}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
