"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const links = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#membership", label: "Membership" },
  { href: ROUTES.corporate, label: "Corporate Days" },
  { href: ROUTES.charity, label: "Charity Days" },
  { href: ROUTES.simulator, label: "Simulators" },
  { href: ROUTES.partner, label: "Partner Courses" },
  { href: ROUTES.agency, label: "Agency" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onDarkHero = pathname?.startsWith("/agency") ?? false;

  const navBg = onDarkHero
    ? "bg-charcoal/30 backdrop-blur-md border-b border-white/5"
    : "bg-cream/80 backdrop-blur-md border-b border-green-dark/10";
  const linkColor = onDarkHero
    ? "text-white/80 hover:text-white"
    : "text-green-dark/70 hover:text-green-dark";
  const menuIconColor = onDarkHero
    ? "text-white/80"
    : "text-green-dark/70";
  const mobileMenuBg = onDarkHero
    ? "bg-charcoal border-t border-white/10 shadow-lg"
    : "bg-cream border-t border-green-dark/10 shadow-lg";
  const mobileLinkColor = onDarkHero
    ? "text-white/80 hover:text-white hover:bg-white/5"
    : "text-green-dark/70 hover:text-green-dark hover:bg-green-dark/5";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${navBg}`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={onDarkHero ? "/logos/logo-dark-bg.png" : "/logos/logo-color.png"}
              alt="Get Lucky Golf Club home"
              width={140}
              height={50}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${linkColor} transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile: hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setOpen(!open)}
              className={`p-2.5 ${menuIconColor} min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {open && (
        <div className={`lg:hidden ${mobileMenuBg}`}>
          <div className="px-4 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${mobileLinkColor} py-3 px-3 rounded-lg text-base font-medium transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
