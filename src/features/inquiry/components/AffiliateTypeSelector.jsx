import { Tv2, Users, ChevronRight, ArrowLeft } from "lucide-react";

const AFFILIATE_OPTIONS = [
  {
    key: "MCN",
    icon: Tv2,
    title: "Join Superstar Agency",
    description: "Jalur bagi kreator/affiliate yang ingin bergabung sebagai talent di bawah naungan MCN Superstar Agency.",
    tag: "MCN Agency",
  },
  {
    key: "PAS",
    icon: Users,
    title: "Join Komunitas Pasukan Affiliate Superstar",
    description: "Bergabung ke komunitas affiliate Superstar untuk mendapatkan komisi lebih tinggi dan sample lebih banyak.",
    tag: "Komunitas",
  },
];

export default function AffiliateTypeSelector({ onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-6 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <p className="font-sans text-sm text-graphite mb-4">Pilih jalur affiliate kamu:</p>
      <div className="space-y-4">
        {AFFILIATE_OPTIONS.map(({ key, icon: Icon, title, description, tag }) => (
          <button key={key} onClick={() => onSelect(key)} className="w-full text-left group">
            <div className="card-superstar bg-white border border-graphite/15 p-5 hover:border-superstar-blue hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded bg-cloud flex items-center justify-center shrink-0 group-hover:bg-superstar-blue transition-colors duration-300">
                  <Icon size={22} className="text-superstar-blue group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block bg-superstar-blue/10 text-superstar-blue font-sans text-xs font-semibold px-2 py-0.5 rounded mb-2">
                        {tag}
                      </span>
                      <h3 className="font-sans font-semibold text-ink text-base leading-snug">{title}</h3>
                    </div>
                    <ChevronRight size={18} className="text-graphite shrink-0 mt-1 group-hover:text-superstar-blue group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <p className="font-sans text-sm text-graphite mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
