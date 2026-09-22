"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";

/**
 * The challenge itself, in the display voice — these are the drawer's big
 * Poster Gothic entries, as in the app's menu.
 */
const primary = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#membership", label: "Membership" },
  { href: ROUTES.buyVoucher, label: "Buy a Swing" },
];

/** Everything we do for partners: the quieter Inter list. */
const secondary = [
  { href: ROUTES.corporate, label: "Corporate Days" },
  { href: ROUTES.charity, label: "Charity Days" },
  { href: ROUTES.schools, label: "Schools" },
  { href: ROUTES.simulator, label: "Simulators" },
  { href: ROUTES.tours, label: "Golf Tours" },
  { href: ROUTES.partner, label: "Partner Courses" },
  { href: ROUTES.agency, label: "Agency" },
];

const desktopLinks = [...primary.slice(0, 3), ...secondary];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onDarkHero = pathname?.startsWith("/agency") ?? false;

  // The drawer is a full-height overlay; keep the page from scrolling under it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const navBg = onDarkHero
    ? "bg-green-dark/70 backdrop-blur-md border-b border-white/10"
    : "bg-surface/85 backdrop-blur-md border-b border-green/10";
  const linkColor = onDarkHero
    ? "text-white/85 hover:text-lime"
    : "text-green/80 hover:text-green";
  const menuIconColor = onDarkHero ? "text-white" : "text-green";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${navBg}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href="/" className="flex items-center" aria-label="Get Lucky Golf Club home">
            {/* The corner sticker carries its own white halo, so it reads on
                the light bar and the agency page's dark one alike. */}
            <Image
              src="/brand/logo-corner.svg"
              alt="Get Lucky"
              width={173}
              height={133}
              unoptimized
              priority
              className="h-11 sm:h-13 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-6">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold whitespace-nowrap ${linkColor} transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ROUTES.buyVoucher}
              className={`btn-lime btn-lime--sm ${onDarkHero ? "btn-lime--dark" : ""}`}
            >
              Buy a Swing
            </Link>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setOpen(true)}
              className={`p-2.5 -mr-2.5 ${menuIconColor} min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg`}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
            >
              <Menu size={24} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer: the app's menu — brand green, Poster Gothic entries,
          lime on the current page. */}
      {open && (
        <div className="xl:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <button
            type="button"
            className="nav-backdrop absolute inset-0 bg-green-dark/60"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="site-menu"
            className="nav-drawer absolute top-0 bottom-0 left-0 w-[min(84%,340px)] bg-green text-white flex flex-col px-6 pt-5 pb-8 overflow-y-auto shadow-[12px_0_40px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center justify-between mb-7">
              <Image
                src="/brand/logo-corner.svg"
                alt="Get Lucky"
                width={173}
                height={133}
                unoptimized
                className="h-14 w-auto"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2.5 -mr-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-white rounded-lg"
                aria-label="Close menu"
              >
                <X size={26} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {primary.map((link) => {
                const current = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-heading text-[clamp(26px,4.2vh,32px)] leading-[1.2] py-1 transition-colors hover:text-lime ${
                      current ? "text-lime" : "text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-0.5 mt-7 pt-5 border-t border-white/20">
              {secondary.map((link) => {
                const current = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`text-base font-medium py-2 transition-colors hover:text-lime ${
                      current ? "text-lime" : "text-white/85"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8">
              <Link
                href={ROUTES.buyVoucher}
                onClick={() => setOpen(false)}
                className="btn-lime btn-lime--dark w-full"
              >
                Buy a Swing
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
