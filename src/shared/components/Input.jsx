export default function Input({ label, error, helperText, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-sans text-sm font-medium text-ink">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full border rounded px-3 py-2.5 font-sans text-sm text-ink bg-white placeholder-graphite/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue ${error ? "border-red-500" : "border-graphite/30"} ${className}`}
        {...props}
      />
      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="font-sans text-xs text-graphite">{helperText}</p>}
    </div>
  );
}
