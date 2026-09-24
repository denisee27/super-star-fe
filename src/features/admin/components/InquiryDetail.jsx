import { useState } from "react";
import Modal from "../../../shared/components/Modal.jsx";
import Button from "../../../shared/components/Button.jsx";
import Select from "../../../shared/components/Select.jsx";
import StatusBadge from "./StatusBadge.jsx";
import { CATEGORY_LABEL, STATUS_LABEL } from "../types/admin.types.js";
import { updateInquiryStatus } from "../services/adminService.js";

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-sans text-xs text-graphite font-medium">{label}</dt>
      <dd className="font-sans text-sm text-ink mt-0.5 break-all">{value}</dd>
    </div>
  );
}

export default function InquiryDetail({ inquiry, isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState(inquiry?.status ?? "NEW");
  const [notes, setNotes] = useState(inquiry?.notes ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateInquiryStatus(inquiry.id, status, notes);
      onUpdate();
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  if (!inquiry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Inquiry">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="font-sans text-xs font-semibold bg-cloud text-graphite px-2 py-1 rounded">
            {CATEGORY_LABEL[inquiry.category] ?? inquiry.category}
          </span>
          <StatusBadge status={inquiry.status} />
          {inquiry.platform && (
            <span className="font-sans text-xs text-graphite">{inquiry.platform}</span>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <Field label="Nama / Brand" value={inquiry.fullName ?? inquiry.brandName} />
          <Field label="No HP / Kontak" value={inquiry.phone ?? inquiry.picContact} />
          <Field label="Username" value={inquiry.username} />
          <Field label="Link Akun / Toko" value={inquiry.accountLink ?? inquiry.storeLink} />
          <Field label="Domisili" value={inquiry.domicile} />
          <Field label="GMV / Bulan" value={inquiry.gmvRange} />
          <Field label="Followers" value={inquiry.followersRange} />
          <Field label="Kategori Produk" value={inquiry.productCategory} />
          <Field label="Nama PIC" value={inquiry.picName} />
          <Field label="Role PIC" value={inquiry.picRole} />
        </dl>

        <div className="border-t border-graphite/15 pt-4 space-y-3">
          <Select
            label="Update Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
          <div>
            <label className="font-sans text-sm font-medium text-ink block mb-1">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan..."
              className="w-full border border-graphite/30 rounded px-3 py-2 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Batal</Button>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
