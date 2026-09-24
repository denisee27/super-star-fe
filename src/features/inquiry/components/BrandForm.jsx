import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Input from "../../../shared/components/Input.jsx";
import Button from "../../../shared/components/Button.jsx";
import Spinner from "../../../shared/components/Spinner.jsx";
import { submitBrandInquiry } from "../services/inquiryService.js";
import { useInquiryForm } from "../hooks/useInquiryForm.jsx";

const BRAND_SCHEMA = z.object({
  email: z.string().email("Format email tidak valid"),
  brandName: z.string().min(2, "Nama brand minimal 2 karakter"),
  storeLink: z.string().url("Link toko harus berupa URL valid"),
  productCategory: z.string().min(2, "Kategori produk wajib diisi"),
  picName: z.string().min(2, "Nama PIC wajib diisi"),
  picRole: z.string().min(2, "Role PIC wajib diisi"),
  picContact: z.string().min(8, "Kontak PIC tidak valid"),
});

export default function BrandForm({ onSuccess, onBack }) {
  const { form, isSubmitting, onSubmit, confirmModal } = useInquiryForm(BRAND_SCHEMA, submitBrandInquiry, onSuccess);
  const { register, formState: { errors } } = form;

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
        <Input label="Kontak PIC / WhatsApp" placeholder="08xxxxxxxxxx" error={errors.picContact?.message} required {...register("picContact")} />
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? <><Spinner size={16} /> Mengirim...</> : "Kirim"}
        </Button>
      </form>
      {confirmModal}
    </div>
  );
}
