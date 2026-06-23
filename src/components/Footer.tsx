import Image from "next/image";
import Link from "next/link";
import { SITE, ROUTES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-green-dark" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/logos/logo-color.png"
              alt="Get Lucky Golf Club"
              width={140}
              height={50}
              className="h-10 w-auto mb-4"
            />
            <p className="text-cream/70 text-sm leading-relaxed max-w-xs">
              {SITE.description}
            </p>
          </div>

          {/* Challenge */}
          <div>
            <h4 className="text-cream font-semibold text-sm mb-4 uppercase tracking-wider">
              The Challenge
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/#prizes", label: "Prizes" },
                { href: "/#membership", label: "Membership — R149/mo" },
                { href: "/#courses", label: "Find a Course" },
                { href: ROUTES.buyVoucher, label: "Buy a Swing" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="text-cream font-semibold text-sm mb-4 uppercase tracking-wider">
              For Partners
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: ROUTES.corporate, label: "Corporate Golf Days", external: false },
                { href: ROUTES.charity, label: "Charity Golf Days", external: false },
                { href: ROUTES.partner, label: "Become a Partner Course", external: false },
                { href: SITE.simulator, label: "Golf Simulator", external: true },
                { href: "https://golfdaypro.co.za", label: "Golf Day Pro", external: true },
                { href: "https://golfsitepro.co.za", label: "Golf Site Pro", external: true },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-cream/70 hover:text-cream text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-semibold text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/70">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-cream transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors"
                >
                  @getluckygolfclub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/50 text-xs">
            &copy; {new Date().getFullYear()} Get Lucky Golf Club (Pty) Ltd. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={ROUTES.terms}
              className="text-cream/50 hover:text-cream text-xs transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href={ROUTES.privacy}
              className="text-cream/50 hover:text-cream text-xs transition-colors"
            >
              Privacy
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/50 hover:text-cream text-xs transition-colors"
            >
              Instagram
            </a>
            <a
              href={SITE.simulator}
              className="text-cream/50 hover:text-cream text-xs transition-colors"
            >
              Golf Simulator
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
