import { useState, useEffect, useRef } from "react";
import { RefreshCw, CheckCircle2, Lock } from "lucide-react";

const CODE_LENGTH = 5;
const FAIL_THRESHOLD = 3;
const LOCK_DURATIONS = [60, 180, 300];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

// Warp every pixel using dual sine waves — defeats standard OCR
function applyWave(src, dst) {
  const W = src.width;
  const H = src.height;
  const srcData = src.getContext("2d").getImageData(0, 0, W, H);
  const dstCtx = dst.getContext("2d");
  const dstData = dstCtx.createImageData(W, H);

  const phX = Math.random() * Math.PI * 2;
  const phY = Math.random() * Math.PI * 2;
  const aX = 6 + Math.random() * 4;
  const aY = 5 + Math.random() * 3;
  const fX = (Math.PI * 2) / (H * (0.45 + Math.random() * 0.25));
  const fY = (Math.PI * 2) / (W * (0.5 + Math.random() * 0.3));

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const sx = Math.round(x + aX * Math.sin(y * fX + phX));
      const sy = Math.round(y + aY * Math.sin(x * fY + phY));
      const cx = Math.max(0, Math.min(W - 1, sx));
      const cy = Math.max(0, Math.min(H - 1, sy));
      const si = (cy * W + cx) * 4;
      const di = (y * W + x) * 4;
      dstData.data[di]     = srcData.data[si];
      dstData.data[di + 1] = srcData.data[si + 1];
      dstData.data[di + 2] = srcData.data[si + 2];
      dstData.data[di + 3] = srcData.data[si + 3];
    }
  }
  dstCtx.putImageData(dstData, 0, 0);
}

