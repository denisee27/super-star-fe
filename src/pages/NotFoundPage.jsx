import { useNavigate } from "react-router-dom";
import Button from "../shared/components/Button.jsx";
import Logo from "../shared/components/Logo.jsx";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center text-center p-6">
      <Logo variant="white" height={40} className="mb-8" />
      <h1 className="font-display text-7xl text-white uppercase mb-4">404</h1>
      <p className="font-sans text-white/70 mb-8">Halaman yang kamu cari tidak ditemukan.</p>
      <Button variant="secondary" onClick={() => navigate("/")}>Kembali ke Beranda</Button>
    </div>
  );
}
