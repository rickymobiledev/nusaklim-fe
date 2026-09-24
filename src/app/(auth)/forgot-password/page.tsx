"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import {
  AuthHeading,
  AuthLink,
  AuthSubmitButton,
  AuthSubtext,
} from "@/components/domain/auth/AuthCopy";
import { AuthFormField } from "@/components/domain/auth/AuthFormField";
import { useForgotPassword } from "@/hooks/use-forgot-password";
import { getErrorMessage } from "@/lib/api/error-messages";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mutateAsync, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordForm) {
    setFormError(null);
    try {
      const res = await mutateAsync(values.email);
      setSuccessMessage(
        res.data.message || "Tautan reset kata sandi telah dikirim ke email Anda.",
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <AuthHeading>Lupa Kata Sandi</AuthHeading>
        <AuthSubtext>
          Masukkan email akun Anda, kami akan mengirimkan instruksi untuk mengatur ulang
          kata sandi
        </AuthSubtext>
      </div>

      {successMessage ? (
        <div className="flex flex-col gap-6">
          <p role="status" className="text-sm text-green-700">
            {successMessage}
          </p>
          <AuthLink as={Link} href="/login">
            Kembali ke Login
          </AuthLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
          <AuthFormField
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="Masukkan Email"
            error={errors.email?.message}
            {...register("email")}
          />

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <div className="flex flex-col items-center gap-6">
            <AuthSubmitButton type="submit" disabled={isPending}>
              {isPending ? "Memproses..." : "Kirim"}
            </AuthSubmitButton>
            <AuthLink as={Link} href="/login">
              Kembali ke Login
            </AuthLink>
          </div>
        </form>
      )}
    </div>
  );
}
