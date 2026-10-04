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
import { useState } from "react";
import { GMV_RANGE, FOLLOWERS_RANGE } from "../types/inquiry.types.js";
import { submitEventInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.jsx";

const GMV_OPTIONS = Object.values(GMV_RANGE).map((v) => ({ value: v, label: v }));
const FOLLOWER_OPTIONS = Object.values(FOLLOWERS_RANGE).map((v) => ({ value: v, label: v }));

const ACCOUNT_LINK_PLACEHOLDER = {
  TIKTOK_SHOP: "https://www.tiktok.com/@username",
  SHOPEE: "https://shopee.co.id/username",
  TOKOPEDIA: "https://www.tokopedia.com/username",
  INSTAGRAM: "https://www.instagram.com/username",
};

const EVENT_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().regex(/^\+628[0-9]{8,11}$/, "Nomor HP tidak valid"),
  accountLink: z.string().min(1, "Link akun wajib diisi"),
  province: z.string().min(1, "Pilih provinsi"),
  regency: z.string().min(1, "Pilih kabupaten/kota"),
  gmvRange: z.string().min(1, "Pilih range GMV"),
  followersRange: z.string().min(1, "Pilih range followers"),
});

export default function EventForm({ event, onSuccess, onBack }) {
  const [captchaOk, setCaptchaOk] = useState(false);
  const { form, isSubmitting, onSubmit, confirmModal } = useInquiryForm(
    EVENT_SCHEMA,
    (data) => submitEventInquiry({ ...data, eventId: event.id }),
    onSuccess,
    { otpField: "phone" }
  );
  const { register, control, formState: { errors } } = form;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-4 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <div className="inline-block bg-superstar-blue/10 text-superstar-blue font-sans text-xs font-semibold px-2 py-1 rounded mb-5">
        {event?.name}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="email@kamu.com" error={errors.email?.message} required {...register("email")} />
        <Input label="Nama Lengkap" placeholder="Nama lengkap kamu" error={errors.fullName?.message} required {...register("fullName")} />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <PhoneInput label="No HP / WhatsApp" required error={errors.phone?.message} {...field} />
          )}
        />
        <Input label="Link Akun" placeholder={ACCOUNT_LINK_PLACEHOLDER[event?.platform] ?? "https://"} error={errors.accountLink?.message} required {...register("accountLink")} />
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
        <Select label="GMV Live/Konten rata-rata per bulan" placeholder="-- Pilih range GMV --" options={GMV_OPTIONS} error={errors.gmvRange?.message} required {...register("gmvRange")} />
        <Select label="Jumlah Followers" placeholder="-- Pilih range followers --" options={FOLLOWER_OPTIONS} error={errors.followersRange?.message} required {...register("followersRange")} />
        <Captcha onVerify={setCaptchaOk} />
        <Button type="submit" disabled={isSubmitting || !captchaOk} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Daftar Sekarang"}
        </Button>
      </form>
      {confirmModal}
    </div>
  );
}
