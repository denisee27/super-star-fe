import { forwardRef } from "react";

const PhoneInput = forwardRef(function PhoneInput({ value = "", onChange, error, label, required, disabled }, ref) {
  const digits = typeof value === "string" && value.startsWith("+62")
    ? value.slice(3)
    : value ?? "";

  function handleChange(e) {
    const raw = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
    onChange("+62" + raw);
  }

  return (
    <div>
      {label && (
        <label className="font-sans text-sm font-medium text-ink block mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        <span className="flex items-center px-3 border border-r-0 border-graphite/30 rounded-l bg-cloud font-sans text-sm text-graphite font-medium select-none">
          +62
        </span>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          value={digits}
          onChange={handleChange}
          disabled={disabled}
          placeholder="812 3456 7890"
          className={`flex-1 border border-graphite/30 rounded-r px-3 py-2.5 font-sans text-sm text-ink bg-white outline-none focus:ring-2 focus:ring-superstar-blue/40 focus:border-superstar-blue transition-colors
            ${error ? "border-red-400 focus:ring-red-200 focus:border-red-400" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed bg-cloud" : ""}`}
        />
      </div>
      {error && <p className="font-sans text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

export default PhoneInput;
