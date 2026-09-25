"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, MessageCircle, ShieldCheck, X } from "lucide-react";
import { ROUTES, SITE } from "@/lib/constants";
import { INDWE_QUOTE_URL, PLAY_LINKS, SOLUTIONS } from "@/lib/solutions";

/**
 * Pages that open on a dark photo hero. Over those the bar starts as dark
 * glass and turns light once the page scrolls; everywhere else it is light
 * from the start.
 */
const DARK_HERO = new Set<string>([
  "/",
  ROUTES.corporate,
  ROUTES.charity,
  ROUTES.schools,
  ROUTES.simulator,
  ROUTES.tours,
  ROUTES.agency,
  ROUTES.partner,
]);

/**
 * A floating glass bar: the logo, the four player anchors, a Solutions menu
 * holding every service for organisations, and one primary action. On
 * phones it opens a full-screen sheet with the same three groups.
 */
export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const solutionsButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // When hover has just opened the menu, the click that follows must not
  // toggle it shut again.
  const openedAt = useRef(0);

  const dark = DARK_HERO.has(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The sheet is a full-screen overlay; keep the page from scrolling under it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // The phone sheet is modal: focus moves into it on open, Tab cycles
  // inside it, and focus returns to the menu button when it closes.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      sheet.current?.querySelector<HTMLElement>("button, a")?.focus();
      const trap = (e: KeyboardEvent) => {
        if (e.key !== "Tab" || !sheet.current) return;
        const items = Array.from(
          sheet.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", trap);
      return () => document.removeEventListener("keydown", trap);
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      menuButton.current?.focus();
    }
  }, [open]);

  // Escape closes whichever menu is open (and hands focus back to the
  // Solutions button if focus was inside it); a click outside closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSolutionsOpen((wasSolutionsOpen) => {
          if (wasSolutionsOpen && menuRef.current?.contains(document.activeElement)) {
            solutionsButton.current?.focus();
          }
          return false;
        });
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const openSolutions = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openedAt.current = Date.now();
    setSolutionsOpen(true);
  };
  const toggleSolutions = () => {
    if (Date.now() - openedAt.current < 500) {
      setSolutionsOpen(true);
      return;
    }
    setSolutionsOpen((v) => !v);
  };
  const closeSolutionsSoon = () => {
    closeTimer.current = setTimeout(() => setSolutionsOpen(false), 140);
  };

  const bar = dark
    ? "bg-night/35 border-white/12 text-white"
    : "bg-white/80 border-black/[0.06] text-ink shadow-[0_10px_30px_-14px_rgba(15,27,18,0.28)]";
  const link = dark
    ? "text-white/80 hover:text-white hover:bg-white/10"
    : "text-ink/70 hover:text-ink hover:bg-black/[0.04]";
  const solutionsActive = SOLUTIONS.some((s) => s.href === pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 pt-3">
      <nav
        aria-label="Main navigation"
        className={`mx-auto max-w-[1200px] h-[60px] rounded-full border backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${bar} ${
          dark ? "on-dark" : ""
        }`}
      >
        <div className="h-full flex items-center justify-between pl-3 pr-2 sm:pl-4">
          <Link href="/" className="flex items-center shrink-0" aria-label="Get Lucky Golf Club home">
            {/* The corner sticker carries its own white halo, so it reads on
                the dark glass and the light one alike. */}
            <Image
              src="/brand/logo-corner.svg"
              alt="Get Lucky"
              width={173}
              height={133}
              unoptimized
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {PLAY_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-full text-[14px] font-medium transition-colors ${link}`}
              >
                {l.label}
              </Link>
            ))}

            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={openSolutions}
              onMouseLeave={closeSolutionsSoon}
              onBlur={(e) => {
                // Tabbing out of the menu closes it.
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setSolutionsOpen(false);
                }
              }}
            >
              <button
                ref={solutionsButton}
                type="button"
                onClick={toggleSolutions}
                aria-expanded={solutionsOpen}
                aria-controls="solutions-menu"
                className={`px-3.5 py-2 rounded-full text-[14px] font-medium inline-flex items-center gap-1 transition-colors ${link} ${
                  solutionsActive ? (dark ? "text-white" : "text-ink") : ""
                }`}
              >
                Solutions
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {solutionsOpen && (
                <div
                  id="solutions-menu"
                  className="nav-menu absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[680px]"
                >
                  <div className="rounded-3xl bg-white text-ink border border-black/[0.06] shadow-[0_30px_70px_-30px_rgba(15,27,18,0.45)] p-3">
                    <p className="px-3 pt-2 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      For organisations
                    </p>
                    <ul className="grid grid-cols-2 gap-1">
                      {SOLUTIONS.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            onClick={() => setSolutionsOpen(false)}
                            className={`group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-paper ${
                              pathname === s.href ? "bg-paper" : ""
                            }`}
                          >
                            <span className="icon-disc w-10 h-10 rounded-xl transition-colors group-hover:bg-lime group-hover:text-green-dark">
                              <s.icon className="w-[18px] h-[18px]" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-[14px] font-semibold text-ink">
                                {s.label}
                              </span>
                              <span className="block text-[13px] leading-snug text-muted mt-0.5">
                                {s.blurb}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
                      <span className="flex items-center gap-2 text-[13px] text-muted">
                        <ShieldCheck className="w-4 h-4 text-green" />
                        Get an Indwe insurance quote, get 12 months&apos; membership free.
                      </span>
                      <a
                        href={INDWE_QUOTE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-arrow shrink-0 text-[13px]"
                      >
                        Get a quote <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={ROUTES.corporate} className="btn-lime btn-lime--sm hidden sm:inline-flex whitespace-nowrap">
              Book a golf day
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen(true)}
              className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                dark ? "text-white hover:bg-white/10" : "text-ink hover:bg-black/5"
              }`}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </nav>

      {/* Phone sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="nav-backdrop absolute inset-0 bg-night/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            ref={sheet}
            id="site-menu"
            className="nav-sheet absolute inset-x-2 top-2 bottom-2 rounded-[28px] bg-paper text-ink flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between pl-5 pr-3 h-[68px] shrink-0 border-b border-line">
              <Image
                src="/brand/logo-corner.svg"
                alt="Get Lucky"
                width={173}
                height={133}
                unoptimized
                className="h-10 w-auto"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-black/5"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
              <p className="kicker">Play</p>
              <ul className="mt-3">
                {PLAY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-2 font-heading text-[30px] leading-[1.15] text-ink hover:text-green"
                    >
                      {l.label}
                      <ArrowRight className="w-5 h-5 text-ink/30" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="kicker mt-8">Solutions</p>
              <ul className="mt-3 rule-list">
                {SOLUTIONS.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className={`icon-disc w-10 h-10 rounded-xl ${pathname === s.href ? "icon-disc--lime" : ""}`}>
                        <s.icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold">{s.label}</span>
                        <span className="block text-[13px] text-muted leading-snug">{s.blurb}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href={INDWE_QUOTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-3 rounded-2xl bg-white border border-line p-4"
              >
                <span className="icon-disc w-10 h-10 rounded-xl">
                  <ShieldCheck className="w-[18px] h-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold">Get an insurance quote</span>
                  <span className="block text-[13px] text-muted leading-snug">
                    An Indwe quote unlocks 12 months&apos; membership free.
                  </span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-ink/40 shrink-0" />
              </a>
            </div>

            <div className="shrink-0 border-t border-line p-4 grid grid-cols-2 gap-2 bg-white">
              <Link
                href={ROUTES.corporate}
                onClick={() => setOpen(false)}
                className="btn-lime"
              >
                Book a golf day
              </Link>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
