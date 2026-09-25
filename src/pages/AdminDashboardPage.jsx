import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Users, TrendingUp, Star, RefreshCw, ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import { useInquiryList, useExport, InquiryTable, FilterBar, ExportButton } from "../features/admin/index.js";
import { useDashboard, StatCard, TrendChart, CategoryChart, StatusChart, TopDomiciliChart, PlatformGmvChart } from "../features/dashboard/index.js";
import { BdWaSettings } from "../features/settings/index.js";
import Sidebar from "../shared/components/Sidebar.jsx";
import Spinner from "../shared/components/Spinner.jsx";

function toDateStr(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function DashboardView() {
  const { stats, isLoading, error, startDate, endDate, setDateRange, clearDateRange } = useDashboard();
  const [pickerDates, setPickerDates] = useState([null, null]);
  const [startPicker, endPicker] = pickerDates;

  function handleDateChange(dates) {
    const [start, end] = dates;
    setPickerDates(dates);
    if (start && end) {
      setDateRange(toDateStr(start), toDateStr(end));
    }
  }

  function handleClear() {
    setPickerDates([null, null]);
    clearDateRange();
  }

  const hasFilter = startDate && endDate;

  return (
    <div className="space-y-6">
      {/* Header + date filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Dashboard</h1>
          {hasFilter && (
            <p className="font-sans text-xs text-graphite mt-0.5">
              Menampilkan data {startDate} — {endDate}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <CalendarDays size={15} className="absolute left-3 text-graphite/60 pointer-events-none" />
            <DatePicker
              selectsRange
              startDate={startPicker}
              endDate={endPicker}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Filter rentang tanggal..."
              maxDate={new Date()}
              className="pl-8 pr-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink placeholder-graphite/50 outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue w-56"
            />
          </div>
          {hasFilter && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-graphite/25 font-sans text-sm text-graphite hover:bg-cloud transition-colors"
            >
              <X size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64 text-superstar-blue">
          <Spinner size={32} />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-red-500 font-sans py-12">{error}</p>
      )}

      {!isLoading && stats && (() => {
        const { overview, byCategory, byStatus, trend, topDomicili, byPlatform, byGmvRange } = stats;
        const growthLabel = overview.lastMonth > 0
          ? `+${Math.round(((overview.thisMonth - overview.lastMonth) / overview.lastMonth) * 100)}% vs bulan lalu`
          : `${overview.thisMonth} bulan ini`;

        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Inquiry" value={overview.total} icon={Users} accent />
              <StatCard label="Bulan Ini" value={overview.thisMonth} sub={growthLabel} icon={TrendingUp} />
              <StatCard label="Inquiry Baru" value={overview.newCount} sub="Menunggu tindak lanjut" icon={RefreshCw} />
              <StatCard label="Qualified" value={overview.qualified} sub="Siap closing" icon={Star} />
            </div>
            <TrendChart data={trend} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CategoryChart data={byCategory} />
              <StatusChart data={byStatus} rawData={byStatus} />
            </div>
            <TopDomiciliChart data={topDomicili} />
            <PlatformGmvChart byPlatform={byPlatform} byGmvRange={byGmvRange} />
          </>
        );
      })()}
    </div>
  );
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}

function InquiriesView() {
  const { inquiries, meta, filters, searchInput, isLoading, error, updateFilter, setPage, refetch } = useInquiryList();
  const { isExporting, handleExport } = useExport();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Data Inquiry</h1>
          <p className="font-sans text-sm text-graphite mt-0.5">Total {meta.total} inquiry masuk</p>
        </div>
        <ExportButton filters={filters} onExport={handleExport} isExporting={isExporting} />
      </div>

      <div className="bg-white rounded-xl border border-graphite/15 p-4 mb-4">
        <FilterBar filters={filters} searchInput={searchInput} onFilterChange={updateFilter} />
      </div>

      {error && <p className="text-center text-red-500 font-sans py-8">{error}</p>}

      {/* Table stays mounted — hanya redup saat loading, tidak pernah hilang */}
      {!error && (
        <div className="relative">
          {/* Thin progress bar — muncul di atas tabel, tidak menghilangkan konten */}
          {isLoading && (
            <div className="absolute inset-x-0 -top-px z-10 h-0.5 bg-superstar-blue/15 rounded overflow-hidden">
              <div className="h-full w-2/5 bg-superstar-blue rounded animate-loading-bar" />
            </div>
          )}

          {/* First load: belum ada data sama sekali, tampilkan skeleton */}
          {isLoading && inquiries.length === 0 ? (
            <div className="bg-white rounded-xl border border-graphite/15 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-graphite/8 last:border-0 animate-pulse">
                  <div className="h-4 w-24 bg-graphite/10 rounded" />
                  <div className="h-4 flex-1 bg-graphite/10 rounded" />
                  <div className="h-4 w-20 bg-graphite/10 rounded" />
                  <div className="h-4 w-16 bg-graphite/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            /* Subsequent loads: redup tabel lama, tidak hilang */
            <div className={`transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none select-none" : "opacity-100"}`}>
              <InquiryTable inquiries={inquiries} onUpdate={refetch} />
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages >= 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-graphite/10">
          <p className="font-sans text-sm text-graphite">
            Halaman <span className="font-semibold text-ink">{meta.page}</span> dari{" "}
            <span className="font-semibold text-ink">{meta.totalPages}</span> &mdash;{" "}
            <span className="font-semibold text-ink">{meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(meta.page - 1)}
              disabled={meta.page <= 1}
              className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {buildPageNumbers(meta.page, meta.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="w-8 text-center font-sans text-sm text-graphite">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded font-sans text-sm transition-colors ${p === meta.page
                    ? "bg-superstar-blue text-white"
                    : "bg-white text-graphite border border-graphite/20 hover:border-superstar-blue"
                    }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const [activeView, setActiveView] = useState("inquiries");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-cloud">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={logout}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        {/* <header className="h-16 bg-white border-b border-graphite/15 px-6 flex items-center">
          <h2 className="font-display text-lg uppercase text-ink">
            {activeView === "dashboard" ? "Dashboard" : activeView === "settings" ? "Pengaturan" : "Data Inquiry"}
          </h2>
        </header> */}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "inquiries" && <InquiriesView />}
          {activeView === "settings" && <BdWaSettings />}
        </main>
      </div>
    </div>
  );
}
