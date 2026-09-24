import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import Select from "../../../shared/components/Select.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import { GMV_RANGE, FOLLOWERS_RANGE, MCN_PLATFORM } from "../types/inquiry.types.js";
import { submitMcnInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.js";

const GMV_OPTIONS = Object.values(GMV_RANGE).map((v) => ({ value: v, label: v }));
const FOLLOWER_OPTIONS = Object.values(FOLLOWERS_RANGE).map((v) => ({ value: v, label: v }));

const MCN_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(8, "No HP tidak valid"),
  accountLink: z.string().url("Link harus berupa URL valid (https://...)"),
  domicile: z.string().min(2, "Domisili wajib diisi"),
  gmvRange: z.string().min(1, "Pilih range GMV"),
  followersRange: z.string().min(1, "Pilih range followers"),
});

const PLATFORM_LABEL = {
  [MCN_PLATFORM.TIKTOK_SHOP]: "MCN TikTok Shop by Tokopedia",
  [MCN_PLATFORM.SHOPEE]: "MCN Shopee",
};

export default function McnForm({ platform, onSuccess, onBack }) {
  const { form, isSubmitting, onSubmit } = useInquiryForm(
    MCN_SCHEMA,
    (data) => submitMcnInquiry({ ...data, platform }),
    onSuccess
  );
  const { register, formState: { errors } } = form;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-4 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div className="inline-block bg-superstar-blue/10 text-superstar-blue font-sans text-xs font-semibold px-2 py-1 rounded mb-5">
        {PLATFORM_LABEL[platform]}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="email@kamu.com" error={errors.email?.message} required {...register("email")} />
        <Input label="Nama Lengkap" placeholder="Nama lengkap kamu" error={errors.fullName?.message} required {...register("fullName")} />
        <Input label="No HP / WhatsApp" placeholder="08xxxxxxxxxx" error={errors.phone?.message} required {...register("phone")} />
        <Input label="Link Akun" placeholder="https://www.tiktok.com/@username" error={errors.accountLink?.message} required {...register("accountLink")} />
        <Input label="Domisili / Kota" placeholder="Contoh: Jakarta Selatan" error={errors.domicile?.message} required {...register("domicile")} />
        <Select label="GMV Live/Konten rata-rata per bulan" placeholder="-- Pilih range GMV --" options={GMV_OPTIONS} error={errors.gmvRange?.message} required {...register("gmvRange")} />
        <Select label="Jumlah Followers" placeholder="-- Pilih range followers --" options={FOLLOWER_OPTIONS} error={errors.followersRange?.message} required {...register("followersRange")} />
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Daftar Sekarang"}
        </Button>
      </form>
    </div>
  );
}
