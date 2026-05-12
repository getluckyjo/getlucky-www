export default function SocialProof() {
  return (
    <section className="py-16 sm:py-20 bg-green-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center mb-16">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gold">20+</p>
            <p className="text-cream/50 text-sm mt-1">Premium Courses</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gold">6</p>
            <p className="text-cream/50 text-sm mt-1">Provinces</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gold">R1M</p>
            <p className="text-cream/50 text-sm mt-1">Top Prize</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gold">R50</p>
            <p className="text-cream/50 text-sm mt-1">Entry From</p>
          </div>
        </div>

        {/* Insurance partners */}
        <div className="bg-cream/5 border border-cream/10 rounded-2xl p-8 sm:p-10">
          <p className="text-cream/30 text-xs uppercase tracking-widest text-center mb-8">
            100% Secured &amp; Backed — All Prizes Fully Insured &amp; Underwritten
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-[#D4A017] tracking-wide">
                Santam
              </p>
              <p className="text-cream/40 text-xs mt-2">Prize Underwriting</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-cream/60 tracking-wide">
                INDWE
              </p>
              <p className="text-cream/40 text-xs mt-2">
                Insurance Structuring Partner
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-cream/30 text-xs">
            <span>No financial liability</span>
            <span className="hidden sm:inline">|</span>
            <span>No balance sheet exposure</span>
            <span className="hidden sm:inline">|</span>
            <span>No payout risk</span>
          </div>
        </div>
      </div>
    </section>
  );
}
