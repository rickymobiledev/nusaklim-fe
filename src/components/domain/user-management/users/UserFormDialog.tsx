"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Company,
  CreateUserInput,
  ManagedUser,
  UpdateUserInput,
  UserRoleOption,
} from "@/types/user-management";

/** `PUT /users` asli TIDAK menerima `email`/`password` (lihat catatan di
 *  `types/user-management.ts`) — form Edit sengaja TIDAK menampilkan
 *  kedua field itu, BUKAN oversight. Satu schema dinamis per `mode`
 *  (bukan 2 komponen terpisah) supaya field Nama/Username/Peran/
 *  Perusahaan yang sama tidak diduplikasi. */
function buildSchema(mode: "create" | "edit") {
  return z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    email:
      mode === "create"
        ? z.string().min(1, "Email wajib diisi").email("Format email tidak valid")
        : z.string().optional(),
    password:
      mode === "create"
        ? z.string().min(6, "Password minimal 6 karakter")
        : z.string().optional(),
    userRoleId: z.string().min(1, "Peran wajib dipilih"),
    companyId: z.string().min(1, "Perusahaan wajib dipilih"),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function toDefaultValues(mode: "create" | "edit", user?: ManagedUser | null): FormValues {
  if (mode === "edit" && user) {
    return {
      name: user.name,
      username: user.username,
      email: "",
      password: "",
      userRoleId: user.role.id,
      companyId: String(user.company.id),
    };
  }
  return {
    name: "",
    username: "",
    email: "",
    password: "",
    userRoleId: "",
    companyId: "",
  };
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
  companies,
  roles,
  onSubmitCreate,
  onSubmitEdit,
  isSubmitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: ManagedUser | null;
  companies: Company[];
  roles: UserRoleOption[];
  onSubmitCreate: (values: CreateUserInput) => void;
  onSubmitEdit: (values: UpdateUserInput) => void;
  isSubmitting: boolean;
}) {
  const schema = useMemo(() => buildSchema(mode), [mode]);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaultValues(mode, user),
  });

  useEffect(() => {
    if (open) reset(toDefaultValues(mode, user));
  }, [open, mode, user, reset]);

  function onSubmit(values: FormValues) {
    if (mode === "create") {
      onSubmitCreate({
        name: values.name,
        username: values.username,
        email: values.email ?? "",
        password: values.password ?? "",
        userRoleId: values.userRoleId,
        companyId: values.companyId,
      });
      return;
    }
    if (!user) return;
    onSubmitEdit({
      id: user.id,
      name: values.name,
      username: values.username,
      userRoleId: values.userRoleId,
      companyId: values.companyId,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
          </DialogTitle>
        </DialogHeader>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" placeholder="Masukkan nama" {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Masukkan username"
              {...register("username")}
            />
            {errors.username && <FieldError>{errors.username.message}</FieldError>}
          </Field>

          {mode === "create" && (
            <>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  {...register("email")}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  {...register("password")}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
            </>
          )}

          <Field>
            <Label>Peran</Label>
            <Controller
              control={control}
              name="userRoleId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
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
            <Label>Perusahaan</Label>
            <Controller
              control={control}
              name="companyId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih perusahaan" />
                  </SelectTrigger>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldError = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: ${(p) => p.theme.colors.danger[600]};
`;
