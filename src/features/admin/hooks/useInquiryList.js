import { useState, useEffect, useCallback } from "react";
import { getInquiries } from "../services/adminService.js";

export function useInquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ category: "", status: "", search: "", startDate: "", endDate: "", page: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInquiries(filters);
      setInquiries(result.data);
      setMeta(result.meta);
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  function setPage(page) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return { inquiries, meta, filters, isLoading, error, updateFilter, setPage, refetch: fetchInquiries };
}
