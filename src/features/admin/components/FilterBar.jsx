import { useRef } from "react";
import { Search, CalendarDays, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

function toDateStr(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromDateStr(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function FilterBar({ filters, searchInput, onFilterChange }) {
  const pickerRef = useRef(null);

  const startDate = fromDateStr(filters.startDate);
  const endDate   = fromDateStr(filters.endDate);

  function handleDateChange([start, end]) {
    onFilterChange("startDate", toDateStr(start));
    onFilterChange("endDate",   toDateStr(end));
  }

  function clearDates() {
    onFilterChange("startDate", "");
    onFilterChange("endDate",   "");
  }

  const hasDates = filters.startDate || filters.endDate;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Search — value bound to searchInput (debounced internally) */}
      <div className="flex-1 min-w-48">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama / brand / email..."
            value={searchInput}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full border border-graphite/30 rounded pl-9 pr-3 py-2.5 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue/40 focus:border-superstar-blue"
          />
        </div>
      </div>

      {/* Category */}
      <div className="w-44">
        <Select
          options={CATEGORY_OPTIONS}
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        />
      </div>

      {/* Status */}
      <div className="w-40">
        <Select
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        />
      </div>

      {/* Date Range Picker */}
      <div className="relative">
        <div className="relative flex items-center">
          <CalendarDays size={15} className="absolute left-3 text-graphite/50 pointer-events-none z-10" />
          <DatePicker
            ref={pickerRef}
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Pilih rentang tanggal..."
            isClearable={false}
            className="border border-graphite/30 rounded pl-9 pr-8 py-2.5 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue/40 focus:border-superstar-blue w-56 cursor-pointer"
            calendarClassName="shadow-xl border border-graphite/15 rounded-xl overflow-hidden font-sans"
            showPopperArrow={false}
            popperPlacement="bottom-end"
          />
          {hasDates && (
            <button
              onClick={clearDates}
              className="absolute right-2.5 text-graphite/50 hover:text-graphite transition-colors"
              title="Hapus filter tanggal"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
