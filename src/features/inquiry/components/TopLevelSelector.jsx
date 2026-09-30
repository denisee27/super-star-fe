import { Tv2, CalendarDays, Store, ChevronRight } from "lucide-react";

const BASE_ITEMS = [
  {
    key: "AFFILIATE",
    icon: Tv2,
    title: "Affiliate",
    description: "Bergabung sebagai kreator/affiliate di MCN Superstar Agency atau komunitas Pasukan Affiliate.",
    tag: "Kreator & Affiliator",
  },
  {
    key: "BRAND_SELLER",
    icon: Store,
    title: "Brand/Seller",
    description: "Untuk brand atau seller yang ingin menjalin kerja sama dan partnership produk.",
    tag: "Brand & Seller",
  },
];

const EVENT_ITEM = {
  key: "EVENT",
  icon: CalendarDays,
  title: "Event",
  description: "Daftar untuk mengikuti event yang sedang berlangsung.",
  tag: "Event Aktif",
};

export default function TopLevelSelector({ onSelect, activeEvents = [] }) {
  const items = activeEvents.length > 0
    ? [BASE_ITEMS[0], EVENT_ITEM, BASE_ITEMS[1]]
    : BASE_ITEMS;

  return (
    <div className="space-y-4">
      {items.map(({ key, icon: Icon, title, description, tag }) => (
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
  );
}
