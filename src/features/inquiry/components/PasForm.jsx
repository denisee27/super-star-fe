import { useState } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import PhoneInput from "../../../shared/components/PhoneInput.jsx";
import Select from "../../../shared/components/Select.jsx";
import RegionSelect from "../../../shared/components/RegionSelect.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import Captcha from "../../../shared/components/Captcha.jsx";
import { GMV_RANGE } from "../types/inquiry.types.js";
import { submitPasInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.jsx";

const GMV_OPTIONS = Object.values(GMV_RANGE).map((v) => ({ value: v, label: v }));

const PAS_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(/^\+628[0-9]{8,11}$/, "Nomor HP tidak valid"),
  username: z.string().optional(),
  usernameShopee: z.string().optional(),
  gmvRange: z.string().min(1, "Pilih range GMV"),
  province: z.string().min(1, "Pilih provinsi"),
  regency: z.string().min(1, "Pilih kabupaten/kota"),
});

export default function PasForm({ onSuccess, onBack }) {
  const [captchaOk, setCaptchaOk] = useState(false);
  const { form, isSubmitting, onSubmit } = useInquiryForm(PAS_SCHEMA, submitPasInquiry, onSuccess, { skipOtp: true });
  const { register, control, formState: { errors } } = form;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-4 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="email@kamu.com" error={errors.email?.message} required {...register("email")} />
        <Input label="Nama" placeholder="Nama kamu" error={errors.fullName?.message} required {...register("fullName")} />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput label="No HP / WhatsApp" required error={errors.phone?.message} {...field} />
          )}
        />
        <Input label="Username TikTok" placeholder="@username_tiktok" error={errors.username?.message} {...register("username")} />
        <Input label="Username Shopee" placeholder="@username_shopee" error={errors.usernameShopee?.message} {...register("usernameShopee")} />
        <Select label="GMV per bulan" placeholder="-- Pilih range GMV --" options={GMV_OPTIONS} error={errors.gmvRange?.message} required {...register("gmvRange")} />
        <Controller
          control={control}
          name="province"
          render={({ field: pField }) => (
            <Controller
              control={control}
              name="regency"
              render={({ field: rField }) => (
                <RegionSelect
                  province={pField.value}
                  regency={rField.value}
                  onProvinceChange={pField.onChange}
                  onRegencyChange={rField.onChange}
                  provinceError={errors.province?.message}
                  regencyError={errors.regency?.message}
                  required
                />
              )}
            />
          )}
        />
        {errors.root && (
          <p className="font-sans text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{errors.root.message}</p>
        )}
        <Captcha onVerify={setCaptchaOk} />
        <Button type="submit" disabled={isSubmitting || !captchaOk} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Gabung Sekarang"}
        </Button>
      </form>
    </div>
  );
}
