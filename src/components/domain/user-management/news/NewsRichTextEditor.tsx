"use client";

import styled from "styled-components";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { NewsEditorToolbar } from "./NewsEditorToolbar";
import { newsContentStyles } from "./NewsContent";

/** Editor isi berita (Tiptap, MIT) — `value` dipakai sekali sebagai konten
 *  awal (form dirender setelah data termuat), perubahan dikirim lewat
 *  `onChange(html)`; editor kosong dilaporkan sebagai "" supaya validasi
 *  "wajib diisi" tidak tertipu `<p></p>`. Gambar disisipkan sebagai URL hasil
 *  upload, bukan base64 (lihat `NewsEditorToolbar`). */
export function NewsRichTextEditor({
  value,
  onChange,
  invalid = false,
}: {
  value: string;
  onChange: (html: string) => void;
  invalid?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: value,
    // Wajib di Next App Router: hindari hydration mismatch.
    immediatelyRender: false,
    // Toolbar (aktif/nonaktif tombol) ikut render ulang tiap transaksi.
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
  });

  return (
    <Box $invalid={invalid}>
      {editor && <NewsEditorToolbar editor={editor} />}
      <Content editor={editor} />
    </Box>
  );
}

const Box = styled.div<{ $invalid: boolean }>`
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  border: 1.5px solid ${(p) => (p.$invalid ? p.theme.colors.danger[600] : "#ecefed")};
  border-radius: 12px;

  &:focus-within {
    border-color: #175fe2;
  }
`;

const Content = styled(EditorContent)`
  .tiptap {
    ${newsContentStyles}
    min-height: 240px;
    padding: 12px;
    outline: none;
  }
`;
