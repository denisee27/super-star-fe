import { STATUS_LABEL } from "../types/admin.types.js";

const BADGE_COLORS = {
  NEW: "bg-superstar-blue/10 text-superstar-blue",
  CONTACTED: "bg-yellow-50 text-yellow-700",
  QUALIFIED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-600",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-sans font-semibold ${BADGE_COLORS[status] ?? "bg-cloud text-graphite"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
