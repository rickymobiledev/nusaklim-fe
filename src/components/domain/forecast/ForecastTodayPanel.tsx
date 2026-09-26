"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FORECAST_ICON_SRC, getForecastIconLevel } from "@/lib/forecast-icon-level";
import {
  FORECAST_BACKGROUND_SRC,
  getForecastCategory,
  getParameterUnit,
  getRange,
} from "@/lib/forecast-display";
import { degreesToCardinal } from "@/lib/cardinal-direction";
import {
  CompassIcon,
  CompressIcon,
  DropletHalfIcon,
  SunLightIcon,
  TemperatureLowIcon,
  WindIcon,
} from "@/components/shared/MetricIcons";
import { media } from "@/lib/breakpoints";
import type { ForecastDay } from "@/types/forecast";
import { ForecastMetricCard } from "./ForecastMetricCard";

function formatNumber(value: number) {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

export function ForecastTodayPanel({
  days,
  day,
  units,
}: {
  days: ForecastDay[];
  day: ForecastDay;
  units: Record<string, string>;
}) {
  const level = getForecastIconLevel(day.rainfall);
  const isFirstDay = days[0]?.date === day.date;
  const date = new Date(day.date);
  const dateLabel = format(date, "d MMMM", { locale: id });
  const unit = (key: Parameters<typeof getParameterUnit>[0]) =>
    getParameterUnit(key, units);

  const rainRange = getRange(days, (d) => d.rainfall);
  const tempRange = getRange(days, (d) => d.temperature);
  const humidityRange = getRange(days, (d) => d.humidity);
  const radiationRange = getRange(days, (d) => d.radiation);
  const pressureRange = getRange(days, (d) => d.airPressure);
  const windRange = getRange(days, (d) => d.windSpeed);

  // "%" ditulis rapat ("90%"), unit lain pakai spasi ("29 °C") — persis Figma.
  function withUnit(value: number, u: string) {
    return `${formatNumber(value)}${u === "%" ? u : ` ${u}`}`;
  }

  function rangeText(
    range: { min: number; max: number } | null,
    u: string,
    maxWord = "Maks",
  ) {
    if (!range) return "";
    return `Min ${withUnit(range.min, u)} — ${maxWord} ${withUnit(range.max, u)}`;
  }

  return (
    <Panel>
      <Hero>
        <HeroBackground
          key={FORECAST_BACKGROUND_SRC[level]}
          src={FORECAST_BACKGROUND_SRC[level]}
        />
        <HeroContent>
          <HeroTitle>
            {isFirstDay
              ? `Hari Ini, ${dateLabel}`
              : format(date, "EEEE, d MMMM", { locale: id })}
          </HeroTitle>
          <HeroMain>
            <Image src={FORECAST_ICON_SRC[level]} alt="" width={72} height={72} />
            <HeroValue>
              <HeroRain>
                {formatNumber(day.rainfall)} {unit("rainfall")}
              </HeroRain>
              <HeroCategory>{getForecastCategory(day.rainfall)}</HeroCategory>
            </HeroValue>
          </HeroMain>
          <HeroRange>{rangeText(rainRange, unit("rainfall"), "Max")}</HeroRange>
        </HeroContent>
      </Hero>

      <Metrics>
        <ForecastMetricCard
          icon={<TemperatureLowIcon />}
          label="Temperatur"
          value={withUnit(day.temperature, unit("temperature"))}
          caption={rangeText(tempRange, unit("temperature"))}
        />
        <ForecastMetricCard
          icon={<DropletHalfIcon />}
          label="Kelembapan Udara"
          value={withUnit(day.humidity, unit("humidity"))}
          caption={rangeText(humidityRange, unit("humidity"))}
        />
        <ForecastMetricCard
          icon={<SunLightIcon />}
          label="Radiasi Matahari"
          value={withUnit(day.radiation, unit("radiation"))}
          caption={rangeText(radiationRange, unit("radiation"))}
        />
        <ForecastMetricCard
          icon={<CompressIcon />}
          label="Tekanan Udara"
          value={withUnit(day.airPressure, unit("airPressure"))}
          caption={rangeText(pressureRange, unit("airPressure"))}
        />
        <ForecastMetricCard
          icon={<WindIcon />}
          label="Kecepatan Angin"
          value={withUnit(day.windSpeed, unit("windSpeed"))}
          caption={rangeText(windRange, unit("windSpeed"))}
        />
        <ForecastMetricCard
          icon={<CompassIcon />}
          label="Arah Mata Angin"
          value={`${Math.round(day.windDirectionDeg)}°`}
          caption={degreesToCardinal(day.windDirectionDeg)}
        />
      </Metrics>
    </Panel>
  );
}

/** Gambar latar yang gagal dimuat disembunyikan (fallback ke warna dasar
 *  `Hero`) — pola sama kartu Keseimbangan Air Beranda. `key` di pemakai
 *  me-reset state saat level cuaca berganti. */
function HeroBackground({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <BackgroundImage
      src={src}
      alt=""
      fill
      sizes="(min-width: 1280px) 310px, 100vw"
      onError={() => setFailed(true)}
    />
  );
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;

  ${media.desktop} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const Hero = styled.div`
  position: relative;
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  isolation: isolate;
  min-height: 184px;
  padding: 24px;
  background: #4a86dd;
  border-radius: 16px;

  ${media.desktop} {
    width: 310px;
    min-height: 244px;
  }
`;

const BackgroundImage = styled(Image)`
  z-index: 0;
  object-fit: cover;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HeroTitle = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
`;

const HeroMain = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeroValue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeroRain = styled.span`
  font-family: var(--font-manrope), sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 48px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
`;

const HeroCategory = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 16px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
`;

const HeroRange = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
`;

const Metrics = styled.div`
  display: grid;
  flex: 1;
  min-width: 0;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  ${media.desktop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
`;
