"use client";

import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { TriangleAlert } from "lucide-react";
import styled from "styled-components";
import type { Station } from "@/types/domain";

export function StationStatusCard({ station }: { station: Station }) {
  const isActive = station.status === "on";
  const syncDate = station.sinkronisasiTerakhir
    ? new Date(station.sinkronisasiTerakhir)
    : null;

  return (
    <Card $active={isActive}>
      <Body>
        <Info>
          <Name>{station.nama}</Name>
          <Company>{station.companyName}</Company>
          <SyncLabel>Terakhir sinkron</SyncLabel>
          {syncDate ? (
            <SyncValue>
              <time dateTime={syncDate.toISOString()}>
                {format(syncDate, "d MMMM yyyy", { locale: id })}
                <br />
                {format(syncDate, "HH:mm")}
              </time>
            </SyncValue>
          ) : (
            <SyncEmpty>Belum ada data</SyncEmpty>
          )}
        </Info>
        <Illustration
          src={isActive ? "/brand/station-active.png" : "/brand/station-inactive.png"}
          alt=""
          width={72}
          height={72}
        />
      </Body>
      {!isActive && (
        <Alert role="status">
          <TriangleAlert size={18} aria-hidden />
          Perlu diperhatikan segera
        </Alert>
      )}
    </Card>
  );
}

const Card = styled.article<{ $active: boolean }>`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 16px 16px 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
  box-shadow: 0px 2px 8px rgba(23, 95, 226, 0.08);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 6px;
    background: ${(p) => (p.$active ? "#43B75D" : "#EE443F")};
  }

  &:hover {
    box-shadow: 0px 6px 16px rgba(23, 95, 226, 0.14);
    transform: translateY(-2px);
  }
`;

const Body = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Name = styled.h3`
  font-family: var(--font-manrope), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #1d2520;
  overflow-wrap: anywhere;
`;

const Company = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  line-height: 20px;
  color: #667a6c;
`;

const SyncLabel = styled.span`
  margin-top: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  line-height: 16px;
  color: #8b9c90;
`;

const SyncValue = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 22px;
  color: #1d2520;
`;

const SyncEmpty = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 22px;
  color: #8b9c90;
`;

const Illustration = styled(Image)`
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  object-fit: contain;
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fff3cd;
  border: 1px solid #f5c04a;
  border-radius: 8px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  text-transform: uppercase;
  color: #8a1c0f;

  svg {
    flex-shrink: 0;
    color: #d92d20;
  }
`;
