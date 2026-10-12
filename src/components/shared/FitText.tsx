"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styled from "styled-components";

interface FitTextProps {
  children: ReactNode;
  /** Ukuran font awal (px); dipakai selama teks masih muat. */
  maxPx: number;
  /** Batas terkecil (px); di bawah ini teks dipotong ellipsis. */
  minPx: number;
}

/** Teks satu baris yang font-size-nya turun dari `maxPx` sampai muat selebar
 *  elemennya (lebar ikut parent, bukan teks). Ukuran diatur lewat style DOM
 *  di layout effect — bukan state — supaya tanpa re-render & tanpa kedip;
 *  ResizeObserver mengukur ulang saat lebar berubah. Anak yang memakai unit
 *  `em` (mis. satuan "mm") ikut mengecil proporsional. */
export function FitText({ children, maxPx, minPx }: FitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fit = () => {
      element.style.fontSize = `${maxPx}px`;
      const { scrollWidth, clientWidth } = element;
      if (scrollWidth <= clientWidth) return;
      const fitted = Math.floor((maxPx * clientWidth) / scrollWidth);
      element.style.fontSize = `${Math.max(minPx, fitted)}px`;
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
    // `children` di dependency: isi berganti tanpa perubahan ukuran elemen.
  }, [maxPx, minPx, children]);

  return <Fit ref={ref}>{children}</Fit>;
}

/* `display:block` wajib agar `overflow` berlaku; `ellipsis` = pengaman di
 * ukuran minimum. */
const Fit = styled.span`
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
