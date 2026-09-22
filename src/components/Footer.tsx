import Image from "next/image";
import Link from "next/link";
import { SITE, ROUTES } from "@/lib/constants";

const challengeLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#membership", label: "Membership — R149/mo" },
  { href: "/#courses", label: "Find a Course" },
];

const partnerLinks = [
  { href: ROUTES.corporate, label: "Corporate Golf Days", external: false },
  { href: ROUTES.charity, label: "Charity Golf Days", external: false },
  { href: ROUTES.schools, label: "School Fundraising Days", external: false },
  { href: ROUTES.simulator, label: "Simulator Partners", external: false },
  { href: ROUTES.tours, label: "Golf Tour Operators", external: false },
  { href: ROUTES.partner, label: "Become a Partner Course", external: false },
  { href: SITE.simulator, label: "Golf Simulator", external: true },
];

const linkClass = "text-white/75 hover:text-lime text-sm transition-colors";

/**
 * Footer in the app's menu-drawer voice: brand green, the corner sticker,
 * Poster Gothic column headings, lime on hover.
 */
export default function Footer() {
  return (
    <footer className="bg-green text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/brand/logo-corner.svg"
              alt="Get Lucky Golf Club"
              width={173}
              height={133}
              unoptimized
              className="h-16 w-auto mb-5"
            />
            <p className="text-white/75 text-sm leading-relaxed max-w-xs">
              {SITE.description}
            </p>
          </div>

          {/* Challenge */}
          <div>
            <h4 className="font-heading text-xl text-white mb-4">The Challenge</h4>
            <ul className="space-y-2.5">
              {challengeLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-heading text-xl text-white mb-4">For Partners</h4>
            <ul className="space-y-2.5">
              {partnerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl text-white mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${SITE.email}`} className={linkClass}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  @getluckygolfclub
                </a>
              </li>
            </ul>
            <p className="mt-6 text-xs text-white/60 leading-relaxed max-w-xs">
              All prizes underwritten by Indwe Risk Services, an Authorised
              Financial Services Provider (FSP 3425).
            </p>
          </div>
        </div>

        <div className="border-t border-white/15 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs">
            &copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd. All rights
            reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { href: ROUTES.terms, label: "Terms & Conditions" },
              { href: ROUTES.privacy, label: "Privacy" },
              { href: SITE.instagram, label: "Instagram", external: true },
              { href: SITE.simulator, label: "Golf Simulator" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-white/60 hover:text-lime text-xs transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
