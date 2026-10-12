import { toPng } from "html-to-image";

/** Atribut penanda elemen UI (toolbar, zoom control) yang TIDAK ikut
 *  ke-render saat peta diekspor jadi gambar. */
export const MAP_EXPORT_IGNORE_ATTR = "data-export-ignore";

function shouldInclude(node: HTMLElement): boolean {
  return !(node.hasAttribute && node.hasAttribute(MAP_EXPORT_IGNORE_ATTR));
}

/** Render `element` (wrapper peta) jadi PNG lalu langsung diunduh. */
export async function downloadElementAsPng(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    filter: shouldInclude,
  });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
