import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../shared/hooks/useAuth.jsx";
import { login } from "../features/admin/services/adminService.js";
import Logo from "../shared/components/Logo.jsx";
import Input from "../shared/components/Input.jsx";
import Button from "../shared/components/Button.jsx";
import Spinner from "../shared/components/Spinner.jsx";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function AdminLoginPage() {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    setServerError("");
    try {
      const result = await login(data.email, data.password);
      setAccessToken(result.accessToken);
      navigate("/admin");
    } catch {
      setServerError("Email atau password salah.");
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <Logo variant="blue" height={36} />
        </div>
        <h1 className="font-display text-2xl uppercase text-ink text-center mb-1">Admin Panel</h1>
        <p className="font-sans text-sm text-graphite text-center mb-6">Masuk untuk mengelola data inquiry</p>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded px-4 py-2 mb-4">
            <p className="font-sans text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@superstar.id" error={errors.email?.message} required {...register("email")} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} required {...register("password")} />
          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? <><Spinner size={16} /> Masuk...</> : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
}
