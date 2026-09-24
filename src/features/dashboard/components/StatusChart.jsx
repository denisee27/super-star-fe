import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STATUS_COLORS = {
  NEW: "#0041FB",
  CONTACTED: "#F59E0B",
  QUALIFIED: "#10B981",
  REJECTED: "#EF4444",
};

export default function StatusChart({ data = [], rawData = [] }) {
  const colored = data.map((d, i) => ({
    ...d,
    fill: STATUS_COLORS[rawData[i]?.key] ?? "#6B8CFE",
  }));

  return (
    <div className="bg-white rounded-xl border border-graphite/15 p-5">
      <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Inquiry per Status</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-graphite font-sans text-sm">Belum ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={colored} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v) => [v, "Inquiry"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {colored.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
