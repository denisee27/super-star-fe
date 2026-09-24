import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmModal from "../../../shared/components/ConfirmModal.jsx";

export function useInquiryForm(schema, submitFn, onSuccess) {
  const form = useForm({ resolver: zodResolver(schema) });
  const [pendingData, setPendingData] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // react-hook-form validates then calls this — we pause here to show confirm
  function handleSubmit(data) {
    setPendingData(data);
  }

  async function handleConfirm() {
    const data = pendingData;
    setPendingData(null);
    setIsConfirming(true);
    try {
      await submitFn(data);
      onSuccess(data);
    } finally {
      setIsConfirming(false);
    }
  }

  function handleCancel() {
    setPendingData(null);
  }

  const confirmModal = createPortal(
    <ConfirmModal
      isOpen={!!pendingData}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      isLoading={isConfirming}
      title="Konfirmasi Pengiriman"
      message="Pastikan semua data yang kamu isi sudah benar. Data tidak dapat diubah setelah dikirim."
      confirmLabel="Ya, Kirim"
    />,
    document.body
  );

  return {
    form,
    isSubmitting: isConfirming,
    onSubmit: form.handleSubmit(handleSubmit),
    confirmModal,
  };
}
