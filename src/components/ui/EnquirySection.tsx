import type { ReactNode } from "react";
import { MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/constants";

/**
 * The close of every service page: the pitch and the ways to reach us on
 * the left, the form in a white card on the right. Light, so the form is
 * the brightest thing on the screen.
 */
export default function EnquirySection({
  id = "enquire",
  kicker,
  title,
  lede,
  response = "An activation specialist replies within 24 hours.",
  trust = true,
  children,
}: {
  id?: string;
  kicker: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  response?: string;
  /** The Indwe underwriting line; off where no prize is involved. */
  trust?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="section bg-paper">
      <div className="wrap grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-16 items-start">
        <div className="reveal lg:sticky lg:top-28">
          <span className="kicker">{kicker}</span>
          <h2 className="display-lg text-ink mt-4">{title}</h2>
          <p className="lede mt-5">{lede}</p>

          <ul className="mt-9 rule-list text-[15px]">
            <li className="flex items-center gap-3 py-4">
              <Clock className="w-4 h-4 text-green shrink-0" />
              <span className="text-ink">{response}</span>
            </li>
            <li className="flex items-center gap-3 py-4">
              <MessageCircle className="w-4 h-4 text-green shrink-0" />
              <span className="text-ink">
                Prefer to chat?{" "}
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-green underline decoration-green/30 underline-offset-4 hover:decoration-green"
                >
                  WhatsApp +27 60 961 5091
                </a>
              </span>
            </li>
            {trust && (
              <li className="flex items-center gap-3 py-4">
                <ShieldCheck className="w-4 h-4 text-green shrink-0" />
                <span className="text-ink">
                  Prizes underwritten by Indwe Risk Services · FSP 3425
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="reveal card p-6 sm:p-10">{children}</div>
      </div>
    </section>
  );
}
