import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TopDomiciliChart({ data = [] }) {
  const formatted = data.map((d) => ({ name: d.domicile, value: d.count }));

  return (
    <div className="bg-white rounded-xl border border-graphite/15 p-5">
      <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Top Domisili</h3>
      {formatted.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-graphite font-sans text-sm">Belum ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v) => [v, "Inquiry"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
            />
            <Bar dataKey="value" fill="#0041FB" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
