import { ChevronRight, ArrowLeft } from "lucide-react";
import { MCN_PLATFORM } from "../types/inquiry.types.js";

const PLATFORMS = [
  {
    key: MCN_PLATFORM.TIKTOK_SHOP,
    title: "MCN TikTok Shop by Tokopedia",
    description: "Manajemen kreator khusus untuk platform TikTok Shop yang terintegrasi dengan Tokopedia.",
    logo: "/tiktok.png",
    logoBg: "bg-black",
  },
  {
    key: MCN_PLATFORM.SHOPEE,
    title: "MCN Shopee",
    description: "Manajemen kreator khusus untuk platform Shopee dengan dukungan penuh dari tim Superstar.",
    logo: "/shopee.png",
    logoBg: "bg-white border border-graphite/10",
  },
];

export default function PlatformSelector({ onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-6 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <p className="font-sans text-sm text-graphite mb-4">Pilih platform yang ingin kamu ikuti:</p>
      <div className="space-y-3">
        {PLATFORMS.map(({ key, title, description, logo, logoBg }) => (
          <button key={key} onClick={() => onSelect(key)} className="w-full text-left group">
            <div className="card-superstar bg-white border border-graphite/15 p-5 hover:border-superstar-blue hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg ${logoBg} flex items-center justify-center shrink-0 overflow-hidden`}>
                  <img src={logo} alt={title} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-sans font-semibold text-ink text-sm">{title}</h3>
                    <ChevronRight size={16} className="text-graphite group-hover:text-superstar-blue group-hover:translate-x-1 transition-all duration-300 mt-0.5 shrink-0" />
                  </div>
                  <p className="font-sans text-xs text-graphite mt-1">{description}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
