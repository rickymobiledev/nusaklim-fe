"use client";

import styled from "styled-components";
import { AlertTriangleIcon, StationIcon } from "@/components/shared/DashboardIcons";
import { media } from "@/lib/breakpoints";
import { MissingDataImportCard } from "./MissingDataImportCard";

/** Baris kartu ringkasan (Figma "Frame 320"): Data Missing + Stasiun
 *  Terdampak + kartu Import File. Mobile ditumpuk, desktop 1 baris. */
export function MissingDataSummary({
  missingCount,
  affectedStationCount,
}: {
  missingCount: number;
  affectedStationCount: number;
}) {
  return (
    <Row>
      <StatCard>
        <IconCircle $background="#FDECEC">
          <AlertTriangleIcon size={32} color="#EE443F" />
        </IconCircle>
        <StatText>
          <StatValue>{missingCount.toLocaleString("id-ID")}</StatValue>
          <StatLabel>Data Missing</StatLabel>
        </StatText>
      </StatCard>

      <StatCard>
        <IconCircle $background="#EFF5FF">
          <StationIcon size={32} color="#175FE2" />
        </IconCircle>
        <StatText>
          <StatValue>{affectedStationCount.toLocaleString("id-ID")}</StatValue>
          <StatLabel>Stasiun Terdampak</StatLabel>
        </StatText>
      </StatCard>

      <MissingDataImportCard />
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.desktop} {
    flex-direction: row;
    align-items: stretch;
  }
`;

const StatCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px;
  min-height: 106px;
  background: #ffffff;
  border: 1px solid #d6dcd8;
  border-radius: 16px;

  ${media.desktop} {
    flex: 1 1 0;
    min-width: 0;
  }
`;

const IconCircle = styled.div<{ $background: string }>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: ${(p) => p.$background};
  border-radius: 50px;
`;

const StatText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-family: var(--font-heading), sans-serif;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
  color: #1d2520;
`;

const StatLabel = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: #1d2520;
`;
