import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Spinner from "./Spinner.jsx";

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmLabel = "Ya, Lanjutkan", cancelLabel = "Batal", isLoading = false, variant = "primary" }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" && !isLoading) onCancel();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const confirmCls = variant === "danger"
    ? "bg-red-500 hover:bg-red-600 text-white"
    : "bg-superstar-blue hover:bg-superstar-blue/90 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={!isLoading ? onCancel : undefined} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-superstar-blue/10 mx-auto mb-4">
          <AlertTriangle size={22} className="text-superstar-blue" />
        </div>
        <h3 className="font-sans font-semibold text-lg text-ink mb-2">{title}</h3>
        <p className="font-sans text-sm text-graphite mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-graphite/25 font-sans text-sm font-medium text-graphite hover:bg-cloud transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${confirmCls}`}
          >
            {isLoading && <Spinner size={14} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
