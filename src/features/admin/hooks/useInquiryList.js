import { useState, useEffect, useCallback, useMemo } from "react";
import { getInquiries } from "../services/adminService.js";
import { useDebounce } from "../../../shared/hooks/useDebounce.js";

export function useInquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  // Non-search filters fire immediately
  const [filters, setFilters] = useState({ category: "", status: "", startDate: "", endDate: "", page: 1 });
  // Search is debounced separately
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Combined filters for API (debounced search merged in)
  const apiFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInquiries(apiFilters);
      setInquiries(result.data);
      setMeta(result.meta);
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, [apiFilters]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  function updateFilter(key, value) {
    if (key === "search") {
      setSearchInput(value);
      setFilters((prev) => ({ ...prev, page: 1 }));
    } else {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    }
  }

  function setPage(page) {
    setFilters((prev) => ({ ...prev, page }));
  }

  // apiFilters is what gets passed to export (includes debounced search)
  return { inquiries, meta, filters: apiFilters, searchInput, isLoading, error, updateFilter, setPage, refetch: fetchInquiries };
}
