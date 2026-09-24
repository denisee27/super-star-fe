export default function Select({ label, error, options = [], placeholder, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="font-sans text-sm font-medium text-ink">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full border rounded px-3 py-2.5 font-sans text-sm text-ink bg-white outline-none transition-all duration-200 focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue ${error ? "border-red-500" : "border-graphite/30"} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}
