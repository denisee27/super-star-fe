import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import { getBrandWaConfig, updateSettings } from "../services/settingService.js";

const VARIABLES = ["{nama}", "{brand}", "{email}", "{kategori}", "{role}", "{kontak}"];

export default function BdWaSettings() {
  const [bdWaNumber, setBdWaNumber] = useState("");
  const [template, setTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBrandWaConfig()
      .then((data) => {
        setBdWaNumber(data.bdWaNumber ?? "");
        setTemplate(data.bdWaMessageTemplate ?? "");
      })
      .catch(() => setError("Gagal memuat pengaturan."))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateSettings({ bdWaNumber, bdWaMessageTemplate: template });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  }

  function insertVariable(v) {
    setTemplate((prev) => prev + v);
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
        <h2 className="font-display text-xl uppercase text-ink mb-1">Pengaturan WhatsApp BD</h2>
        <p className="font-sans text-sm text-graphite">
          Konfigurasi nomor WhatsApp Business Development dan pesan default yang dikirim ketika brand/reseller selesai mengisi form.
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

      <div>
        <Input
          label="Nomor WhatsApp BD"
          placeholder="6281234567890 (format internasional, tanpa + atau spasi)"
          value={bdWaNumber}
          onChange={(e) => setBdWaNumber(e.target.value)}
        />
        <p className="font-sans text-xs text-graphite mt-1">
          Contoh: <span className="font-mono">6281234567890</span> untuk nomor 0812-3456-7890
        </p>
      </div>

      <div>
        <label className="block font-sans text-sm font-medium text-ink mb-1">
          Template Pesan Default
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {VARIABLES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => insertVariable(v)}
              className="font-mono text-xs px-2 py-1 bg-cloud border border-graphite/20 rounded hover:border-superstar-blue hover:text-superstar-blue transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
        <textarea
          rows={5}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full border border-graphite/30 rounded-lg px-4 py-3 font-sans text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-superstar-blue/40 focus:border-superstar-blue resize-none"
          placeholder="Halo, Aku {nama} dari {brand}. Aku perlu tanya perihal service dari MCN Superstar Agency."
        />
        <p className="font-sans text-xs text-graphite mt-1">
          Klik variabel di atas untuk menyisipkan. Variabel akan diganti otomatis dengan data dari form brand.
        </p>
        <div className="mt-3 p-3 bg-cloud rounded-lg border border-graphite/10">
          <p className="font-sans text-xs text-graphite font-medium mb-1 uppercase tracking-wide">Preview (contoh)</p>
          <p className="font-sans text-sm text-ink">
            {template
              .replace("{nama}", "Budi Santoso")
              .replace("{brand}", "Skincare XYZ")
              .replace("{email}", "budi@skincare.com")
              .replace("{kategori}", "Skincare")
              .replace("{role}", "Owner")
              .replace("{kontak}", "081234567890")}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSaving} className="gap-2">
        {isSaving ? <><Spinner size={16} />Menyimpan...</> : <><Save size={16} />Simpan Pengaturan</>}
      </Button>
    </form>
  );
}
