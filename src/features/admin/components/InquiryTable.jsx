import { useState } from "react";
import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import InquiryDetail from "./InquiryDetail.jsx";
import { CATEGORY_LABEL } from "../types/admin.types.js";

function formatDate(date) {
  return new Date(date).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

export default function InquiryTable({ inquiries, onUpdate }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="overflow-x-auto rounded border border-graphite/15">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-superstar-blue text-white">
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">No</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Tanggal</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Kategori</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Nama / Brand</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Kontak</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Domisili</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-graphite">Belum ada data inquiry.</td>
              </tr>
            )}
            {inquiries.map((item, idx) => (
              <tr key={item.id} className="border-t border-graphite/10 hover:bg-cloud/60 transition-colors">
                <td className="px-4 py-3 text-graphite">{idx + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap text-graphite">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="font-sans text-xs font-semibold bg-superstar-blue/10 text-superstar-blue px-2 py-0.5 rounded">
                    {CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{item.fullName ?? item.brandName ?? "-"}</td>
                <td className="px-4 py-3 text-graphite">{item.phone ?? item.picContact ?? "-"}</td>
                <td className="px-4 py-3 text-graphite">{item.domicile}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(item)} className="p-1.5 rounded hover:bg-superstar-blue/10 transition-colors text-superstar-blue">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <InquiryDetail
          inquiry={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { setSelected(null); onUpdate(); }}
        />
      )}
    </>
  );
}
