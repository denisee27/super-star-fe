import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function TrendChart({ data = [] }) {
  return (
    <div className="bg-white rounded-xl border border-graphite/15 p-5">
      <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Tren Inquiry (30 Hari)</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-graphite font-sans text-sm">Belum ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0041FB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0041FB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(v) => [v, "Inquiry"]}
              labelFormatter={formatDate}
              contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
            />
            <Area type="monotone" dataKey="count" stroke="#0041FB" strokeWidth={2} fill="url(#trendGrad)" dot={false} activeDot={{ r: 4, fill: "#0041FB" }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
