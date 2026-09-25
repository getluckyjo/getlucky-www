import Image from "next/image";

export type Photo = { src: string; alt: string };

/**
 * A bento of event photos: the first frame leads large, the rest tile
 * around it. Rounded, borderless, no captions — the pictures do the work.
 */
export default function PhotoGallery({ photos }: { photos: readonly Photo[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[220px] gap-3">
      {photos.map((img, i) => (
        <div
          key={img.src}
          className={`reveal relative overflow-hidden rounded-2xl bg-surface ${
            i === 0 ? "col-span-2 row-span-2" : ""
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  );
}
