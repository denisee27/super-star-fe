import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useInquiryForm(schema, submitFn, onSuccess) {
  const form = useForm({ resolver: zodResolver(schema) });

  async function handleSubmit(data) {
    await submitFn(data);
    onSuccess(data);
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(handleSubmit),
  };
}
