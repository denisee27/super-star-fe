import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

const PLATFORM_COLORS = ["#0041FB", "#001A66"];

export default function PlatformGmvChart({ byPlatform = [], byGmvRange = [] }) {
  const gmvData = byGmvRange.map((d) => ({ name: d.gmvRange, value: d.count }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-graphite/15 p-5">
        <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Platform (MCN)</h3>
        {byPlatform.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-graphite font-sans text-sm">Belum ada data</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={byPlatform} cx="50%" cy="45%" outerRadius={65} dataKey="value" paddingAngle={3}>
                {byPlatform.map((_, i) => (
                  <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, name) => [v, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl border border-graphite/15 p-5">
        <h3 className="font-sans font-semibold text-sm text-graphite uppercase tracking-wide mb-4">Sebaran GMV Range</h3>
        {gmvData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-graphite font-sans text-sm">Belum ada data</div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gmvData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#474747" }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#474747" }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v) => [v, "Inquiry"]}
                contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Plus Jakarta Sans, sans-serif" }}
              />
              <Bar dataKey="value" fill="#001A66" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
