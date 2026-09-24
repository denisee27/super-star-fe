import { Tv2, Users, Store, ChevronRight } from "lucide-react";
import { INQUIRY_CATEGORY } from "../types/inquiry.types.js";

const CATEGORIES = [
  {
    key: INQUIRY_CATEGORY.MCN_AGENCY,
    icon: Tv2,
    title: "Join MCN Superstar Agency",
    description:
      "Jalur bagi kreator/affiliate yang ingin bergabung sebagai talent di bawah naungan MCN Superstar Agency. Menaungi kreator di TikTok Shop by Tokopedia & Shopee.",
    tag: "Kreator & Affiliator",
  },
  {
    key: INQUIRY_CATEGORY.PASUKAN_AFFILIATE,
    icon: Users,
    title: "Join Komunitas Pasukan Affiliate Superstar",
    description:
      "Jalur bagi individu yang ingin bergabung ke dalam komunitas affiliate dari Superstar Agency. Belajar, sharing strategi, dan menerima informasi campaign.",
    tag: "Komunitas",
  },
  {
    key: INQUIRY_CATEGORY.BRAND_SELLER,
    icon: Store,
    title: "Join Brand/Seller",
    description:
      "Jalur khusus untuk brand atau seller yang ingin menjalin kerja sama — mulai dari program seller hingga partnership produk.",
    tag: "Brand & Seller",
  },
];

export default function CategorySelector({ onSelect }) {
  return (
    <div className="space-y-4">
      {CATEGORIES.map(({ key, icon: Icon, title, description, tag }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className="w-full text-left group"
        >
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
