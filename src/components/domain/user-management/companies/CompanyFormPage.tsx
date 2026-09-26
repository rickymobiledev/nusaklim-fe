"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { DataState } from "@/components/shared/DataState";
import { SaveFloppyDiskIcon } from "@/components/shared/SaveFloppyDiskIcon";
import { useCompanies, useCreateCompany, useUpdateCompany } from "@/hooks/use-companies";
import { media } from "@/lib/breakpoints";
import type { Company } from "@/types/user-management";
import { UserAvatarUpload } from "../users/UserAvatarUpload";
import { UserFormField } from "../users/UserFormField";

const LIST_HREF = "/user-management/companies";

const schema = z.object({
  name: z.string().trim().min(1, "Nama perusahaan wajib diisi"),
  code: z.string().trim().min(1, "Kode perusahaan wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

/** Form Tambah/Edit Perusahaan — sesuai Figma (struktur mengikuti
 *  `aghris-users/AghrisUserFormPage.tsx`). Logo HANYA validasi + preview
 *  lokal (kontrak upload BE belum ada, TODO sama seperti foto pengguna). */
export function CompanyFormPage({
  mode,
  companyId,
}: {
  mode: "create" | "edit";
  companyId?: string;
}) {
  const companies = useCompanies();
  const company = useMemo(
    () =>
      mode === "edit"
        ? companies.data?.data.find((c) => String(c.id) === companyId)
        : undefined,
    [mode, companies.data, companyId],
  );
  const title = mode === "create" ? "Tambah Perusahaan" : "Edit Perusahaan";

  // Form dirender SETELAH data termuat (mode edit) — `defaultValues`
  // react-hook-form cuma dibaca sekali.
  const isLoading = mode === "edit" && companies.isLoading;
  const isError = mode === "edit" && companies.isError;

  return (
    <Page>
      <Crumbs aria-label="Breadcrumb">
        <CrumbLink href={LIST_HREF}>Manajemen</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbLink href={LIST_HREF}>Perusahaan</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbCurrent>{title}</CrumbCurrent>
      </Crumbs>
      <Title>{title}</Title>
      <Card>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={mode === "edit" ? companies.error : null}
          isEmpty={mode === "edit" && !isLoading && !company}
          emptyMessage="Perusahaan tidak ditemukan."
        >
          <CompanyForm mode={mode} company={company} />
        </DataState>
      </Card>
    </Page>
  );
}

function CompanyForm({ mode, company }: { mode: "create" | "edit"; company?: Company }) {
  const router = useRouter();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const isSubmitting = createCompany.isPending || updateCompany.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: company?.name ?? "", code: company?.code ?? "" },
  });

  function goToList() {
    router.push(LIST_HREF);
  }

  function onSubmit(values: FormValues) {
    if (mode === "create") {
      createCompany.mutate(values, { onSuccess: goToList });
      return;
    }
    if (!company) return;
    updateCompany.mutate({ id: company.id, ...values }, { onSuccess: goToList });
  }

  return (
    <Panel onSubmit={handleSubmit(onSubmit)} noValidate>
      <Fields>
        <UserAvatarUpload
          initialUrl={company?.imageUrl}
          alt="Logo perusahaan"
          uploadLabel="Unggah Logo"
        />

        <UserFormField
          id="name"
          label="Nama Perusahaan"
          placeholder="e.g. PTPN 1"
          error={errors.name?.message}
          {...register("name")}
        />

        <UserFormField
          id="code"
          label="Kode Perusahaan"
          placeholder="e.g. N001"
          error={errors.code?.message}
          {...register("code")}
        />
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
  flex-wrap: wrap;
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
    width: 662px;
    align-self: flex-start;
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
