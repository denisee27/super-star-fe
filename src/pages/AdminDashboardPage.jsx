import { useState, useEffect, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Users, TrendingUp, Star, RefreshCw, ChevronLeft, ChevronRight, CalendarDays, X, Plus, Trash2, ShieldCheck, Shield, Search, Pencil, KeyRound } from "lucide-react";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import { useInquiryList, useExport, InquiryTable, FilterBar, ExportButton } from "../features/admin/index.js";
import { useDashboard, StatCard, TrendChart, CategoryChart, StatusChart, TopDomiciliChart, PlatformGmvChart } from "../features/dashboard/index.js";
import { BdWaSettings } from "../features/settings/index.js";
import { listAdmins, createAdmin, updateAdmin, resetAdminPassword, deleteAdmin, getLogs } from "../features/admin/services/adminService.js";
import Sidebar from "../shared/components/Sidebar.jsx";
import Spinner from "../shared/components/Spinner.jsx";
import Modal from "../shared/components/Modal.jsx";
import ConfirmModal from "../shared/components/ConfirmModal.jsx";

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
    if (start && end) setDateRange(toDateStr(start), toDateStr(end));
  }

  function handleClear() {
    setPickerDates([null, null]);
    clearDateRange();
  }

  const hasFilter = startDate && endDate;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Dashboard</h1>
          {hasFilter && <p className="font-sans text-xs text-graphite mt-0.5">Menampilkan data {startDate} — {endDate}</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <CalendarDays size={15} className="absolute left-3 text-graphite/60 pointer-events-none" />
            <DatePicker
              selectsRange startDate={startPicker} endDate={endPicker}
              onChange={handleDateChange} dateFormat="dd/MM/yyyy"
              placeholderText="Filter rentang tanggal..." maxDate={new Date()}
              className="pl-8 pr-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink placeholder-graphite/50 outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue w-56"
            />
          </div>
          {hasFilter && (
            <button onClick={handleClear} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-graphite/25 font-sans text-sm text-graphite hover:bg-cloud transition-colors">
              <X size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center h-64 text-superstar-blue"><Spinner size={32} /></div>}
      {!isLoading && error && <p className="text-center text-red-500 font-sans py-12">{error}</p>}
      {!isLoading && stats && (() => {
        const { overview, byCategory, byStatus, trend, topDomicili, byPlatform, byGmvRange } = stats;
        const growthLabel = !hasFilter && overview.lastMonth > 0
          ? `+${Math.round(((overview.thisMonth - overview.lastMonth) / overview.lastMonth) * 100)}% vs bulan lalu`
          : null;
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Inquiry" value={overview.total} icon={Users} accent />
              <StatCard label={hasFilter ? "Dalam Rentang" : "Bulan Ini"} value={overview.thisMonth} sub={growthLabel} icon={TrendingUp} />
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
  if (current <= 4) pages.push(1, 2, 3, 4, 5, "...", total);
  else if (current >= total - 3) pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  else pages.push(1, "...", current - 1, current, current + 1, "...", total);
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
      {!error && (
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-x-0 -top-px z-10 h-0.5 bg-superstar-blue/15 rounded overflow-hidden">
              <div className="h-full w-2/5 bg-superstar-blue rounded animate-loading-bar" />
            </div>
          )}
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
            <div className={`transition-opacity duration-200 ${isLoading ? "opacity-50 pointer-events-none select-none" : "opacity-100"}`}>
              <InquiryTable inquiries={inquiries} onUpdate={refetch} />
            </div>
          )}
        </div>
      )}
      {meta.totalPages >= 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-graphite/10">
          <p className="font-sans text-sm text-graphite">
            Halaman <span className="font-semibold text-ink">{meta.page}</span> dari{" "}
            <span className="font-semibold text-ink">{meta.totalPages}</span> &mdash;{" "}
            <span className="font-semibold text-ink">{meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(meta.page - 1)} disabled={meta.page <= 1} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {buildPageNumbers(meta.page, meta.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="w-8 text-center font-sans text-sm text-graphite">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded font-sans text-sm transition-colors ${p === meta.page ? "bg-superstar-blue text-white" : "bg-white text-graphite border border-graphite/20 hover:border-superstar-blue"}`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setPage(meta.page + 1)} disabled={meta.page >= meta.totalPages} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = { email: "", name: "", password: "" };

function CreateAdminModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  function handleClose() {
    setForm(EMPTY_FORM);
    setFormError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.email || !form.name || !form.password) { setFormError("Semua field wajib diisi."); return; }
    if (form.password.length < 8) { setFormError("Password minimal 8 karakter."); return; }
    setIsCreating(true);
    try {
      await createAdmin(form);
      handleClose();
      onCreated();
    } catch (err) {
      setFormError(err.response?.data?.error ?? "Gagal membuat akun admin.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Admin Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1.5">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="admin@superstar.id"
            className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
          />
        </div>
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Nama lengkap admin"
            className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
          />
        </div>
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1.5">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Minimal 8 karakter"
            className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
          />
        </div>
        {formError && (
          <p className="font-sans text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className="px-4 py-2.5 font-sans text-sm font-medium text-graphite border border-graphite/25 rounded-lg hover:bg-cloud transition-colors">
            Batal
          </button>
          <button type="submit" disabled={isCreating} className="flex items-center gap-2 px-5 py-2.5 bg-superstar-blue text-white font-sans text-sm font-semibold rounded-lg hover:bg-superstar-blue/90 disabled:opacity-50 transition-colors">
            {isCreating ? <Spinner size={14} /> : <Plus size={15} />}
            {isCreating ? "Membuat..." : "Buat Akun"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditAdminModal({ isOpen, admin, onClose, onUpdated }) {
  const [tab, setTab] = useState("info");
  const [infoForm, setInfoForm] = useState({ name: "", email: "" });
  const [passForm, setPassForm] = useState({ password: "", confirm: "" });
  const [infoError, setInfoError] = useState("");
  const [passError, setPassError] = useState("");
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    if (admin) {
      setInfoForm({ name: admin.name, email: admin.email });
      setPassForm({ password: "", confirm: "" });
      setInfoError("");
      setPassError("");
      setTab("info");
    }
  }, [admin]);

  function handleClose() {
    setInfoError("");
    setPassError("");
    onClose();
  }

  async function handleSaveInfo(e) {
    e.preventDefault();
    setInfoError("");
    if (!infoForm.name || !infoForm.email) { setInfoError("Nama dan email wajib diisi."); return; }
    setIsSavingInfo(true);
    try {
      await updateAdmin(admin.id, infoForm);
      onUpdated();
      handleClose();
    } catch (err) {
      setInfoError(err.response?.data?.error ?? "Gagal memperbarui data.");
    } finally {
      setIsSavingInfo(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setPassError("");
    if (!passForm.password) { setPassError("Password baru wajib diisi."); return; }
    if (passForm.password.length < 8) { setPassError("Password minimal 8 karakter."); return; }
    if (passForm.password !== passForm.confirm) { setPassError("Konfirmasi password tidak cocok."); return; }
    setIsSavingPass(true);
    try {
      await resetAdminPassword(admin.id, passForm.password);
      setPassForm({ password: "", confirm: "" });
      handleClose();
    } catch (err) {
      setPassError(err.response?.data?.error ?? "Gagal reset password.");
    } finally {
      setIsSavingPass(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Edit: ${admin?.name ?? ""}`}>
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-cloud rounded-lg p-1">
        <button
          type="button"
          onClick={() => setTab("info")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-sans text-sm font-medium transition-colors ${tab === "info" ? "bg-white text-ink shadow-sm" : "text-graphite hover:text-ink"}`}
        >
          <Pencil size={13} /> Info
        </button>
        <button
          type="button"
          onClick={() => setTab("password")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md font-sans text-sm font-medium transition-colors ${tab === "password" ? "bg-white text-ink shadow-sm" : "text-graphite hover:text-ink"}`}
        >
          <KeyRound size={13} /> Reset Password
        </button>
      </div>

      {tab === "info" && (
        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={infoForm.name}
              onChange={e => setInfoForm(f => ({ ...f, name: e.target.value }))}
              className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              value={infoForm.email}
              onChange={e => setInfoForm(f => ({ ...f, email: e.target.value }))}
              className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
            />
          </div>
          {infoError && <p className="font-sans text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{infoError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="px-4 py-2.5 font-sans text-sm font-medium text-graphite border border-graphite/25 rounded-lg hover:bg-cloud transition-colors">Batal</button>
            <button type="submit" disabled={isSavingInfo} className="flex items-center gap-2 px-5 py-2.5 bg-superstar-blue text-white font-sans text-sm font-semibold rounded-lg hover:bg-superstar-blue/90 disabled:opacity-50 transition-colors">
              {isSavingInfo ? <Spinner size={14} /> : <Pencil size={14} />}
              {isSavingInfo ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Password Baru <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={passForm.password}
              onChange={e => setPassForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Minimal 8 karakter"
              className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
            />
          </div>
          <div>
            <label className="block font-sans text-sm font-medium text-ink mb-1.5">Konfirmasi Password <span className="text-red-500">*</span></label>
            <input
              type="password"
              value={passForm.confirm}
              onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Ulangi password baru"
              className="w-full font-sans text-sm border-2 border-graphite/25 rounded-lg px-3 py-2.5 outline-none focus:border-superstar-blue text-ink transition-all"
            />
          </div>
          {passError && <p className="font-sans text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{passError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="px-4 py-2.5 font-sans text-sm font-medium text-graphite border border-graphite/25 rounded-lg hover:bg-cloud transition-colors">Batal</button>
            <button type="submit" disabled={isSavingPass} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-sans text-sm font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
              {isSavingPass ? <Spinner size={14} /> : <KeyRound size={14} />}
              {isSavingPass ? "Mereset..." : "Reset Password"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

const USER_LIMIT_OPTIONS = [5, 10, 25, 50];

function UserManagementView() {
  const [admins, setAdmins] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const userDebounceRef = useRef(null);

  const fetchAdmins = useCallback(async (p, lim, q) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await listAdmins({ page: p, limit: lim, search: q || undefined });
      setAdmins(res.data);
      setMeta(res.meta);
    } catch {
      setError("Gagal memuat daftar pengguna.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(page, limit, search); }, [fetchAdmins, page, limit, search]);

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(userDebounceRef.current);
    userDebounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 350);
  }

  function handleLimitChange(e) {
    setLimit(Number(e.target.value));
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAdmin(deleteTarget.id);
      setDeleteTarget(null);
      fetchAdmins(page, limit, search);
    } catch (err) {
      setError(err.response?.data?.error ?? "Gagal menghapus akun admin.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Pengguna</h1>
          <p className="font-sans text-sm text-graphite mt-0.5">Total {meta.total} pengguna</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Cari nama atau email..."
              className="pl-8 pr-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink placeholder-graphite/40 outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue w-52 transition-all"
            />
          </div>

          {/* Limit selector */}
          <select
            value={limit}
            onChange={handleLimitChange}
            className="px-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue cursor-pointer"
          >
            {USER_LIMIT_OPTIONS.map(n => (
              <option key={n} value={n}>{n} per halaman</option>
            ))}
          </select>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-superstar-blue text-white font-sans text-sm font-semibold rounded-lg hover:bg-superstar-blue/90 transition-colors"
          >
            <Plus size={16} /> Tambah Admin
          </button>
        </div>
      </div>

      {error && <p className="font-sans text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

      <div className="bg-white rounded-xl border border-graphite/15 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12 text-superstar-blue"><Spinner size={28} /></div>
        ) : admins.length === 0 ? (
          <p className="text-center text-graphite font-sans py-12 text-sm">
            {search ? `Tidak ada hasil untuk "${search}".` : "Belum ada pengguna."}
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-cloud/50 border-b border-graphite/10">
              <tr>
                {["Nama", "Email", "Role", "Dibuat", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs font-semibold text-graphite uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} className="border-b border-graphite/8 last:border-0 hover:bg-cloud/30 transition-colors">
                  <td className="px-4 py-3 font-sans text-sm font-medium text-ink">{admin.name}</td>
                  <td className="px-4 py-3 font-sans text-sm text-graphite">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${admin.role === "SUPER_ADMIN" ? "bg-superstar-blue/10 text-superstar-blue" : "bg-graphite/10 text-graphite"}`}>
                      {admin.role === "SUPER_ADMIN" ? <ShieldCheck size={11} /> : <Shield size={11} />}
                      {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-graphite">{new Date(admin.createdAt).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3">
                    {admin.role !== "SUPER_ADMIN" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditTarget(admin)} className="p-1.5 text-graphite/40 hover:text-superstar-blue transition-colors rounded" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(admin)} className="p-1.5 text-graphite/40 hover:text-red-500 transition-colors rounded" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta.totalPages >= 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="font-sans text-sm text-graphite">
            Halaman <span className="font-semibold text-ink">{meta.page}</span> dari{" "}
            <span className="font-semibold text-ink">{meta.totalPages}</span> &mdash;{" "}
            <span className="font-semibold text-ink">{meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {buildPageNumbers(page, meta.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="w-8 text-center font-sans text-sm text-graphite">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded font-sans text-sm transition-colors ${p === page ? "bg-superstar-blue text-white" : "bg-white text-graphite border border-graphite/20 hover:border-superstar-blue"}`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <CreateAdminModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => fetchAdmins(page, limit, search)}
      />

      <EditAdminModal
        isOpen={!!editTarget}
        admin={editTarget}
        onClose={() => setEditTarget(null)}
        onUpdated={() => { fetchAdmins(page, limit, search); setEditTarget(null); }}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Hapus Admin"
        message={`Hapus akun "${deleteTarget?.name}" (${deleteTarget?.email})? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel={isDeleting ? "Menghapus..." : "Ya, Hapus"}
        variant="danger"
      />
    </div>
  );
}

const ACTION_LABELS = { LOGIN: "Login", CREATE: "Buat", UPDATE: "Update", DELETE: "Hapus" };
const RESOURCE_LABELS = { auth: "Autentikasi", admin: "Admin", inquiry: "Inquiry", setting: "Pengaturan" };
const ACTION_COLORS = {
  LOGIN: "bg-blue-50 text-blue-700",
  CREATE: "bg-green-50 text-green-700",
  UPDATE: "bg-amber-50 text-amber-700",
  DELETE: "bg-red-50 text-red-600",
};

const LIMIT_OPTIONS = [10, 25, 50, 100];

function AuditLogView() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const debounceRef = useRef(null);

  const fetchLogs = useCallback(async (p, lim, q) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await getLogs({ page: p, limit: lim, search: q || undefined });
      setLogs(res.data);
      setMeta(res.meta);
    } catch {
      setError("Gagal memuat log aktivitas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(page, limit, search); }, [fetchLogs, page, limit, search]);

  function handleSearchChange(e) {
    const val = e.target.value;
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(val);
    }, 350);
  }

  function handleLimitChange(e) {
    setLimit(Number(e.target.value));
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Log Aktivitas</h1>
          <p className="font-sans text-sm text-graphite mt-0.5">Total {meta.total} log</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Cari admin atau aktivitas..."
              className="pl-8 pr-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink placeholder-graphite/40 outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue w-56 transition-all"
            />
          </div>

          {/* Limit selector */}
          <select
            value={limit}
            onChange={handleLimitChange}
            className="px-3 py-2 font-sans text-sm border border-graphite/25 rounded-lg bg-white text-ink outline-none focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue cursor-pointer"
          >
            {LIMIT_OPTIONS.map(n => (
              <option key={n} value={n}>{n} per halaman</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-graphite/15 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12 text-superstar-blue"><Spinner size={28} /></div>
        ) : error ? (
          <p className="text-center text-red-500 font-sans py-8 text-sm">{error}</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-graphite font-sans py-12 text-sm">
            {search ? `Tidak ada hasil untuk "${search}".` : "Belum ada aktivitas tercatat."}
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-cloud/50 border-b border-graphite/10">
              <tr>
                {["Waktu", "Admin", "Aksi", "Fitur", "Detail"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs font-semibold text-graphite uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-graphite/8 last:border-0 hover:bg-cloud/30 transition-colors">
                  <td className="px-4 py-3 font-sans text-xs text-graphite whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3 font-sans text-sm text-ink">{log.admin?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${ACTION_COLORS[log.action] ?? "bg-graphite/10 text-graphite"}`}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-graphite capitalize">{RESOURCE_LABELS[log.resource] ?? log.resource}</td>
                  <td className="px-4 py-3 font-sans text-sm text-ink max-w-xs truncate" title={log.detail}>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta.totalPages >= 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="font-sans text-sm text-graphite">
            Halaman <span className="font-semibold text-ink">{meta.page}</span> dari{" "}
            <span className="font-semibold text-ink">{meta.totalPages}</span> &mdash;{" "}
            <span className="font-semibold text-ink">{meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {buildPageNumbers(page, meta.totalPages).map((p, i) =>
              p === "..." ? (
                <span key={`e-${i}`} className="w-8 text-center font-sans text-sm text-graphite">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded font-sans text-sm transition-colors ${p === page ? "bg-superstar-blue text-white" : "bg-white text-graphite border border-graphite/20 hover:border-superstar-blue"}`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page >= meta.totalPages} className="p-1.5 rounded border border-graphite/20 text-graphite hover:border-superstar-blue hover:text-superstar-blue disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { logout, isSuperAdmin } = useAuth();
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
        isSuperAdmin={isSuperAdmin}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "inquiries" && <InquiriesView />}
          {activeView === "settings" && <BdWaSettings />}
          {activeView === "users" && isSuperAdmin && <UserManagementView />}
          {activeView === "logs" && isSuperAdmin && <AuditLogView />}
        </main>
      </div>
    </div>
  );
}
