import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, CalendarDays, Users, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../shared/components/Button.jsx";
import Modal from "../shared/components/Modal.jsx";
import ConfirmModal from "../shared/components/ConfirmModal.jsx";
import Spinner from "../shared/components/Spinner.jsx";
import Input from "../shared/components/Input.jsx";
import Select from "../shared/components/Select.jsx";
import InquiryDetail from "../features/admin/components/InquiryDetail.jsx";
import StatusBadge from "../features/admin/components/StatusBadge.jsx";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../features/admin/services/eventAdminService.js";
import { getInquiries } from "../features/admin/services/adminService.js";

const PLATFORM_OPTIONS = [
  { value: "TIKTOK_SHOP", label: "TikTok Shop" },
  { value: "SHOPEE", label: "Shopee" },
  { value: "TOKOPEDIA", label: "Tokopedia" },
  { value: "INSTAGRAM", label: "Instagram" },
];

const PLATFORM_LABEL = { TIKTOK_SHOP: "TikTok Shop", SHOPEE: "Shopee", TOKOPEDIA: "Tokopedia", INSTAGRAM: "Instagram" };

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

function toLocalDatetimeInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getEventStatus(event) {
  const now = new Date();
  if (!event.isActive) return { label: "Nonaktif", color: "bg-red-100 text-red-600" };
  if (new Date(event.expiresAt) <= now) return { label: "Expired", color: "bg-graphite/15 text-graphite" };
  if (new Date(event.startsAt) > now) return { label: "Belum Mulai", color: "bg-yellow-100 text-yellow-700" };
  return { label: "Aktif", color: "bg-green-100 text-green-700" };
}

const EMPTY_FORM = { name: "", platform: "TIKTOK_SHOP", startsAt: "", expiresAt: "", isActive: true };
const PAGE_SIZE = 20;

function EventFormModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setForm(initial
        ? { name: initial.name, platform: initial.platform, startsAt: toLocalDatetimeInput(initial.startsAt), expiresAt: toLocalDatetimeInput(initial.expiresAt), isActive: initial.isActive }
        : EMPTY_FORM
      );
    }
  }, [isOpen, initial]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.platform || !form.startsAt || !form.expiresAt) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (new Date(form.startsAt) >= new Date(form.expiresAt)) {
      setError("Tanggal mulai harus sebelum tanggal berakhir.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({ ...form, startsAt: new Date(form.startsAt).toISOString(), expiresAt: new Date(form.expiresAt).toISOString() });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error ?? "Gagal menyimpan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "Edit Event" : "Buat Event Baru"}>
      <div className="space-y-4">
        <Input label="Nama Event" placeholder="Contoh: Shopee Super Summit 2026" required value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Select label="Platform" options={PLATFORM_OPTIONS} required value={form.platform} onChange={(e) => set("platform", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-sans text-sm font-medium text-ink block mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
            <input type="datetime-local" required value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)}
              className="w-full border border-graphite/30 rounded px-3 py-2 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue" />
          </div>
          <div>
            <label className="font-sans text-sm font-medium text-ink block mb-1">Tanggal Berakhir <span className="text-red-500">*</span></label>
            <input type="datetime-local" required value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)}
              className="w-full border border-graphite/30 rounded px-3 py-2 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue" />
          </div>
        </div>
        <label className="flex items-center gap-2 font-sans text-sm text-ink cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="accent-superstar-blue" />
          Event Aktif
        </label>
        {error && <p className="font-sans text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </div>
    </Modal>
  );
}

