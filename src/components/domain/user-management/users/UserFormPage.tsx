"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { DataState } from "@/components/shared/DataState";
import { SaveFloppyDiskIcon } from "@/components/shared/SaveFloppyDiskIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser, useUsers } from "@/hooks/use-users";
import { useCompanies } from "@/hooks/use-companies";
import { useUserRoles } from "@/hooks/use-user-roles";
import { media } from "@/lib/breakpoints";
import type { ManagedUser } from "@/types/user-management";
import { UserAvatarUpload } from "./UserAvatarUpload";
import { Field, FieldError, FieldLabel, UserFormField } from "./UserFormField";

const LIST_HREF = "/user-management/users";

/** `PUT /users` asli TIDAK menerima `email`/`password` (lihat catatan di
 *  `types/user-management.ts`) — mode Edit sengaja menampilkan email
 *  read-only & TANPA kolom sandi. Satu schema dinamis per `mode`. */
function buildSchema(mode: "create" | "edit") {
  return z
    .object({
      name: z.string().min(1, "Nama lengkap wajib diisi"),
      username: z.string().min(1, "Nama pengguna wajib diisi"),
      email:
        mode === "create"
          ? z
              .string()
              .min(1, "Alamat email wajib diisi")
              .email("Format email tidak valid")
          : z.string().optional(),
      userRoleId: z.string().min(1, "Peran wajib dipilih"),
      companyId: z.string().min(1, "Perusahaan wajib dipilih"),
      password:
        mode === "create"
          ? z.string().min(6, "Kata sandi minimal 6 karakter")
          : z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (mode === "create" && values.password !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Konfirmasi kata sandi tidak cocok",
        });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export function UserFormPage({
  mode,
  userId,
}: {
  mode: "create" | "edit";
  userId?: string;
}) {
  const { data, isLoading, isError, error } = useUsers();
  const user = useMemo(
    () => (mode === "edit" ? data?.data.find((u) => u.id === userId) : undefined),
    [mode, data, userId],
  );
  const title = mode === "create" ? "Tambah Pengguna" : "Edit Pengguna";

  return (
    <Page>
      <Crumbs aria-label="Breadcrumb">
        <CrumbLink href={LIST_HREF}>Manajemen</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbLink href={LIST_HREF}>Pengguna</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbCurrent>{title}</CrumbCurrent>
      </Crumbs>
      <Title>{title}</Title>
      <Card>
        {mode === "create" ? (
          <UserForm mode="create" />
        ) : (
          <DataState
            isLoading={isLoading}
            isError={isError}
            error={error}
            isEmpty={!user}
            emptyMessage="Pengguna tidak ditemukan."
          >
            {user && <UserForm mode="edit" user={user} />}
          </DataState>
        )}
      </Card>
    </Page>
  );
}

function UserForm({ mode, user }: { mode: "create" | "edit"; user?: ManagedUser }) {
  const router = useRouter();
  const { data: companiesData } = useCompanies();
  const { data: rolesData } = useUserRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const companies = companiesData?.data ?? [];
  const roles = rolesData?.data ?? [];
  const isSubmitting = createUser.isPending || updateUser.isPending;

  const schema = useMemo(() => buildSchema(mode), [mode]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      userRoleId: user?.role.id ?? "",
      companyId: user ? String(user.company.id) : "",
      password: "",
      confirmPassword: "",
    },
  });

  function goToList() {
    router.push(LIST_HREF);
  }

  function onSubmit(values: FormValues) {
    if (mode === "create") {
      createUser.mutate(
        {
          name: values.name,
          username: values.username,
          email: values.email ?? "",
          password: values.password ?? "",
          userRoleId: values.userRoleId,
          companyId: values.companyId,
        },
        { onSuccess: goToList },
      );
      return;
    }
    if (!user) return;
    updateUser.mutate(
      {
        id: user.id,
        name: values.name,
        username: values.username,
        userRoleId: values.userRoleId,
        companyId: values.companyId,
      },
      { onSuccess: goToList },
    );
  }

  return (
    <Panel onSubmit={handleSubmit(onSubmit)} noValidate>
      <UserAvatarUpload initialUrl={user?.imageUrl} />

      <Fields>
        <UserFormField
          id="name"
          label="Nama Lengkap"
          placeholder="e.g. Budi Waskita"
          error={errors.name?.message}
          {...register("name")}
        />
        <UserFormField
          id="username"
          label="Nama Pengguna"
          placeholder="e.g. budi"
          error={errors.username?.message}
          {...register("username")}
        />
        <UserFormField
          id="email"
          type="email"
          label="Alamat Email"
          placeholder="e.g. budi@gmail.com"
          disabled={mode === "edit"}
          error={errors.email?.message}
          {...register("email")}
        />

        <Field>
          <FieldLabel>Peran</FieldLabel>
          <Controller
            control={control}
            name="userRoleId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger $invalid={!!errors.userRoleId}>
                  <SelectValue placeholder="Pilih Peran" />
                </FormSelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.userRoleId && <FieldError>{errors.userRoleId.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Perusahaan</FieldLabel>
          <Controller
            control={control}
            name="companyId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger $invalid={!!errors.companyId}>
                  <SelectValue placeholder="Pilih Perusahaan" />
                </FormSelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyId && <FieldError>{errors.companyId.message}</FieldError>}
        </Field>

        {mode === "create" && (
          <>
            <UserFormField
              id="password"
              password
              label="Kata Sandi"
              placeholder="Masukkan Kata Sandi"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
            <UserFormField
              id="confirmPassword"
              password
              label="Konfirmasi Kata Sandi"
              placeholder="Masukkan Kata Sandi"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </>
        )}
      </Fields>

      <Actions>
        <SaveButton type="submit" disabled={isSubmitting}>
          <SaveFloppyDiskIcon color="#FFFFFF" />
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </SaveButton>
        <CancelButton type="button" onClick={goToList} disabled={isSubmitting}>
          Batal
        </CancelButton>
      </Actions>
    </Panel>
  );
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Crumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
`;

const crumbFont = `
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`;

const CrumbLink = styled(Link)`
  ${crumbFont}
  color: #8b9c90;
  text-decoration: none;

  &:hover {
    color: #175fe2;
  }
`;

const CrumbCurrent = styled.span`
  ${crumbFont}
  color: #175fe2;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  color: #000000;
`;

const Card = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;

  ${media.desktop} {
    padding: 24px;
  }
`;

const Panel = styled.form`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 16px;
  border: 1px solid #ecefed;
  border-radius: 8px;

  ${media.desktop} {
    width: 478px;
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/** Gaya kotak sama `UserFormField` (48px, border 1.5px `#D6DCD8`, radius
 *  12) — `&&` menang atas class Tailwind bawaan `SelectTrigger`. */
const FormSelectTrigger = styled(SelectTrigger)<{ $invalid?: boolean }>`
  && {
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    padding: 12px;
    background: #ffffff;
    border: 1.5px solid ${(p) => (p.$invalid ? p.theme.colors.danger[600] : "#d6dcd8")};
    border-radius: 12px;
    font-family: var(--font-plus-jakarta-sans), sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #1d2520;
  }

  &&[data-placeholder] {
    color: #8b9c90;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const buttonBase = `
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  ${buttonBase}
  background: #175fe2;
  color: #ffffff;
`;

const CancelButton = styled.button`
  ${buttonBase}
  background: transparent;
  color: #667a6c;
`;
