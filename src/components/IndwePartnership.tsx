import { Shield, Users, Calendar, Quote } from "lucide-react";

const stats = [
  { icon: Calendar, value: "100+", label: "Years in Insurance" },
  { icon: Users, value: "65,000+", label: "Clients Nationwide" },
  { icon: Shield, value: "R2B+", label: "Underwritten Annually" },
];

export default function IndwePartnership() {
  return (
    <section className="py-16 sm:py-20 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partnership header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px flex-1 max-w-16 bg-green-dark/15" />
          <p className="text-green-dark/40 text-xs font-semibold uppercase tracking-[0.2em]">
            Headline Sponsor
          </p>
          <div className="h-px flex-1 max-w-16 bg-green-dark/15" />
        </div>

        <h3 className="text-center font-heading text-xl sm:text-2xl text-green-dark uppercase tracking-wide mb-8">
          Get Lucky Golf{" "}
          <span className="text-green-dark/30">×</span>{" "}
          Indwe Risk Services
        </h3>

        {/* Quote */}
        <div className="relative max-w-3xl mx-auto mb-10">
          <Quote className="w-8 h-8 text-gold/30 absolute -top-2 -left-2 sm:-left-6" />
          <blockquote className="text-green-dark/70 text-sm sm:text-base leading-relaxed text-center italic pl-4 sm:pl-0">
            We&apos;re proud to welcome Indwe Risk Services as our headline
            sponsor. Indwe&apos;s focus on confidence, expertise, and protecting
            life&apos;s defining moments aligns seamlessly with our mission to
            make golf more exciting, rewarding, and accessible for amateur
            players across South Africa.
          </blockquote>
          <p className="text-center mt-4">
            <span className="text-green-dark font-semibold text-sm">
              Andrew Davenport
            </span>
            <span className="text-green-dark/40 text-sm">
              {" "}— Founder, Get Lucky Golf
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6 sm:gap-12">
              <div className="text-center">
                <stat.icon className="w-5 h-5 text-[#0072B8] mx-auto mb-1.5" />
                <p className="text-lg sm:text-2xl font-black text-green-dark">
                  {stat.value}
                </p>
                <p className="text-green-dark/40 text-[11px] sm:text-xs mt-0.5">
                  {stat.label}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="h-10 w-px bg-green-dark/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
