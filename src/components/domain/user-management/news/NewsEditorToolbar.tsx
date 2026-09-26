"use client";

import { useRef, type ChangeEvent, type ReactNode } from "react";
import styled from "styled-components";
import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  CodeXml,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/error-messages";
import { AVATAR_ACCEPT } from "@/lib/user-avatar";
import { validateNewsCoverFile } from "@/lib/news-cover";
import { uploadNewsImage } from "@/hooks/use-news-management";

type BlockValue = "paragraph" | "h1" | "h2" | "h3";
type AlignValue = "left" | "center" | "right" | "justify";

const ALIGN_ICONS: Record<AlignValue, ReactNode> = {
  left: <AlignLeft size={18} />,
  center: <AlignCenter size={18} />,
  right: <AlignRight size={18} />,
  justify: <AlignJustify size={18} />,
};

function currentBlock(editor: Editor): BlockValue {
  if (editor.isActive("heading", { level: 1 })) return "h1";
  if (editor.isActive("heading", { level: 2 })) return "h2";
  if (editor.isActive("heading", { level: 3 })) return "h3";
  return "paragraph";
}

function currentAlign(editor: Editor): AlignValue {
  for (const value of ["center", "right", "justify"] as const) {
    if (editor.isActive({ textAlign: value })) return value;
  }
  return "left";
}

/** Toolbar editor berita (Figma): undo/redo, jenis blok, perataan, warna,
 *  B/I/U/S, inline code, hapus format, list, link, gambar, code block, quote,
 *  garis. Scroll horizontal kalau sempit (mobile). Gambar diunggah ke BE
 *  (`upload_adapter`) dan disisipkan sebagai URL — bukan base64. */
export function NewsEditorToolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleBlockChange(value: BlockValue) {
    const chain = editor.chain().focus();
    if (value === "paragraph") chain.setParagraph().run();
    else chain.setHeading({ level: Number(value[1]) as 1 | 2 | 3 }).run();
  }

  function handleAlignCycle() {
    const order: AlignValue[] = ["left", "center", "right", "justify"];
    const next = order[(order.indexOf(currentAlign(editor)) + 1) % order.length];
    editor.chain().focus().setTextAlign(next).run();
  }

  function handleLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(
      "Masukkan URL tautan (kosongkan untuk menghapus)",
      previous ?? "",
    );
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  async function handleImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const message = validateNewsCoverFile(file);
    if (message) {
      toast.error(message);
      return;
    }
    try {
      const url = await uploadNewsImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  const align = currentAlign(editor);

  return (
    <Bar role="toolbar" aria-label="Format teks">
      <IconButton
        label="Urungkan"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={18} />
      </IconButton>
      <IconButton
        label="Ulangi"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={18} />
      </IconButton>
      <Divider />

      <BlockSelect
        aria-label="Jenis teks"
        value={currentBlock(editor)}
        onChange={(e) => handleBlockChange(e.target.value as BlockValue)}
      >
        <option value="paragraph">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </BlockSelect>
      <IconButton label="Ubah perataan teks" onClick={handleAlignCycle}>
        {ALIGN_ICONS[align]}
      </IconButton>
      <ColorInput
        type="color"
        aria-label="Warna teks"
        value={
          (editor.getAttributes("textStyle").color as string | undefined) ?? "#1d2520"
        }
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />
      <Divider />

      <IconButton
        label="Tebal"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={18} />
      </IconButton>
      <IconButton
        label="Miring"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={18} />
      </IconButton>
      <IconButton
        label="Garis bawah"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={18} />
      </IconButton>
      <IconButton
        label="Coret"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={18} />
      </IconButton>
      <IconButton
        label="Kode sebaris"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={18} />
      </IconButton>
      <IconButton
        label="Hapus format"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting size={18} />
      </IconButton>
      <Divider />

      <IconButton
        label="Daftar poin"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={18} />
      </IconButton>
      <IconButton
        label="Daftar bernomor"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={18} />
      </IconButton>
      <IconButton label="Tautan" active={editor.isActive("link")} onClick={handleLink}>
        <Link2 size={18} />
      </IconButton>
      <IconButton label="Sisipkan gambar" onClick={() => fileInputRef.current?.click()}>
        <ImagePlus size={18} />
      </IconButton>
      <IconButton
        label="Blok kode"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeXml size={18} />
      </IconButton>
      <IconButton
        label="Kutipan"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={18} />
      </IconButton>
      <IconButton
        label="Garis pemisah"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={18} />
      </IconButton>

      <input
        ref={fileInputRef}
        type="file"
        accept={AVATAR_ACCEPT}
        hidden
        onChange={handleImageFile}
      />
    </Bar>
  );
}

function IconButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Btn
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      $active={active}
      // mouseDown+preventDefault supaya seleksi di editor tidak hilang saat klik.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </Btn>
  );
}

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  overflow-x: auto;
  border-bottom: 1px solid #ecefed;
`;

const Btn = styled.button<{ $active: boolean }>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: ${(p) => (p.$active ? "#eff5ff" : "transparent")};
  color: ${(p) => (p.$active ? "#175fe2" : "#1d2520")};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f6f8f7;
  }

  &:disabled {
    color: #b7c2bb;
    cursor: default;
  }
`;

const Divider = styled.span`
  flex: none;
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: #ecefed;
`;

const BlockSelect = styled.select`
  flex: none;
  height: 28px;
  padding: 0 4px;
  border: none;
  background: transparent;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  color: #1d2520;
  cursor: pointer;
`;

const ColorInput = styled.input`
  flex: none;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`;
