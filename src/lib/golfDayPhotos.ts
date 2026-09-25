import type { Photo } from "@/components/ui/PhotoGallery";

/** Frames from real Get Lucky golf-day activations (public/images/golf-day). */
export const GOLF_DAY_PHOTOS: readonly Photo[] = [
  { src: "/images/golf-day/IMG_4634.jpg", alt: "Golfer mid-swing with Cape Town Stadium and Get Lucky gazebo" },
  { src: "/images/golf-day/IMG_4505.jpg", alt: "Three golfers with beers at the Get Lucky activation" },
  { src: "/images/golf-day/IMG_4432.jpg", alt: "Golfers with Get Lucky branded promoters" },
  { src: "/images/golf-day/IMG_4419.jpg", alt: "Golfer scanning the Get Lucky Hole-in-One Challenge signage" },
  { src: "/images/golf-day/IMG_4654.jpg", alt: "Golfer celebrating a shot at the activation" },
  { src: "/images/golf-day/IMG_4521.jpg", alt: "Golfer using a rangefinder at the par-3 challenge" },
  { src: "/images/golf-day/IMG_4572.jpg", alt: "Golfer on the green with the flag" },
  { src: "/images/golf-day/IMG_4527.jpg", alt: "Golfer mid-swing in front of the Swing It To Win It backdrop" },
  { src: "/images/golf-day/IMG_4274.jpg", alt: "Golfers arriving at the course" },
  { src: "/images/golf-day/IMG_4460.jpg", alt: "Golfer mid-swing at the Get Lucky Hole-in-One Challenge activation" },
  { src: "/images/golf-day/IMG_4687.jpg", alt: "Golfer in a Get Lucky cap marking a scorecard" },
];

/**
 * Nine frames for one page's gallery, led by `lead` and leaving out the
 * page's own hero photo, so no two service pages open on the same picture.
 */
export function galleryFor(lead: string, hero?: string): Photo[] {
  const file = (name: string) => `/images/golf-day/${name}`;
  const first = GOLF_DAY_PHOTOS.find((p) => p.src === file(lead));
  const rest = GOLF_DAY_PHOTOS.filter(
    (p) => p.src !== file(lead) && (!hero || p.src !== file(hero)),
  );
  return [...(first ? [first] : []), ...rest].slice(0, 9);
}
