"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A sponsor logo that degrades to a wordmark.
 *
 * Co-branded pages get built before every partner has sent artwork. Rather
 * than shipping a broken image or blocking the page on a file, this renders
 * the logo from public/logos/sponsors/<file> when it exists and the name in
 * type when it does not. Dropping the file in is the whole deployment.
 */
export default function SponsorLogo({
  name,
  file,
  className = "",
  wordmarkClassName = "",
  height = 48,
}: {
  name: string;
  file: string;
  className?: string;
  wordmarkClassName?: string;
  height?: number;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span
        className={`font-heading uppercase tracking-wide leading-none ${wordmarkClassName}`}
        aria-label={name}
      >
        {name}
      </span>
    );
  }

  return (
    <Image
      src={`/logos/sponsors/${file}`}
      alt={name}
      width={height * 3}
      height={height}
      unoptimized
      onError={() => setMissing(true)}
      className={`w-auto object-contain ${className}`}
      style={{ height, maxWidth: height * 4 }}
    />
  );
}
