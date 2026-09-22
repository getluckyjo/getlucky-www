import Image from "next/image";

/**
 * A course photograph under a deep-green scrim, for a dark section that
 * needs to read apart from a flat dark neighbour. Drop it into a section
 * that is `relative overflow-hidden`; the section's own content goes in a
 * `relative z-10` wrapper above it.
 */
export default function SectionTexture({
  src,
  position = "center",
}: {
  src: string;
  /** CSS object-position for the photo, e.g. "center 30%". */
  position?: string;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-green-dark/[0.84]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-green-dark/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-green-dark/60 to-transparent" />
    </div>
  );
}
