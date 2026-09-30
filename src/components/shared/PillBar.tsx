/** Lebar batang: minimum 36px (Figma, dipakai saat banyak hari), membesar
 *  mengikuti lebar slot saat hari sedikit, maksimum 96px. */
const BAR_WIDTH = 36;
const MAX_BAR_WIDTH = 96;
const BAR_WIDTH_RATIO = 0.6;
const MIN_SLOT_FILL = 0.7;
const BAR_FRAME = 2;

interface PillBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/** Batang pil sesuai Figma untuk `<Bar shape={<PillBar />} />` Recharts:
 *  bingkai luar `#F6F8F7` (radius atas 24) + isi `#0039FF` (radius atas 24,
 *  bawah 4), lebar tetap 36px di tengah slot. Dipakai Monitoring > Lama
 *  Penyinaran dan Ramalan Cuaca. */
export function PillBar({ x = 0, y = 0, width = 0, height = 0 }: PillBarProps) {
  if (height <= 0) return null;
  // Slot lebar: 36–96px seperti Figma; slot sempit (rentang panjang) menyusut
  // proporsional supaya batang tidak saling menempel.
  const barWidth = Math.min(
    MAX_BAR_WIDTH,
    Math.max(Math.min(BAR_WIDTH, width * MIN_SLOT_FILL), width * BAR_WIDTH_RATIO),
  );
  const left = x + (width - barWidth) / 2;
  const radius = Math.min(barWidth / 2, height);
  return (
    <g>
      <path
        d={roundedTopPath(
          left - BAR_FRAME,
          y - BAR_FRAME,
          barWidth + BAR_FRAME * 2,
          height + BAR_FRAME,
          radius + BAR_FRAME,
          6,
        )}
        fill="#F6F8F7"
      />
      <path d={roundedTopPath(left, y, barWidth, height, radius, 4)} fill="#0039FF" />
    </g>
  );
}

/** Path persegi panjang dengan radius sudut atas `top` dan bawah `bottom`. */
function roundedTopPath(
  x: number,
  y: number,
  w: number,
  h: number,
  top: number,
  bottom: number,
): string {
  const t = Math.min(top, w / 2, h);
  const b = Math.min(bottom, w / 2, Math.max(h - t, 0));
  return [
    `M ${x} ${y + t}`,
    `Q ${x} ${y} ${x + t} ${y}`,
    `L ${x + w - t} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + t}`,
    `L ${x + w} ${y + h - b}`,
    `Q ${x + w} ${y + h} ${x + w - b} ${y + h}`,
    `L ${x + b} ${y + h}`,
    `Q ${x} ${y + h} ${x} ${y + h - b}`,
    "Z",
  ].join(" ");
}
