"use client";

import DOMPurify from "dompurify";
import styled, { css } from "styled-components";

/** Tipografi isi berita (HTML dari editor) — dipakai editor DAN tampilan
 *  baca (`NewsHtml`) supaya hasilnya sama persis (Figma: heading Manrope bold,
 *  paragraf 14px, link biru, code mono abu, blockquote garis kiri). */
export const newsContentStyles = css`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #1d2520;
  overflow-wrap: anywhere;

  > * + * {
    margin-top: 12px;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    font-family: var(--font-heading), sans-serif;
    font-weight: 700;
    color: #000000;
  }

  h1 {
    font-size: 24px;
    line-height: 32px;
  }

  h2 {
    font-size: 20px;
    line-height: 28px;
  }

  h3 {
    font-size: 16px;
    line-height: 24px;
  }

  p {
    margin: 0;
  }

  a {
    color: #175fe2;
    text-decoration: none;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 24px;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  code {
    padding: 2px 4px;
    border-radius: 4px;
    background: #f6f8f7;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }

  pre {
    margin: 0;
    padding: 12px;
    overflow-x: auto;
    border-radius: 8px;
    background: #f6f8f7;

    code {
      padding: 0;
      background: transparent;
    }
  }

  blockquote {
    margin: 0;
    padding-left: 12px;
    border-left: 2px solid #d6dcd8;
    color: #1d2520;
  }

  hr {
    border: none;
    border-top: 1px solid #d6dcd8;
  }
`;

/** Render HTML berita yang SUDAH disanitasi (DOMPurify) — konten disimpan
 *  mentah di BE, jangan pernah `dangerouslySetInnerHTML` tanpa ini. */
export function NewsHtml({ html, className }: { html: string; className?: string }) {
  // DOMPurify butuh DOM — komponen ini cuma dirender setelah data dimuat di client.
  const clean = typeof window === "undefined" ? "" : DOMPurify.sanitize(html);
  return <Body className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

const Body = styled.div`
  ${newsContentStyles}
`;
