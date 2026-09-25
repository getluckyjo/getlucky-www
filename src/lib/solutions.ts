import {
  Briefcase,
  HeartHandshake,
  GraduationCap,
  MonitorPlay,
  Plane,
  Flag,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export type Solution = {
  href: string;
  label: string;
  /** One line, drawn from the page's own promise. */
  blurb: string;
  icon: LucideIcon;
};

/**
 * Everything Get Lucky runs for organisations, in one list. The nav's
 * Solutions menu, the homepage's product grid and the footer all read from
 * here, so a new service shows up everywhere at once.
 */
export const SOLUTIONS: readonly Solution[] = [
  {
    href: ROUTES.corporate,
    label: "Corporate golf days",
    blurb: "A R1M hole-in-one on your event's par 3. We run it all.",
    icon: Briefcase,
  },
  {
    href: ROUTES.charity,
    label: "Charity golf days",
    blurb: "Sell swings on the day and keep 50% of every one.",
    icon: HeartHandshake,
  },
  {
    href: ROUTES.schools,
    label: "School fundraising",
    blurb: "Parents and old boys play. Your school keeps 50%.",
    icon: GraduationCap,
  },
  {
    href: ROUTES.simulator,
    label: "Golf simulators",
    blurb: "A R100,000 challenge on your sim. Keep 10% of every swing.",
    icon: MonitorPlay,
  },
  {
    href: ROUTES.tours,
    label: "Golf tours",
    blurb: "A R100,000 prize on every tour. Earn 20% commission.",
    icon: Plane,
  },
  {
    href: ROUTES.partner,
    label: "Partner courses",
    blurb: "The always-on challenge on your par 3, at zero cost.",
    icon: Flag,
  },
  {
    href: ROUTES.agency,
    label: "Golf agency",
    blurb: "Reach 153K+ registered golfers through one agency.",
    icon: Megaphone,
  },
] as const;

/** The player's side of the site: anchors on the homepage. */
export const PLAY_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/#courses", label: "Courses" },
  { href: "/#membership", label: "Membership" },
] as const;

/** Indwe's quote microsite: a quote unlocks 12 months of membership. */
export const INDWE_QUOTE_URL = "https://indwemicrosite.vercel.app";

export const MEMBERSHIP_JOIN_URL = "https://membership.getluckygolfclub.com/join";
