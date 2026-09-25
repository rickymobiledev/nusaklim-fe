"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AVATAR_ACCEPT } from "@/lib/user-avatar";
import { validateNewsCoverFile } from "@/lib/news-cover";
import { NewsCover } from "./NewsCover";

/** Cover berita persegi panjang + tombol "Unggah Cover". Beda dari
 *  `UserAvatarUpload`: file terpilih DIEKSPOS ke form lewat `onChange`
 *  (dikirim multipart ke BE). */
export function NewsCoverUpload({
  initialUrl,
  onChange,
}: {
  initialUrl?: string | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset supaya memilih file yang sama dua kali tetap memicu onChange.
    event.target.value = "";
    if (!file) return;
    const message = validateNewsCoverFile(file);
    if (message) {
      toast.error(message);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  }

  return (
    <Wrapper>
      <Preview src={previewUrl ?? initialUrl ?? null} alt="Cover berita" />
      <UploadButton type="button" onClick={() => inputRef.current?.click()}>
        <UploadCloud size={24} strokeWidth={1.5} />
        Unggah Gambar Berita
      </UploadButton>
      <Hint>Format file: JPEG, JPG, atau PNG file maksimal 2MB</Hint>
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        hidden
        onChange={handleChange}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
`;

const Preview = styled(NewsCover)`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

const UploadButton = styled.button`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1.5px solid #8db5ff;
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #175fe2;
`;

const Hint = styled.p`
  margin: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;
