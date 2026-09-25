import type { ReactNode } from "react";

/**
 * The one way a section opens: a kicker with its lime status dot, a Poster
 * Gothic title, and an optional lede. Left-aligned by default (it reads
 * faster and leaves room for an action on the right); `center` for the
 * few sections that stand alone.
 */
export default function SectionHeader({
  kicker,
  title,
  lede,
  align = "left",
  dark = false,
  as: Heading = "h2",
  action,
  className = "",
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  as?: "h1" | "h2" | "h3";
  /** A link or button that sits beside the title on wide screens. */
  action?: ReactNode;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`reveal flex flex-col gap-6 ${
        action ? "lg:flex-row lg:items-end lg:justify-between" : ""
      } ${centered ? "items-center text-center" : ""} ${className}`}
    >
      <div className={centered ? "max-w-3xl mx-auto" : "max-w-3xl"}>
        {kicker && (
          <span className={`kicker ${dark ? "kicker--dark" : ""}`}>{kicker}</span>
        )}
        <Heading
          className={`display-lg mt-4 ${dark ? "text-white" : "text-ink"}`}
        >
          {title}
        </Heading>
        {lede && (
          <p
            className={`lede mt-5 ${centered ? "mx-auto" : ""} max-w-2xl ${
              dark ? "lede--dark" : ""
            }`}
          >
            {lede}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
