"use client";

import styled from "styled-components";
import { useRainfallHeatmap } from "@/hooks/use-rainfall-heatmap";
import { CalendarOutlineIcon, InfoEmptyIcon } from "@/components/shared/DashboardIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { media } from "@/lib/breakpoints";
import {
  RAINFALL_HEATMAP_COLOR,
  RAINFALL_HEATMAP_LEGEND_ORDER,
  RAINFALL_HEATMAP_RANGE_LABEL,
  RAINFALL_HEATMAP_TOOLTIP_RANGE_LABEL,
  RAINFALL_HEATMAP_TOOLTIP_NAME_LABEL,
} from "@/lib/rainfall-heatmap-level";
import type { RainfallHeatmapLevel } from "@/types/domain";

const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function RainfallHeatmapCard({ stationId }: { stationId?: string }) {
  const { isLoading, bulanLabel, hariKalender } = useRainfallHeatmap(stationId);

  return (
    <Card>
      <HeaderRow>
        <Title>Heatmap Curah Hujan</Title>
        <MonthBadge>
          <CalendarOutlineIcon size={20} />
          <MonthLabel>{bulanLabel}</MonthLabel>
        </MonthBadge>
      </HeaderRow>

      {!stationId ? (
        <EmptyMessage>Pilih stasiun untuk melihat heatmap curah hujan.</EmptyMessage>
      ) : isLoading ? (
        <EmptyMessage>Memuat data curah hujan...</EmptyMessage>
      ) : (
        <>
          <WeekdayRow>
            {WEEKDAY_LABELS.map((label) => (
              <WeekdayLabel key={label}>{label}</WeekdayLabel>
            ))}
          </WeekdayRow>

          <DateGrid>
            {hariKalender.map((hari, i) =>
              hari === null ? (
                <EmptyCell key={i}>-</EmptyCell>
              ) : (
                <DateCell key={hari.tanggal} $level={hari.level}>
                  <DateNumber>{hari.tanggalAngka}</DateNumber>
                  <RainText>
                    {hari.level === "tidak_ada_data" ? "-" : `${hari.curahHujan} mm`}
                  </RainText>
                </DateCell>
              ),
            )}
          </DateGrid>
        </>
      )}

      <LegendSection>
        <LegendHeader>
          <LegendTitle>Keterangan Curah Hujan (mm)</LegendTitle>
          <Popover>
            <PopoverTrigger asChild>
              <InfoTrigger type="button" aria-label="Keterangan level curah hujan">
                <InfoEmptyIcon size={16} color="#8B9C90" />
              </InfoTrigger>
            </PopoverTrigger>
            <TooltipContent align="start" sideOffset={8}>
              <TooltipHeader>Keterangan Curah Hujan</TooltipHeader>
              {RAINFALL_HEATMAP_LEGEND_ORDER.map((level) => (
                <TooltipRow key={level}>
                  <TooltipPill $level={level} />
                  <TooltipText>
                    <TooltipRange>
                      {RAINFALL_HEATMAP_TOOLTIP_RANGE_LABEL[level]}
                    </TooltipRange>
                    <TooltipName>
                      {RAINFALL_HEATMAP_TOOLTIP_NAME_LABEL[level]}
                    </TooltipName>
                  </TooltipText>
                </TooltipRow>
              ))}
            </TooltipContent>
          </Popover>
        </LegendHeader>
        <LegendBars>
          {RAINFALL_HEATMAP_LEGEND_ORDER.map((level) => (
            <LegendItem key={level}>
              <LegendBar $level={level} />
              <LegendLabel>{RAINFALL_HEATMAP_RANGE_LABEL[level]}</LegendLabel>
            </LegendItem>
          ))}
        </LegendBars>
      </LegendSection>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h2`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
`;

const MonthBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MonthLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  white-space: nowrap;
`;

const EmptyMessage = styled.p`
  padding: 8px 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  color: #667a6c;
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;

  ${media.desktop} {
    gap: 8px;
  }
`;

const WeekdayLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
  text-align: center;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;

  ${media.desktop} {
    gap: 8px;
  }
`;

/* min-height lebih rendah di mobile (~44px) — dikonfirmasi dari CSS
 * Figma mobile persis (sel kalender ~40px tinggi di lebar 428px),
 * desktop tetap 70px seperti spec Figma desktop. */
const EmptyCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  color: #1d2520;

  ${media.desktop} {
    min-height: 70px;
  }
`;

const DateCell = styled.div<{ $level: RainfallHeatmapLevel }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 44px;
  border-radius: 8px;
  background: ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].bg};
  color: ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].text};
  border: 1px solid
    ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].border ?? RAINFALL_HEATMAP_COLOR[$level].bg};

  ${media.desktop} {
    min-height: 70px;
  }
`;

const DateNumber = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: inherit;
`;

const RainText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: inherit;
`;

const LegendSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegendHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendTitle = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #1d2520;
`;

/* Satu baris tanpa wrap di semua breakpoint (dikoreksi setelah user
 * laporkan bug — sebelumnya `flex-wrap:wrap` + `min-width:80px` per
 * item bikin 6 item pecah jadi 2 baris di mobile karena tidak muat). */
const LegendBars = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex-wrap: nowrap;

  ${media.desktop} {
    gap: 8px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1 1 0;
  min-width: 0;

  ${media.desktop} {
    min-width: 80px;
  }
`;

const LegendBar = styled.div<{ $level: RainfallHeatmapLevel }>`
  width: 100%;
  height: 5px;
  border-radius: 50px;
  background: ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].bg};
  border: 1px solid
    ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].border ?? RAINFALL_HEATMAP_COLOR[$level].bg};
`;

const LegendLabel = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 12px;
  color: #1d2520;
`;

const InfoTrigger = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const TooltipContent = styled(PopoverContent)`
  display: flex;
  flex-direction: column;
  width: 230px;
  padding: 0 0 16px;
  background: #ffffff;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 4px 26px rgba(0, 0, 0, 0.25);
`;

const TooltipHeader = styled.div`
  padding: 16px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #455249;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 8px 16px;
  gap: 12px;
`;

const TooltipPill = styled.span<{ $level: RainfallHeatmapLevel }>`
  width: 15px;
  align-self: stretch;
  border-radius: 50px;
  background: ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].bg};
  border: 1px solid
    ${({ $level }) => RAINFALL_HEATMAP_COLOR[$level].border ?? RAINFALL_HEATMAP_COLOR[$level].bg};
`;

const TooltipText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TooltipRange = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #1d2520;
`;

const TooltipName = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #455249;
`;
