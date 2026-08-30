"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import {
  AuthHeading,
  AuthLink,
  AuthSubmitButton,
  AuthSubtext,
} from "@/components/domain/auth/AuthCopy";
import { AuthFormField, AuthIconButton } from "@/components/domain/auth/AuthFormField";

const loginSchema = z.object({
  username: z.string().min(1, "NIK SAP, Email, atau Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginForm) {
    setFormError(null);
    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (!result || result.error) {
      setFormError("NIK SAP/Email/Username atau password salah.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <AuthHeading>Selamat Datang Kembali</AuthHeading>
        <AuthSubtext>Masukkan kredensial untuk masuk ke akun kami</AuthSubtext>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <AuthFormField
            id="username"
            label="NIK SAP/Email/Username"
            icon={User}
            type="text"
            autoComplete="username"
            placeholder="Masukkan NIK SAP/Email/Username"
            error={errors.username?.message}
            {...register("username")}
          />

          <AuthFormField
            id="password"
            label="Kata Sandi"
            icon={Lock}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Masukkan Kata Sandi"
            error={errors.password?.message}
            trailing={
              <AuthIconButton
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff size={24} strokeWidth={1.5} />
                ) : (
                  <Eye size={24} strokeWidth={1.5} />
                )}
              </AuthIconButton>
            }
            {...register("password")}
          />

          <div className="flex justify-end">
            <AuthLink type="button">Lupa Password</AuthLink>
          </div>
        </div>

        {formError && <p className="text-destructive text-sm">{formError}</p>}

        <AuthSubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </AuthSubmitButton>
      </form>
    </div>
  );
}
