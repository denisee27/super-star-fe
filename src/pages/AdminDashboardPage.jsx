import { useState } from "react";
import { Users, TrendingUp, Star, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import { useInquiryList, useExport, InquiryTable, FilterBar, ExportButton } from "../features/admin/index.js";
import { useDashboard, StatCard, TrendChart, CategoryChart, StatusChart, TopDomiciliChart, PlatformGmvChart } from "../features/dashboard/index.js";
import { BdWaSettings } from "../features/settings/index.js";
import Sidebar from "../shared/components/Sidebar.jsx";
import Spinner from "../shared/components/Spinner.jsx";

function DashboardView() {
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-superstar-blue">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 font-sans py-12">{error}</p>;
  }

  if (!stats) return null;

  const { overview, byCategory, byStatus, trend, topDomicili, byPlatform, byGmvRange } = stats;

  const growthLabel = overview.lastMonth > 0
    ? `+${Math.round(((overview.thisMonth - overview.lastMonth) / overview.lastMonth) * 100)}% vs bulan lalu`
    : `${overview.thisMonth} bulan ini`;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Inquiry"
          value={overview.total}
          icon={Users}
          accent
        />
        <StatCard
          label="Bulan Ini"
          value={overview.thisMonth}
          sub={growthLabel}
          icon={TrendingUp}
        />
        <StatCard
          label="Inquiry Baru"
          value={overview.newCount}
          sub="Menunggu tindak lanjut"
          icon={RefreshCw}
        />
        <StatCard
          label="Qualified"
          value={overview.qualified}
          sub="Siap closing"
          icon={Star}
        />
      </div>

      {/* Trend */}
      <TrendChart data={trend} />

      {/* Category + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryChart data={byCategory} />
        <StatusChart data={byStatus} rawData={byStatus} />
      </div>

      {/* Top domicili */}
      <TopDomiciliChart data={topDomicili} />

      {/* Platform + GMV */}
      <PlatformGmvChart byPlatform={byPlatform} byGmvRange={byGmvRange} />
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
  const { inquiries, meta, filters, isLoading, error, updateFilter, setPage, refetch } = useInquiryList();
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
        <FilterBar filters={filters} onFilterChange={updateFilter} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12 text-superstar-blue">
          <Spinner size={28} />
        </div>
      )}
      {error && <p className="text-center text-red-500 font-sans py-8">{error}</p>}
      {!isLoading && !error && <InquiryTable inquiries={inquiries} onUpdate={refetch} />}

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
                  className={`w-8 h-8 rounded font-sans text-sm transition-colors ${
                    p === meta.page
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
        <header className="h-16 bg-white border-b border-graphite/15 px-6 flex items-center">
          <h2 className="font-display text-lg uppercase text-ink">
            {activeView === "dashboard" ? "Dashboard" : activeView === "settings" ? "Pengaturan" : "Data Inquiry"}
          </h2>
        </header>

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
