import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import INDONESIA_CITIES from "../data/indonesiaCities.js";

export default function CitySelect({ label, error, value = "", onChange, required, name }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const filtered = query.length === 0
    ? INDONESIA_CITIES
    : INDONESIA_CITIES.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        // If user typed something that doesn't match a city, reset to last valid value
        if (!INDONESIA_CITIES.includes(query)) {
          setQuery(value || "");
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [query, value]);

  function handleSelect(city) {
    setQuery(city);
    setOpen(false);
    onChange?.(city);
  }

  function handleClear(e) {
    e.stopPropagation();
    setQuery("");
    onChange?.("");
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
    setOpen(true);
    if (e.target.value === "") onChange?.("");
  }

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      {label && (
        <label className="font-sans text-sm font-medium text-ink">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type="text"
          autoComplete="off"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder="Ketik nama kota..."
          className={`w-full border rounded px-3 py-2.5 pr-8 font-sans text-sm text-ink bg-white placeholder-graphite/50 outline-none transition-all duration-200 focus:ring-2 focus:ring-superstar-blue focus:border-superstar-blue ${error ? "border-red-500" : "border-graphite/30"}`}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button type="button" onClick={handleClear} className="text-graphite/50 hover:text-graphite transition-colors">
              <X size={14} />
            </button>
          )}
          <ChevronDown size={14} className={`text-graphite/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>

        {open && filtered.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-graphite/20 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {filtered.map((city) => (
              <li
                key={city}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(city); }}
                className={`px-3 py-2 font-sans text-sm cursor-pointer transition-colors ${city === value ? "bg-superstar-blue/10 text-superstar-blue font-medium" : "text-ink hover:bg-cloud"}`}
              >
                {city}
              </li>
            ))}
          </ul>
        )}

        {open && filtered.length === 0 && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-graphite/20 rounded-lg shadow-lg px-3 py-3 font-sans text-sm text-graphite">
            Kota tidak ditemukan
          </div>
        )}
      </div>

      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}
