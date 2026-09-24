"use client";

import styled from "styled-components";
import { Info } from "lucide-react";
import { media } from "@/lib/breakpoints";
import { DataState } from "@/components/shared/DataState";
import {
  MONTH_LABEL_SHORT,
  WATER_BALANCE_ROWS,
  formatWaterBalanceValue,
  sumMetric,
} from "@/lib/water-balance-chart-utils";
import { MONTH_ORDER, type WaterBalance } from "@/types/domain";

/** Ambang defisit air > 200mm/tahun ikut teks alert Figma (sama seperti
 *  panel "Keseimbangan Air" di tab Peta) — bukan field dari BE. */
const WATER_DEFICIT_THRESHOLD = 200;

export function WaterBalanceTable({
  data,
  stationCode,
  isLoading,
  isError,
  error,
}: {
  data?: WaterBalance;
  stationCode: string;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  return (
    <>
      <Card>
        <DataState
          isLoading={isLoading}
          isError={isError}
          error={error}
          isEmpty={!data}
          emptyMessage="Pilih stasiun untuk melihat keseimbangan air."
        >
          {data && (
            <Scroll>
              <Table>
                <thead>
                  <tr>
                    <HeadCell $left $width={130}>
                      Parameter
                    </HeadCell>
                    <HeadCell $left $width={100}>
                      Stasiun
                    </HeadCell>
                    {MONTH_ORDER.map((month) => (
                      <HeadCell key={month}>{MONTH_LABEL_SHORT[month]}</HeadCell>
                    ))}
                    <HeadCell>Total</HeadCell>
                  </tr>
                </thead>
                <tbody>
                  {WATER_BALANCE_ROWS.map(({ metric, label }, rowIndex) => (
                    <Row key={metric} $zebra={rowIndex % 2 === 0}>
                      <BodyCell $left>{label}</BodyCell>
                      <BodyCell $left>{stationCode}</BodyCell>
                      {data.months.map((month) => (
                        <BodyCell key={month.month}>
                          {formatWaterBalanceValue(month[metric])}
                        </BodyCell>
                      ))}
                      <BodyCell>
                        {formatWaterBalanceValue(sumMetric(data, metric))}
                      </BodyCell>
                    </Row>
                  ))}
                </tbody>
              </Table>
            </Scroll>
          )}
        </DataState>
      </Card>

      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#175fe2" />
        <AlertText>
          Defisit air &gt; {WATER_DEFICIT_THRESHOLD} mm/tahun akan menyebabkan cekaman
          kekeringan bagi tanaman kelapa sawit.
        </AlertText>
      </InfoAlert>
    </>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;

  ${media.desktop} {
    padding: 0;
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  background: #ffffff;
  border: 1px solid #e5e7ea;
  border-radius: 12px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
`;

const HeadCell = styled.th<{ $left?: boolean; $width?: number }>`
  box-sizing: border-box;
  height: 60px;
  padding: 8px 12px;
  min-width: ${(p) => p.$width ?? 89}px;
  text-align: ${(p) => (p.$left ? "left" : "center")};
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #003f6b;
  background: #ffffff;
`;

const Row = styled.tr<{ $zebra: boolean }>`
  background: ${(p) => (p.$zebra ? "#f6f8f7" : "#ffffff")};
  border-bottom: 1px solid #ecefed;
`;

const BodyCell = styled.td<{ $left?: boolean }>`
  box-sizing: border-box;
  height: 49px;
  padding: 10px 12px;
  text-align: ${(p) => (p.$left ? "left" : "center")};
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #1d2520;
  white-space: nowrap;
`;

const InfoAlert = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #e6f4ff;
  border: 1.5px solid #0095ff;
  border-radius: 12px;

  & svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #667a6c;
`;
