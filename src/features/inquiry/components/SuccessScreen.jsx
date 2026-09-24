import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "../../../shared/components/Button.jsx";
import { getBrandWaConfig } from "../../settings/services/settingService.js";

const PAS_WHATSAPP_URL = "https://chat.whatsapp.com/EXSgxMGLGDvFVZGe9wpAIV?s=cl&p=a&ilr=1";

const MESSAGES = {
  MCN_AGENCY: {
    heading: "Pendaftaran Berhasil!",
    body: "Data kamu sudah kita terima. Tim Superstar akan segera menghubungi kamu untuk langkah selanjutnya.",
  },
  PASUKAN_AFFILIATE: {
    heading: "Kamu Masuk Radar Kami!",
    body: "Data kamu sudah tercatat. Langkah selanjutnya, gabung ke grup WhatsApp komunitas Pasukan Affiliate Superstar!",
  },
  BRAND_SELLER: {
    heading: "Terima Kasih!",
    body: "Formulir kamu sudah kita terima. Klik tombol di bawah untuk langsung chat dengan BD kami dan mulai diskusi kolaborasi!",
  },
};

function buildWaMessage(template, formData) {
  if (!template || !formData) return template ?? "";
  return template
    .replace("{nama}", formData.picName ?? "")
    .replace("{brand}", formData.brandName ?? "")
    .replace("{email}", formData.email ?? "")
    .replace("{kategori}", formData.productCategory ?? "")
    .replace("{role}", formData.picRole ?? "")
    .replace("{kontak}", formData.picContact ?? "");
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.863L.057 23.571a.5.5 0 0 0 .61.61l5.708-1.469A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.921 0-3.728-.513-5.283-1.41l-.379-.223-3.93 1.011 1.011-3.842-.243-.394A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function BrandWaButton({ formData }) {
  const [waUrl, setWaUrl] = useState(null);

  useEffect(() => {
    getBrandWaConfig().then((config) => {
      const number = config.bdWaNumber?.replace(/\D/g, "");
      if (!number) return;
      const message = buildWaMessage(config.bdWaMessageTemplate, formData);
      setWaUrl(`https://wa.me/${number}?text=${encodeURIComponent(message)}`);
    }).catch(() => {});
  }, [formData]);

  if (!waUrl) return null;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm px-6 py-3 rounded transition-colors"
    >
      <WhatsAppIcon />
      Chat dengan BD Superstar
    </a>
  );
}

export default function SuccessScreen({ category, formData, onReset }) {
  const msg = MESSAGES[category] ?? MESSAGES.MCN_AGENCY;
  const isPas = category === "PASUKAN_AFFILIATE";
  const isBrand = category === "BRAND_SELLER";

  return (
    <div className="text-center py-6">
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 rounded-full bg-superstar-blue/10 flex items-center justify-center">
          <CheckCircle2 size={48} className="text-superstar-blue" />
        </div>
      </div>
      <h2 className="font-display text-2xl uppercase text-ink mb-3">{msg.heading}</h2>
      <p className="font-sans text-graphite text-sm leading-relaxed max-w-sm mx-auto mb-8">{msg.body}</p>
      <div className="flex flex-col items-center gap-3">
        {isPas && (
          <a
            href={PAS_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full max-w-xs bg-[#25D366] hover:bg-[#1ebe5d] text-white font-sans font-semibold text-sm px-6 py-3 rounded transition-colors"
          >
            <WhatsAppIcon />
            Join Grup WhatsApp PAS
          </a>
        )}
        {isBrand && <BrandWaButton formData={formData} />}
        <Button variant="outline" onClick={onReset}>
          Daftar Jalur Lain
        </Button>
      </div>
      <p className="font-sans text-xs text-graphite/60 mt-8 uppercase tracking-widest">HELPING YOU BECOME A SUPERSTAR</p>
    </div>
  );
}
