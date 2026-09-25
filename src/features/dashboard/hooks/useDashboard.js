import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboardService.js";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getDashboardStats({ startDate, endDate })
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => { if (!cancelled) setError("Gagal memuat data dashboard."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [startDate, endDate]);

  function setDateRange(start, end) {
    setStartDate(start);
    setEndDate(end);
  }

  function clearDateRange() {
    setStartDate("");
    setEndDate("");
  }

  return { stats, isLoading, error, startDate, endDate, setDateRange, clearDateRange };
}
