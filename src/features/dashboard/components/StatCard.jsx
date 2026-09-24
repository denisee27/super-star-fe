export default function StatCard({ label, value, sub, icon: Icon, accent = false }) {
  return (
    <div className={`rounded-xl p-5 border flex items-start gap-4 ${accent ? "bg-superstar-blue text-white border-transparent" : "bg-white text-ink border-graphite/15"}`}>
      {Icon && (
        <div className={`p-2.5 rounded-lg shrink-0 ${accent ? "bg-white/20" : "bg-cloud"}`}>
          <Icon size={20} className={accent ? "text-white" : "text-superstar-blue"} />
        </div>
      )}
      <div className="min-w-0">
        <p className={`font-sans text-xs font-medium uppercase tracking-wide mb-1 ${accent ? "text-white/70" : "text-graphite"}`}>{label}</p>
        <p className={`font-display text-3xl ${accent ? "text-white" : "text-ink"}`}>{value ?? "-"}</p>
        {sub && <p className={`font-sans text-xs mt-1 ${accent ? "text-white/60" : "text-graphite"}`}>{sub}</p>}
      </div>
    </div>
  );
}
