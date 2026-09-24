"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import styled from "styled-components";
import { ImageIcon, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AVATAR_ACCEPT, validateAvatarFile } from "@/lib/user-avatar";

/** Avatar bulat + tombol "Unggah Foto". TODO: file BELUM dikirim ke BE —
 *  `POST/PUT /users` belum punya field foto; sambungkan setelah kontrak BE
 *  jelas. Untuk sekarang cuma validasi + preview lokal. */
export function UserAvatarUpload({ initialUrl }: { initialUrl?: string | null }) {
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
    const message = validateAvatarFile(file);
    if (message) {
      toast.error(message);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  const shownUrl = previewUrl ?? initialUrl ?? null;

  return (
    <Row>
      <Circle>
        {shownUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- preview blob lokal / URL host tak terdaftar di next/image
          <img src={shownUrl} alt="Foto pengguna" />
        ) : (
          <ImageIcon size={40} strokeWidth={2} color="#8DB5FF" />
        )}
      </Circle>
      <Side>
        <UploadButton type="button" onClick={() => inputRef.current?.click()}>
          <UploadCloud size={24} strokeWidth={1.5} />
          Unggah Foto
        </UploadButton>
        <Hint>Format file: JPEG, JPG, atau PNG file maksimal 2MB</Hint>
      </Side>
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        hidden
        onChange={handleChange}
      />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Circle = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eff5ff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
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
