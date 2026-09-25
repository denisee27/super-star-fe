import { z } from "zod";
import { Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import CitySelect from "../../../shared/components/CitySelect.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import { GMV_RANGE } from "../types/inquiry.types.js";
import { submitPasInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.jsx";

const GMV_OPTIONS = Object.values(GMV_RANGE).map((v) => ({ value: v, label: v }));

const PAS_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  username: z.string().min(2, "Username wajib diisi"),
  gmvRange: z.string().min(1, "Pilih range GMV"),
  domicile: z.string().min(2, "Domisili wajib diisi"),
});

export default function PasForm({ onSuccess, onBack }) {
  const { form, isSubmitting, onSubmit, confirmModal } = useInquiryForm(PAS_SCHEMA, submitPasInquiry, onSuccess);
  const { register, control, formState: { errors } } = form;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-4 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="email@kamu.com" error={errors.email?.message} required {...register("email")} />
        <Input label="Nama" placeholder="Nama kamu" error={errors.fullName?.message} required {...register("fullName")} />
        <Input label="Username (TikTok / Shopee)" placeholder="@username" error={errors.username?.message} required {...register("username")} />
        <Select label="GMV per bulan" placeholder="-- Pilih range GMV --" options={GMV_OPTIONS} error={errors.gmvRange?.message} required {...register("gmvRange")} />
        <Controller
          control={control}
          name="domicile"
          render={({ field }) => (
            <CitySelect label="Domisili / Kota" error={errors.domicile?.message} required value={field.value || ""} onChange={field.onChange} />
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Gabung Sekarang"}
        </Button>
      </form>
      {confirmModal}
    </div>
  );
}
