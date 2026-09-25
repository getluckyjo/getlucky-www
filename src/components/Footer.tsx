import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { SITE, ROUTES } from "@/lib/constants";
import { SOLUTIONS } from "@/lib/solutions";

const challengeLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#membership", label: "Membership — R149/mo" },
  { href: "/#courses", label: "Find a course" },
];

const linkClass = "inline-block py-1.5 text-white/60 hover:text-white text-[14px] transition-colors";

/**
 * The footer on the night panel: the brand and ways to reach us, then the
 * challenge, every solution and the fine print, and the wordmark set huge
 * and faint along the bottom edge.
 */
export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white" id="contact">
      <div className="wrap pt-20 sm:pt-24 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Image
              src="/brand/logo-corner.svg"
              alt="Get Lucky Golf Club"
              width={173}
              height={133}
              unoptimized
              className="h-14 w-auto"
            />
            <p className="mt-6 text-white/60 text-[15px] leading-relaxed max-w-sm">
              {SITE.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <a href={`mailto:${SITE.email}`} className="chip chip--dark min-h-11 hover:bg-white/15">
                <Mail className="w-3.5 h-3.5" />
                Email us
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip--dark min-h-11 hover:bg-white/15"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip--dark min-h-11 hover:bg-white/15"
              >
                @getluckygolfclub
              </a>
            </div>
          </div>

          {/* Challenge */}
          <div className="lg:col-span-2">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
              The challenge
            </h4>
            <ul className="mt-4 space-y-1">
              {challengeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="lg:col-span-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
              Solutions
            </h4>
            <ul className="mt-4 space-y-1">
              {SOLUTIONS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3">
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
              Contact
            </h4>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={`mailto:${SITE.email}`} className={`${linkClass} break-all`}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  +27 60 961 5091
                </a>
              </li>
            </ul>
            <p className="mt-6 text-[13px] text-white/55 leading-relaxed max-w-xs">
              All prizes underwritten by Indwe Risk Services, an Authorised
              Financial Services Provider (FSP 3425).
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/55 text-[13px]">
            &copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { href: ROUTES.terms, label: "Terms & Conditions" },
              { href: ROUTES.privacy, label: "Privacy" },
              { href: SITE.instagram, label: "Instagram", external: true },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-white/55 hover:text-white text-[13px] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* The wordmark, set huge and nearly invisible, as the floor. */}
      <p
        aria-hidden
        className="pointer-events-none select-none font-heading text-center leading-[0.8] text-[18.5vw] text-white/[0.035] -mb-[2.5vw] whitespace-nowrap"
      >
        Get Lucky
      </p>
    </footer>
  );
}
