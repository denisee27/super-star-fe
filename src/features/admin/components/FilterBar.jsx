import { Search } from "lucide-react";
import Select from "../../../shared/components/Select.jsx";

const CATEGORY_OPTIONS = [
  { value: "", label: "Semua Kategori" },
  { value: "MCN_AGENCY", label: "MCN Agency" },
  { value: "PASUKAN_AFFILIATE", label: "Pasukan Affiliate" },
  { value: "BRAND_SELLER", label: "Brand/Seller" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "NEW", label: "Baru" },
  { value: "CONTACTED", label: "Dihubungi" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "REJECTED", label: "Ditolak" },
];

const DATE_INPUT_CLASS = "w-full border border-graphite/30 rounded px-3 py-2.5 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue";

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-48">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50" />
          <input
            type="text"
            placeholder="Cari nama / brand..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full border border-graphite/30 rounded pl-9 pr-3 py-2.5 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue"
          />
        </div>
      </div>
      <div className="w-44">
        <Select options={CATEGORY_OPTIONS} value={filters.category} onChange={(e) => onFilterChange("category", e.target.value)} />
      </div>
      <div className="w-40">
        <Select options={STATUS_OPTIONS} value={filters.status} onChange={(e) => onFilterChange("status", e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <div>
          <label className="font-sans text-xs text-graphite block mb-1">Dari</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className={DATE_INPUT_CLASS}
          />
        </div>
        <div>
          <label className="font-sans text-xs text-graphite block mb-1">Sampai</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className={DATE_INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  );
}
