import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import { getPixelConfig, updateSettings } from "../services/settingService.js";

const TABS = [
  { key: "pixelTiktokMcn", label: "TikTok MCN" },
  { key: "pixelShopeeMcn", label: "Shopee MCN" },
  { key: "pixelBrandSeller", label: "Brand / Seller" },
];

export default function MetaPixelSettings() {
  const [pixels, setPixels] = useState({ pixelTiktokMcn: "", pixelShopeeMcn: "", pixelBrandSeller: "" });
  const [activeTab, setActiveTab] = useState("pixelTiktokMcn");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPixelConfig()
      .then((data) => setPixels(data))
      .catch(() => setError("Gagal memuat konfigurasi pixel."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateSettings(pixels);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-superstar-blue">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-xl uppercase text-ink mb-1">Meta Pixel</h2>
        <p className="font-sans text-sm text-graphite">
          Paste kode Meta Pixel untuk setiap jalur form. Kode aktif saat pengunjung membuka form yang sesuai. Kosongkan untuk menonaktifkan.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded px-4 py-2">
          <p className="font-sans text-sm text-red-600">{error}</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded px-4 py-2">
          <p className="font-sans text-sm text-green-700">Pengaturan berhasil disimpan.</p>
        </div>
      )}

      <div className="flex gap-1 bg-cloud rounded-lg p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-1.5 rounded-md font-sans text-sm font-medium transition-colors ${
              activeTab === key ? "bg-white text-ink shadow-sm" : "text-graphite hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-sans text-sm font-medium text-ink">
            Kode Pixel — {TABS.find((t) => t.key === activeTab)?.label}
          </label>
          {pixels[activeTab] && (
            <span className="font-sans text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Aktif</span>
          )}
        </div>
        <textarea
          key={activeTab}
          rows={10}
          value={pixels[activeTab]}
          onChange={(e) => setPixels((prev) => ({ ...prev, [activeTab]: e.target.value }))}
          className="w-full border border-graphite/30 rounded-lg px-4 py-3 font-mono text-xs text-ink bg-white focus:outline-none focus:ring-2 focus:ring-superstar-blue/40 focus:border-superstar-blue resize-none"
          placeholder={"<!-- Meta Pixel Code -->\n<script>\n  fbq('init', 'ID_PIXEL_KAMU');\n  fbq('track', 'PageView');\n</script>\n<!-- End Meta Pixel Code -->"}
        />
        <p className="font-sans text-xs text-graphite mt-1">
          Copy seluruh kode dari Meta Ads Manager → Events Manager → lalu paste di sini.
        </p>
      </div>

      <Button type="submit" disabled={isSaving} className="gap-2">
        {isSaving ? <><Spinner size={16} />Menyimpan...</> : <><Save size={16} />Simpan Pengaturan</>}
      </Button>
    </form>
  );
}
