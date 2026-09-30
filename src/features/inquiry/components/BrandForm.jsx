import { useState } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import PhoneInput from "../../../shared/components/PhoneInput.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import Captcha from "../../../shared/components/Captcha.jsx";
import { submitBrandInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.jsx";

const BRAND_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  brandName: z.string().min(2, "Nama brand minimal 2 karakter"),
  storeLink: z.string().url("Link toko harus berupa URL valid"),
  productCategory: z.string().min(2, "Kategori produk wajib diisi"),
  picName: z.string().min(2, "Nama PIC wajib diisi"),
  picRole: z.string().min(2, "Role PIC wajib diisi"),
  picContact: z.string().regex(/^\+628[0-9]{8,11}$/, "Nomor HP tidak valid"),
});

export default function BrandForm({ onSuccess, onBack }) {
  const [captchaOk, setCaptchaOk] = useState(false);
  const { form, isSubmitting, onSubmit, confirmModal } = useInquiryForm(BRAND_SCHEMA, submitBrandInquiry, onSuccess, { otpField: "picContact" });
  const { register, control, formState: { errors } } = form;

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-graphite hover:text-superstar-blue transition-colors mb-4 font-sans">
        <ArrowLeft size={16} /> Kembali
      </button>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Email PIC" type="email" placeholder="email@brand.com" error={errors.email?.message} required {...register("email")} />
        <Input label="Nama Brand" placeholder="Nama brand kamu" error={errors.brandName?.message} required {...register("brandName")} />
        <Input label="Link Toko" placeholder="https://tokopedia.com/nama-toko" error={errors.storeLink?.message} required {...register("storeLink")} />
        <Input label="Kategori Produk" placeholder="Contoh: BHPC, Home Living, Mom & Baby, Lifestyle" error={errors.productCategory?.message} required {...register("productCategory")} />
        <Input label="Nama PIC" placeholder="Nama penanggung jawab" error={errors.picName?.message} required {...register("picName")} />
        <Input label="Role PIC" placeholder="Contoh: Owner, Marketing Manager" error={errors.picRole?.message} required {...register("picRole")} />
        <Controller
          control={control}
          name="picContact"
          render={({ field }) => (
            <PhoneInput label="Kontak PIC / WhatsApp" required error={errors.picContact?.message} {...field} />
          )}
        />
        <Captcha onVerify={setCaptchaOk} />
        <Button type="submit" disabled={isSubmitting || !captchaOk} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Kirim"}
        </Button>
      </form>
      {confirmModal}
    </div>
  );
}
