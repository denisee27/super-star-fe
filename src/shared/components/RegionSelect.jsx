import { useState, useEffect } from "react";
import Select from "./Select.jsx";
import { getProvinces, getRegencies } from "../services/regionService.js";

export default function RegionSelect({
  province,
  regency,
  onProvinceChange,
  onRegencyChange,
  provinceError,
  regencyError,
  required,
}) {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  useEffect(() => {
    getProvinces().then((data) =>
      setProvinces(data.map((p) => ({ value: p.name, label: p.name, id: p.id })))
    );
  }, []);

  useEffect(() => {
    if (!province) { setRegencies([]); return; }
    const found = provinces.find((p) => p.value === province);
    if (!found) return;
    setLoadingRegencies(true);
    getRegencies(found.id)
      .then((data) => setRegencies(data.map((r) => ({ value: r.name, label: r.name }))))
      .finally(() => setLoadingRegencies(false));
  }, [province, provinces]);

  function handleProvinceChange(e) {
    onProvinceChange(e.target.value);
    onRegencyChange("");
  }

  return (
    <div className="space-y-3">
      <Select
        label="Provinsi"
        placeholder="-- Pilih Provinsi --"
        options={provinces}
        value={province ?? ""}
        onChange={handleProvinceChange}
        error={provinceError}
        required={required}
      />
      <Select
        label="Kabupaten / Kota"
        placeholder={loadingRegencies ? "Memuat..." : "-- Pilih Kabupaten/Kota --"}
        options={regencies}
        value={regency ?? ""}
        onChange={(e) => onRegencyChange(e.target.value)}
        error={regencyError}
        required={required}
        disabled={!province || loadingRegencies}
      />
    </div>
  );
}
