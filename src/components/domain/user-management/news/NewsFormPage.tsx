"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styled from "styled-components";
import { ChevronRight } from "lucide-react";
import { DataState } from "@/components/shared/DataState";
import { SaveFloppyDiskIcon } from "@/components/shared/SaveFloppyDiskIcon";
import { useCreateNews, useNewsDetail, useUpdateNews } from "@/hooks/use-news-management";
import { media } from "@/lib/breakpoints";
import type { NewsDetail } from "@/types/domain";
import { Field, FieldError, FieldLabel, UserFormField } from "../users/UserFormField";
import { NewsCoverUpload } from "./NewsCoverUpload";
import { NewsRichTextEditor } from "./NewsRichTextEditor";

const LIST_HREF = "/user-management/news";

const schema = z.object({
  title: z.string().trim().min(1, "Judul berita wajib diisi"),
  // Editor melaporkan "" bila kosong (bukan "<p></p>").
  content: z.string().min(1, "Isi berita wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

/** Form Tambah/Edit Berita — struktur mengikuti `companies/CompanyFormPage.tsx`.
 *  Field: Cover + Judul + Isi (HTML dari
 *  editor Tiptap). Ubah = `POST /news` + `id` (lihat `news-client.ts`). */
export function NewsFormPage({
  mode,
  newsId,
}: {
  mode: "create" | "edit";
  newsId?: string;
}) {
  const news = useNewsDetail(mode === "edit" ? (newsId ?? null) : null);
  const item = news.data;
  const title = mode === "create" ? "Tambah Berita" : "Edit Berita";

  // Form dirender SETELAH data termuat (mode edit) — `defaultValues`
  // react-hook-form cuma dibaca sekali.
  const isLoading = mode === "edit" && news.isLoading;
  const isError = mode === "edit" && news.isError;

  return (
    <Page>
      <Crumbs aria-label="Breadcrumb">
        <CrumbLink href={LIST_HREF}>Manajemen</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbLink href={LIST_HREF}>Berita</CrumbLink>
        <ChevronRight size={16} strokeWidth={1.5} color="#8B9C90" />
        <CrumbCurrent>{title}</CrumbCurrent>
      </Crumbs>
      <Title>{title}</Title>
      <Card>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={mode === "edit" ? news.error : null}
          isEmpty={mode === "edit" && !isLoading && !item}
          emptyMessage="Berita tidak ditemukan."
        >
          <NewsForm mode={mode} item={item} />
        </DataState>
      </Card>
    </Page>
  );
}

function NewsForm({ mode, item }: { mode: "create" | "edit"; item?: NewsDetail }) {
  const router = useRouter();
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const isSubmitting = createNews.isPending || updateNews.isPending;
  const [cover, setCover] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: item?.title ?? "", content: item?.content ?? "" },
  });

  function goToList() {
    router.push(LIST_HREF);
  }

  function onSubmit(values: FormValues) {
    if (mode === "create") {
      createNews.mutate({ ...values, cover }, { onSuccess: goToList });
      return;
    }
    if (!item) return;
    updateNews.mutate({ id: item.id, ...values, cover }, { onSuccess: goToList });
  }

  return (
    <Panel onSubmit={handleSubmit(onSubmit)} noValidate>
      <Fields>
        <NewsCoverUpload initialUrl={item?.coverImage} onChange={setCover} />

        <UserFormField
          id="title"
          label="Judul Berita"
          placeholder="e.g. Prediksi Iklim Indonesia 2026"
          error={errors.title?.message}
          {...register("title")}
        />

        <Field>
          <FieldLabel>Isi Berita</FieldLabel>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <NewsRichTextEditor
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.content}
              />
            )}
          />
          {errors.content && <FieldError>{errors.content.message}</FieldError>}
        </Field>
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
