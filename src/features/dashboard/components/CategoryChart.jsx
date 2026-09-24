import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0041FB", "#001A66", "#6B8CFE", "#A5B4FC", "#C7D2FE"];

export default function CategoryChart({ data = [] }) {
  return (
    <div className="bg-white rounded-xl border border-graphite/15 p-5">
      <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Inquiry per Kategori</h3>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-graphite font-sans text-sm">Belum ada data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [v, name]}
              contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif", paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
