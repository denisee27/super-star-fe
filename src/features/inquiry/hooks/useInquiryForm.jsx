import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import OtpModal from "../../../shared/components/OtpModal.jsx";
import { sendOtp, verifyOtp } from "../../../shared/services/otpService.js";

// Must mirror RESEND_COOLDOWNS_MS on the backend (in seconds, index = sendCount after this send)
const RESEND_COOLDOWNS_SECS = [60, 180, 360, 600];

function getNextCooldown(resendCount) {
  return RESEND_COOLDOWNS_SECS[Math.min(resendCount, RESEND_COOLDOWNS_SECS.length - 1)];
}

export function useInquiryForm(schema, submitFn, onSuccess, { skipOtp = false, otpField = "phone" } = {}) {
  const form = useForm({ resolver: zodResolver(schema) });
  const [pendingData, setPendingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCount, setResendCount] = useState(0);

  // Called after react-hook-form validates — skip OTP or send OTP then show modal
  async function handleSubmit(data) {
    if (skipOtp) {
      setIsSubmitting(true);
      try {
        await submitFn(data);
        onSuccess(data);
      } catch (err) {
        form.setError("root", { message: err.response?.data?.error ?? "Terjadi kesalahan. Coba lagi." });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setOtpError("");
    setResendCount(0);
    setIsSendingOtp(true);
    try {
      await sendOtp(data[otpField]);
      setPendingData(data);
    } catch (err) {
      const msg = err.response?.data?.error ?? "Gagal mengirim kode. Coba lagi.";
      form.setError(otpField, { message: msg });
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerify(code) {
    if (!pendingData) return;
    setOtpError("");
    setIsSubmitting(true);
    try {
      await verifyOtp(pendingData[otpField], code);
      const data = pendingData;
      await submitFn(data);
      setPendingData(null);
      onSuccess(data);
    } catch (err) {
      setOtpError(err.response?.data?.error ?? "Verifikasi gagal. Periksa kode kamu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (!pendingData) return;
    setOtpError("");
    setIsSendingOtp(true);
    try {
      await sendOtp(pendingData[otpField]);
      setResendCount((c) => c + 1);
    } catch (err) {
      setOtpError(err.response?.data?.error ?? "Gagal mengirim ulang kode.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  const confirmModal = createPortal(
    <OtpModal
      isOpen={!!pendingData}
      phone={pendingData?.[otpField] ?? ""}
      onVerify={handleVerify}
      onResend={handleResend}
      isVerifying={isSubmitting}
      isSending={isSendingOtp}
      error={otpError}
      nextResendCooldown={getNextCooldown(resendCount)}
    />,
    document.body
  );

  return {
    form,
    isSubmitting: isSendingOtp, // button shows loading while sending OTP
    onSubmit: form.handleSubmit(handleSubmit),
    confirmModal,
  };
}
