import { useState } from "react";
import { exportInquiries } from "../services/adminService.js";

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(filters) {
    setIsExporting(true);
    try {
      await exportInquiries(filters);
    } finally {
      setIsExporting(false);
    }
  }

  return { isExporting, handleExport };
}
