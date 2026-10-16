/** Kontak hotline Nusaklim untuk stasiun tidak aktif. `phone` format
 *  tampilan; `waNumber` format internasional tanpa "+"/spasi/strip (syarat
 *  `wa.me`). */
export const HOTLINE_CONTACTS = [
  { name: "DICKY", phone: "+62 852-9784-6103", waNumber: "6285297846103" },
  { name: "ZULHAM", phone: "+62 813-7512-9692", waNumber: "6281375129692" },
] as const;

export function toWhatsAppUrl(waNumber: string, text?: string): string {
  const base = `https://wa.me/${waNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
