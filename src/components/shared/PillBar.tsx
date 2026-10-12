/** Lebar batang: minimum 36px (Figma, dipakai saat banyak hari), membesar
 *  mengikuti lebar slot saat hari sedikit, maksimum 96px. */
const BAR_WIDTH = 36;
const MAX_BAR_WIDTH = 96;
const BAR_WIDTH_RATIO = 0.6;
const MIN_SLOT_FILL = 0.7;
const BAR_FRAME = 2;

const DEFAULT_COLOR = "#0039FF";

interface PillBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** Warna isi batang (default biru Figma). Sengaja bukan `fill` supaya tidak
   *  bentrok dengan props batang yang di-inject Recharts. */
  color?: string;
  /** Dikirim Recharts ke shape; diteruskan ke `<g>` supaya hover per-batang
   *  (mis. tooltip per-stasiun) tetap jalan. */
  onMouseEnter?: React.MouseEventHandler<SVGGElement>;
  onMouseLeave?: React.MouseEventHandler<SVGGElement>;
}

/** Batang KOTAK (sudut siku, tanpa radius) untuk `<Bar shape={<PillBar />} />`
 *  Recharts: bingkai luar `#F6F8F7` + isi `#0039FF`, lebar mengikuti slot
 *  (lihat `BAR_WIDTH`). Dipakai Monitoring > Lama Penyinaran, Ramalan Cuaca,
 *  dan chart detail cuaca (curah hujan, radiasi, kecepatan & arah angin —
 *  `color` per-stasiun). Nama "PillBar" peninggalan bentuk pil lama —
 *  sengaja tidak di-rename (banyak pemakai). */
export function PillBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  color = DEFAULT_COLOR,
  onMouseEnter,
  onMouseLeave,
}: PillBarProps) {
  if (height <= 0) return null;
  // Slot lebar: 36–96px seperti Figma; slot sempit (rentang panjang) menyusut
  // proporsional supaya batang tidak saling menempel.
  const barWidth = Math.min(
    MAX_BAR_WIDTH,
    Math.max(Math.min(BAR_WIDTH, width * MIN_SLOT_FILL), width * BAR_WIDTH_RATIO),
  );
  const left = x + (width - barWidth) / 2;
  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <rect
        x={left - BAR_FRAME}
        y={y - BAR_FRAME}
        width={barWidth + BAR_FRAME * 2}
        height={height + BAR_FRAME}
        fill="#F6F8F7"
      />
      <rect x={left} y={y} width={barWidth} height={height} fill={color} />
    </g>
  );
}