function drawCaptcha(canvas, code) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d");

  // Draw base onto an offscreen canvas, then wave-warp onto the visible one
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const octx = off.getContext("2d");

  // Textured background
  const grad = octx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0,   "#ccd9ff");
  grad.addColorStop(0.5, "#d8e6ff");
  grad.addColorStop(1,   "#c5d5fe");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, W, H);

  // Dense background dots
  for (let i = 0; i < 110; i++) {
    octx.beginPath();
    octx.arc(Math.random() * W, Math.random() * H, rand(0.5, 2.5), 0, Math.PI * 2);
    octx.fillStyle = `rgba(${rand(20, 120)}, ${rand(20, 120)}, ${rand(110, 200)}, ${0.2 + Math.random() * 0.45})`;
    octx.fill();
  }

  // Ghost decoy digits — confuse OCR segmentation
  for (let i = 0; i < 4; i++) {
    octx.save();
    octx.globalAlpha = 0.09 + Math.random() * 0.11;
    octx.font = `bold ${rand(20, 30)}px ${Math.random() > 0.5 ? "serif" : "monospace"}`;
    octx.fillStyle = `rgb(${rand(0, 70)}, ${rand(0, 70)}, ${rand(110, 170)})`;
    octx.textBaseline = "middle";
    octx.fillText(
      String(rand(0, 9)),
      Math.random() * W * 0.85,
      H * 0.15 + Math.random() * H * 0.7
    );
    octx.restore();
  }

  // Background curves (under characters)
  for (let i = 0; i < 4; i++) {
    octx.beginPath();
    octx.moveTo(rand(0, W * 0.2), Math.random() * H);
    octx.bezierCurveTo(
      W * 0.25 + rand(-15, 15), Math.random() * H,
      W * 0.6  + rand(-15, 15), Math.random() * H,
      W * 0.82 + rand(0, W * 0.18), Math.random() * H
    );
    octx.strokeStyle = `rgba(${rand(50, 140)}, ${rand(50, 140)}, ${rand(130, 210)}, 0.28)`;
    octx.lineWidth = rand(1, 3);
    octx.stroke();
  }

  // Draw each character with heavy per-character distortion
  const fonts = ["monospace", "serif", "monospace", "serif", "monospace"];
  const charW = W / code.length;
  for (let i = 0; i < code.length; i++) {
    octx.save();
    const x = charW * i + charW / 2;
    octx.translate(x, H / 2 + (Math.random() - 0.5) * 18);

    // Rotation up to ±38°
    octx.rotate((Math.random() - 0.5) * (Math.PI / 2.4));

    // Skew both axes
    octx.transform(
      1, (Math.random() - 0.5) * 0.55,
      (Math.random() - 0.5) * 0.4, 1,
      0, 0
    );

    const fontSize = rand(26, 36);
    octx.font = `bold ${fontSize}px ${fonts[Math.floor(Math.random() * fonts.length)]}`;
    octx.fillStyle = `rgb(${rand(0, 45)}, ${rand(0, 55)}, ${rand(95, 175)})`;
    octx.shadowColor = "rgba(0,0,60,0.55)";
    octx.shadowBlur = 5;
    octx.shadowOffsetX = rand(1, 3);
    octx.shadowOffsetY = rand(1, 3);
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    octx.fillText(code[i], 0, 0);
    octx.restore();
  }

  // Apply wave pixel distortion from offscreen → visible canvas
  applyWave(off, canvas);

  // Interference lines drawn ON TOP of the warped image
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(rand(0, W * 0.15), rand(H * 0.1, H * 0.9));
    ctx.bezierCurveTo(
      W * 0.28 + rand(-20, 20), rand(H * 0.05, H * 0.95),
      W * 0.66 + rand(-20, 20), rand(H * 0.05, H * 0.95),
      W - rand(0, W * 0.15),   rand(H * 0.1, H * 0.9)
    );
    ctx.strokeStyle = `rgba(${rand(10, 100)}, ${rand(10, 100)}, ${rand(130, 210)}, ${0.3 + Math.random() * 0.35})`;
    ctx.lineWidth = rand(1, 2);
    ctx.stroke();
  }

  // Final noise layer
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, rand(0.5, 2), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rand(0, 80)}, ${rand(0, 80)}, ${rand(110, 200)}, 0.4)`;
    ctx.fill();
  }
}

export default function Captcha({ onVerify }) {
  const [code, setCode] = useState(generateCode);
  const [input, setInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockSecsLeft, setLockSecsLeft] = useState(0);
  const canvasRef = useRef(null);

  const isLocked = lockSecsLeft > 0;

  useEffect(() => {
    if (canvasRef.current) drawCaptcha(canvasRef.current, code);
  }, [code]);

  // Lockout countdown
  useEffect(() => {
    if (lockSecsLeft <= 0) return;
    const id = setInterval(() => setLockSecsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [lockSecsLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  function refresh() {
    if (isLocked) return;
    setCode(generateCode());
    setInput("");
    setVerified(false);
    onVerify(false);
  }

  function triggerLockout(newFailCount) {
    const tier = Math.floor(newFailCount / FAIL_THRESHOLD) - 1;
    const secs = LOCK_DURATIONS[Math.min(tier, LOCK_DURATIONS.length - 1)];
    setLockSecsLeft(secs);
    setCode(generateCode());
    setInput("");
  }

  function handleChange(e) {
    if (isLocked) return;
    const val = e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setInput(val);

    if (val.length < CODE_LENGTH) {
      if (verified) { setVerified(false); onVerify(false); }
      return;
    }

    if (val === code) {
      setVerified(true);
      setFailCount(0);
      onVerify(true);
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      if (newFail % FAIL_THRESHOLD === 0) {
        triggerLockout(newFail);
      } else {
        setWrongFlash(true);
        setTimeout(() => {
          setWrongFlash(false);
          setCode(generateCode());
          setInput("");
        }, 700);
      }
    }
  }

  const lockMm = String(Math.floor(lockSecsLeft / 60)).padStart(2, "0");
  const lockSs = String(lockSecsLeft % 60).padStart(2, "0");

  return (
    <div>
      <label className="block font-sans text-sm font-medium text-ink mb-1.5">
        Verifikasi CAPTCHA <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2 mb-2">
        <canvas
          ref={canvasRef}
          width={200}
          height={65}
          className={`rounded-lg border select-none transition-opacity ${isLocked ? "opacity-40 border-red-200" : "border-graphite/20"}`}
        />
        <button
          type="button"
          onClick={refresh}
          disabled={isLocked || verified}
          aria-label="Refresh CAPTCHA"
          className="p-2 rounded-lg border border-graphite/20 hover:border-superstar-blue hover:text-superstar-blue transition-colors text-graphite disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} />
        </button>
        {verified && <CheckCircle2 size={20} className="text-green-500 shrink-0" />}
        {isLocked && <Lock size={18} className="text-red-400 shrink-0" />}
      </div>
      <input
        type="text"
        inputMode="numeric"
        placeholder={isLocked ? `Terkunci ${lockMm}:${lockSs}` : "Ketik angka yang terlihat di atas"}
        value={isLocked ? "" : input}
        onChange={handleChange}
        maxLength={CODE_LENGTH}
        disabled={verified || isLocked}
        className={`w-full font-sans text-sm border-2 rounded-lg px-3 py-2.5 outline-none transition-all
          ${isLocked
            ? "border-red-300 bg-red-50 text-red-400 cursor-not-allowed"
            : verified
              ? "border-green-500 bg-green-50 text-green-700 cursor-default"
              : wrongFlash
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-graphite/25 focus:border-superstar-blue text-ink"}`}
      />
      {isLocked ? (
        <p className="font-sans text-xs text-red-500 mt-1">
          Terlalu banyak percobaan. Coba lagi dalam{" "}
          <span className="font-semibold tabular-nums">{lockMm}:{lockSs}</span>.
        </p>
      ) : verified ? (
        <p className="font-sans text-xs text-green-600 mt-1">CAPTCHA berhasil diverifikasi.</p>
      ) : wrongFlash ? (
        <p className="font-sans text-xs text-red-500 mt-1">Angka tidak sesuai, silakan coba kode baru.</p>
      ) : (
        <p className="font-sans text-xs text-graphite/60 mt-1">Ketik {CODE_LENGTH} angka yang terlihat pada gambar.</p>
      )}
    </div>
  );
}
