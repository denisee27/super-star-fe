import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPortal } from "react-dom";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import { login, verifyLoginOtp } from "../features/admin/services/adminService.js";
import { sendOtp } from "../shared/services/otpService.js";
import Logo from "../shared/components/Logo.jsx";
import Input from "../shared/components/Input.jsx";
import Button from "../shared/components/Button.jsx";
import Spinner from "../shared/components/Spinner.jsx";
import Captcha from "../shared/components/Captcha.jsx";
import OtpModal from "../shared/components/OtpModal.jsx";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const RESEND_COOLDOWNS_SECS = [60, 180, 360, 600];
function getNextCooldown(count) {
  return RESEND_COOLDOWNS_SECS[Math.min(count, RESEND_COOLDOWNS_SECS.length - 1)];
}

export default function AdminLoginPage() {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setServerError("");
    try {
      await login(data.email, data.password);
      // Credentials OK — OTP was sent by backend
      setPendingEmail(data.email);
      setResendCount(0);
      setOtpError("");
    } catch {
      setServerError("Email atau password salah.");
    }
  }

  async function handleVerifyOtp(code) {
    if (!pendingEmail) return;
    setOtpError("");
    setIsVerifying(true);
    try {
      const result = await verifyLoginOtp(pendingEmail, code);
      setAccessToken(result.accessToken);
      navigate("/admin");
    } catch (err) {
      setOtpError(err.response?.data?.error ?? "Kode salah atau sudah kedaluwarsa.");
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    if (!pendingEmail) return;
    setOtpError("");
    setIsSendingOtp(true);
    try {
      await sendOtp(pendingEmail);
      setResendCount((c) => c + 1);
    } catch (err) {
      setOtpError(err.response?.data?.error ?? "Gagal mengirim ulang kode.");
    } finally {
      setIsSendingOtp(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <Logo variant="blue" height={36} />
        </div>
        <h1 className="font-display text-2xl uppercase text-ink text-center mb-1">Admin</h1>
        <p className="font-sans text-sm text-graphite text-center mb-6">Masuk untuk mengelola data inquiry</p>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded px-4 py-2 mb-4">
            <p className="font-sans text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@superstar.id" error={errors.email?.message} required {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} required {...register("password")} />
          <Captcha onVerify={setCaptchaOk} />
          <Button type="submit" disabled={isSubmitting || !captchaOk} className="w-full mt-2">
            {isSubmitting ? <><Spinner size={16} /> Memeriksa...</> : "Masuk"}
          </Button>
        </form>
      </div>

      {createPortal(
        <OtpModal
          isOpen={!!pendingEmail}
          email={pendingEmail ?? ""}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          isVerifying={isVerifying}
          isSending={isSendingOtp}
          error={otpError}
          nextResendCooldown={getNextCooldown(resendCount)}
        />,
        document.body
      )}
    </div>
  );
}
