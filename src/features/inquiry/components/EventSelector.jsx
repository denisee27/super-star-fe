import { CalendarDays, ChevronRight, ArrowLeft } from "lucide-react";

const PLATFORM_LABEL = {
  TIKTOK_SHOP: "TikTok Shop",
  SHOPEE: "Shopee",
  TOKOPEDIA: "Tokopedia",
  INSTAGRAM: "Instagram",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventSelector({ events = [], onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-6 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <p className="font-sans text-sm text-graphite mb-4">Pilih event yang ingin kamu ikuti:</p>
      {events.length === 0 ? (
        <div className="text-center py-8 text-graphite font-sans text-sm">
          Tidak ada event aktif saat ini.
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <button key={event.id} onClick={() => onSelect(event)} className="w-full text-left group">
              <div className="card-superstar bg-white border border-graphite/15 p-5 hover:border-superstar-blue hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cloud flex items-center justify-center shrink-0 group-hover:bg-superstar-blue transition-colors duration-300">
                    <CalendarDays size={18} className="text-superstar-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-sans font-semibold text-ink text-sm">{event.name}</h3>
                        <p className="font-sans text-xs text-graphite mt-0.5">
                          {PLATFORM_LABEL[event.platform] ?? event.platform} · Berakhir {formatDate(event.expiresAt)}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-graphite group-hover:text-superstar-blue group-hover:translate-x-1 transition-all duration-300 mt-0.5 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
