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
import { useCompanies } from "@/hooks/use-companies";
import {
  useAdminStations,
  useCreateStation,
  useUpdateStation,
} from "@/hooks/use-station-management";
import { STATION_BRANDS } from "@/constants";
import { media } from "@/lib/breakpoints";
import type { Station } from "@/types/domain";
import { UserAvatarUpload } from "../users/UserAvatarUpload";
import { Field, FieldError, FieldLabel, UserFormField } from "../users/UserFormField";

const LIST_HREF = "/user-management/stations";

function coordinate(label: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} wajib diisi`)
    .refine((v) => Number.isFinite(Number(v)), `${label} harus berupa angka`)
    .refine(
      (v) => Number(v) >= min && Number(v) <= max,
      `${label} harus antara ${min} dan ${max}`,
    );
}

const schema = z.object({
  name: z.string().trim().min(1, "Nama stasiun wajib diisi"),
  id: z
    .string()
    .trim()
    .min(1, "ID stasiun wajib diisi")
    .refine((v) => !v.includes("/"), "ID stasiun tidak boleh mengandung '/'"),
  companyCode: z.string().min(1, "Perusahaan wajib dipilih"),
  brand: z.string().min(1, "Merek wajib dipilih"),
  latitude: coordinate("Latitude", -90, 90),
  longitude: coordinate("Longitude", -180, 180),
});

type FormValues = z.infer<typeof schema>;

/** Form Tambah/Edit Stasiun (struktur mengikuti `companies/CompanyFormPage.tsx`).
 *  Foto HANYA validasi + preview lokal — kontrak upload BE belum ada. */
export function StationFormPage({
  mode,
  stationId,
}: {
  mode: "create" | "edit";
  stationId?: string;
}) {
  const stations = useAdminStations();
  const station = useMemo(
    () =>
      mode === "edit" ? stations.data?.data.find((s) => s.id === stationId) : undefined,
    [mode, stations.data, stationId],
  );
  const title = mode === "create" ? "Tambah Stasiun" : "Edit Stasiun";

  // Form dirender SETELAH data termuat (mode edit) — `defaultValues`
  // react-hook-form cuma dibaca sekali.
  const isLoading = mode === "edit" && stations.isLoading;
  const isError = mode === "edit" && stations.isError;

  return (
    <Page>
      <Crumbs aria-label="Breadcrumb">
        <CrumbLink href={LIST_HREF}>Manajemen</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbLink href={LIST_HREF}>Stasiun</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbCurrent>{title}</CrumbCurrent>
      </Crumbs>
      <Title>{title}</Title>
      <Card>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={mode === "edit" ? stations.error : null}
          isEmpty={mode === "edit" && !isLoading && !station}
          emptyMessage="Stasiun tidak ditemukan."
        >
          <StationForm mode={mode} station={station} />
        </DataState>
      </Card>
    </Page>
  );
}

function StationForm({ mode, station }: { mode: "create" | "edit"; station?: Station }) {
  const router = useRouter();
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const companiesQuery = useCompanies();
  const companies = useMemo(() => companiesQuery.data?.data ?? [], [companiesQuery.data]);
  const isSubmitting = createStation.isPending || updateStation.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: station?.nama ?? "",
      id: station?.id ?? "",
      companyCode: station?.companyCode ?? "",
      brand: station?.brand ?? "",
      latitude: station ? String(station.lat) : "",
      longitude: station ? String(station.long) : "",
    },
  });

  function goToList() {
    router.push(LIST_HREF);
  }

  function onSubmit(values: FormValues) {
    const input = {
      id: values.id,
      name: values.name,
      companyCode: values.companyCode,
      brand: values.brand,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    };
    if (mode === "create") {
      createStation.mutate(input, { onSuccess: goToList });
      return;
    }
    if (!station) return;
    updateStation.mutate({ ...input, id: station.id }, { onSuccess: goToList });
  }

  return (
    <Panel onSubmit={handleSubmit(onSubmit)} noValidate>
      <Fields>
        <UserAvatarUpload alt="Foto stasiun" uploadLabel="Unggah Foto" />

        <UserFormField
          id="name"
          label="Nama Stasiun"
          placeholder="e.g. PPKS Bukit Sentang"
          error={errors.name?.message}
          {...register("name")}
        />

        <UserFormField
          id="id"
          label="ID Stasiun"
          placeholder="e.g. 007"
          readOnly={mode === "edit"}
          aria-readonly={mode === "edit"}
          error={errors.id?.message}
          {...register("id")}
        />

        <Field>
          <FieldLabel>Perusahaan</FieldLabel>
          <Controller
            control={control}
            name="companyCode"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger $invalid={!!errors.companyCode}>
                  <SelectValue placeholder="Pilih Perusahaan" />
                </FormSelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.code}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.companyCode && <FieldError>{errors.companyCode.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Merek</FieldLabel>
          <Controller
            control={control}
            name="brand"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <FormSelectTrigger $invalid={!!errors.brand}>
                  <SelectValue placeholder="Pilih Merek" />
                </FormSelectTrigger>
                <SelectContent>
                  {STATION_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
        </Field>

        <CoordRow>
          <UserFormField
            id="longitude"
            label="Longitude"
            placeholder="e.g. 98.3150"
            inputMode="decimal"
            error={errors.longitude?.message}
            {...register("longitude")}
          />

          <UserFormField
            id="latitude"
            label="Latitude"
            placeholder="e.g. 3.9576"
            inputMode="decimal"
            error={errors.latitude?.message}
            {...register("latitude")}
          />
        </CoordRow>
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

const CoordRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
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
