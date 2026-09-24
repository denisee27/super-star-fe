import { Download } from "lucide-react";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";

export default function ExportButton({ filters, onExport, isExporting }) {
  return (
    <Button variant="secondary" onClick={() => onExport(filters)} disabled={isExporting}>
      {isExporting ? <Spinner size={16} /> : <Download size={16} />}
      {isExporting ? "Mengunduh..." : "Download Excel"}
    </Button>
  );
}
