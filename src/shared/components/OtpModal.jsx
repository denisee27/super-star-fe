import { useState, useEffect, useRef } from "react";
import { Mail, RefreshCw } from "lucide-react";
import Spinner from "./Spinner.jsx";

export default function OtpModal({ isOpen, email, onVerify, onResend, isVerifying, isSending, error, nextResendCooldown = 60 }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", "", "", ""]);
      setSecondsLeft(300);
      setResendCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // OTP expiry countdown
  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isOpen, secondsLeft]);

  // Resend cooldown countdown
  useEffect(() => {
    if (!isOpen || resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isOpen, resendCooldown]);

  function handleDigitChange(index, value) {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) {
      onVerify(next.join(""));
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const next = pasted.split("");
      setDigits(next);
      inputRefs.current[5]?.focus();
      onVerify(pasted);
    }
  }

  function handleResend() {
    setDigits(["", "", "", "", "", ""]);
    setSecondsLeft(300);
    setResendCooldown(nextResendCooldown);
    onResend();
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  const expired = secondsLeft <= 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const cooldownLabel = resendCooldown > 59
    ? `${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")}`
    : `${resendCooldown}s`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-7">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-superstar-blue/10 flex items-center justify-center">
            <Mail size={22} className="text-superstar-blue" />
          </div>
        </div>

        <h3 className="font-sans font-semibold text-lg text-ink text-center mb-1">Verifikasi Email</h3>
        <p className="font-sans text-sm text-graphite text-center mb-6 leading-relaxed">
          Kode 6 digit telah dikirim ke<br />
          <span className="font-semibold text-ink">{email}</span>
        </p>

        {/* 6-digit input */}
        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isVerifying || expired}
              className={`w-11 h-12 text-center font-sans font-semibold text-xl border-2 rounded-lg outline-none transition-all
                ${d ? "border-superstar-blue text-superstar-blue" : "border-graphite/25 text-ink"}
                focus:border-superstar-blue
                disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          ))}
        </div>

        {/* Timer */}
        <p className={`font-sans text-xs text-center mb-4 ${expired ? "text-red-500" : "text-graphite"}`}>
          {expired ? "Kode sudah kedaluwarsa." : `Kode berlaku ${mm}:${ss}`}
        </p>

        {/* Loading / error */}
        {isVerifying && (
          <div className="flex justify-center mb-4">
            <Spinner size={20} />
          </div>
        )}
        {error && (
          <p className="font-sans text-xs text-red-500 text-center mb-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        {/* Resend */}
        <div className="text-center">
          <p className="font-sans text-sm text-graphite mb-1">Tidak menerima kode?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isSending}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-superstar-blue hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-opacity"
          >
            {isSending ? <Spinner size={14} /> : <RefreshCw size={14} />}
            {resendCooldown > 0 ? `Kirim ulang (${cooldownLabel})` : "Kirim ulang kode"}
          </button>
        </div>
      </div>
    </div>
  );
}