function EventRegistrantsModal({ event, isOpen, onClose }) {
  const [inquiries, setInquiries] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const load = useCallback(async (p = 1) => {
    if (!event) return;
    setIsLoading(true);
    try {
      const result = await getInquiries({ eventId: event.id, category: "EVENT", page: p, limit: PAGE_SIZE });
      setInquiries(result.data ?? []);
      setTotal(result.meta?.total ?? 0);
      setTotalPages(result.meta?.totalPages ?? 1);
      setPage(p);
    } finally {
      setIsLoading(false);
    }
  }, [event]);

  useEffect(() => {
    if (isOpen && event) load(1);
  }, [isOpen, event, load]);

  function handleInquiryUpdate() {
    setSelectedInquiry(null);
    load(page);
  }

  if (!event) return null;

  const status = getEventStatus(event);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Peserta Event" size="xl">
        <div className="space-y-5">
          {/* Event info header */}
          <div className="bg-cloud rounded-lg px-4 py-3 flex flex-wrap gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={15} className="text-superstar-blue shrink-0" />
                <span className="font-sans font-semibold text-sm text-ink truncate">{event.name}</span>
                <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${status.color}`}>{status.label}</span>
              </div>
              <div className="font-sans text-xs text-graphite space-y-0.5">
                <div>Platform: {PLATFORM_LABEL[event.platform] ?? event.platform}</div>
                <div>{formatDate(event.startsAt)} — {formatDate(event.expiresAt)}</div>
                {event.accountLink && (
                  <a href={event.accountLink} target="_blank" rel="noopener noreferrer" className="text-superstar-blue hover:underline truncate block">
                    {event.accountLink}
                  </a>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-sans text-2xl font-bold text-superstar-blue">{total}</div>
              <div className="font-sans text-xs text-graphite">Peserta terdaftar</div>
            </div>
          </div>

          {/* Registrant table */}
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner size={24} /></div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-10 text-graphite font-sans text-sm">Belum ada peserta yang mendaftar.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded border border-graphite/15">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="bg-superstar-blue text-white">
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">No</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Tanggal</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Nama Lengkap</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">No HP</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Link Akun</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Domisili</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">GMV</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Followers</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Status</th>
                      <th className="text-left px-3 py-2.5 font-semibold whitespace-nowrap">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((item, idx) => (
                      <tr key={item.id} className="border-t border-graphite/10 hover:bg-cloud/60 transition-colors">
                        <td className="px-3 py-2.5 text-graphite">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-graphite">{formatDateShort(item.createdAt)}</td>
                        <td className="px-3 py-2.5 font-medium text-ink whitespace-nowrap">{item.fullName ?? "-"}</td>
                        <td className="px-3 py-2.5 text-graphite whitespace-nowrap">{item.phone ?? "-"}</td>
                        <td className="px-3 py-2.5 text-graphite max-w-[160px]">
                          {item.accountLink ? (
                            <a href={item.accountLink} target="_blank" rel="noopener noreferrer" className="text-superstar-blue hover:underline truncate block max-w-[140px]">
                              {item.accountLink}
                            </a>
                          ) : "-"}
                        </td>
                        <td className="px-3 py-2.5 text-graphite whitespace-nowrap">
                          {(item.province && item.regency) ? `${item.province} — ${item.regency}` : (item.regency ?? "-")}
                        </td>
                        <td className="px-3 py-2.5 text-graphite whitespace-nowrap">{item.gmvRange ?? "-"}</td>
                        <td className="px-3 py-2.5 text-graphite whitespace-nowrap">{item.followersRange ?? "-"}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                        <td className="px-3 py-2.5">
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            className="p-1.5 rounded hover:bg-superstar-blue/10 transition-colors text-superstar-blue"
                            title="Lihat detail"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="font-sans text-xs text-graphite">
                    Halaman {page} dari {totalPages} · {total} peserta
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => load(page - 1)}
                      disabled={page <= 1}
                      className="p-1.5 rounded border border-graphite/20 disabled:opacity-40 hover:bg-cloud transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => load(page + 1)}
                      disabled={page >= totalPages}
                      className="p-1.5 rounded border border-graphite/20 disabled:opacity-40 hover:bg-cloud transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {selectedInquiry && (
        <InquiryDetail
          inquiry={selectedInquiry}
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onUpdate={handleInquiryUpdate}
        />
      )}
    </>
  );
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [registrantsTarget, setRegistrantsTarget] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditTarget(null); setModalOpen(true); }
  function openEdit(event) { setEditTarget(event); setModalOpen(true); }

  async function handleSave(data) {
    if (editTarget) {
      await updateEvent(editTarget.id, data);
    } else {
      await createEvent(data);
    }
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteEvent(deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl uppercase text-ink">Manajemen Event</h1>
          <p className="font-sans text-xs text-graphite mt-0.5">Buat dan kelola event untuk pendaftaran publik.</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={16} /> Buat Event Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={28} /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-graphite font-sans text-sm">Belum ada event. Buat event baru untuk mulai.</div>
      ) : (
        <div className="overflow-x-auto rounded border border-graphite/15">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-superstar-blue text-white">
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama Event</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Platform</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Tanggal Mulai</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Tanggal Berakhir</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const status = getEventStatus(event);
                return (
                  <tr key={event.id} className="border-t border-graphite/10 hover:bg-cloud/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-superstar-blue shrink-0" />
                        {event.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-graphite">{PLATFORM_LABEL[event.platform] ?? event.platform}</td>
                    <td className="px-4 py-3 text-graphite whitespace-nowrap">{formatDate(event.startsAt)}</td>
                    <td className="px-4 py-3 text-graphite whitespace-nowrap">{formatDate(event.expiresAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setRegistrantsTarget(event)} className="p-1.5 rounded hover:bg-superstar-blue/10 transition-colors text-superstar-blue" title="Lihat peserta">
                          <Users size={15} />
                        </button>
                        <button onClick={() => openEdit(event)} className="p-1.5 rounded hover:bg-superstar-blue/10 transition-colors text-superstar-blue" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(event)} className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-500" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <EventFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editTarget} />

      <EventRegistrantsModal
        event={registrantsTarget}
        isOpen={!!registrantsTarget}
        onClose={() => setRegistrantsTarget(null)}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Hapus Event"
        message={`Yakin ingin menghapus event "${deleteTarget?.name}"? Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus"
        variant="danger"
      />
    </div>
  );
}
