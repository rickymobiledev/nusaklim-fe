"use client";

import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Info } from "lucide-react";
import { DataState } from "@/components/shared/DataState";
import {
  getDrySpellLevel,
  DRY_SPELL_COLOR,
  DRY_SPELL_LABEL,
} from "@/lib/dry-spell-level";
import type { DrySpellReport } from "@/types/domain";

export function DrySpellList({
  data,
  isLoading,
  isError,
  error,
}: {
  data: DrySpellReport[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
}) {
  const rows = [...data].sort((a, b) => b.totalHariKering - a.totalHariKering);

  return (
    <Wrapper>
      <InfoAlert>
        <Info size={20} strokeWidth={1.5} color="#175fe2" />
        <AlertText>
          Deret terpanjang hari tidak hujan &gt; 10 : Pemupukan perlu dihentikan. Deret
          terpanjang hari tidak hujan &gt; 20 : Tanaman sawit anda akan mengalami cekaman
          kekeringan.
        </AlertText>
      </InfoAlert>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={rows.length === 0}
        emptyMessage="Tidak ada periode hari tanpa hujan pada rentang & stasiun ini."
      >
        <List>
          {rows.map((row, index) => {
            const level = getDrySpellLevel(row.totalHariKering);
            return (
              <PeriodCard key={`${row.tanggalMulai}-${index}`}>
                <PeriodInfo>
                  <PeriodDuration>{row.totalHariKering} Hari</PeriodDuration>
                  <PeriodDateRow>
                    <CalendarIcon size={18} color="#8b9c90" />
                    <PeriodDateText>
                      {format(parseISO(row.tanggalMulai), "dd MMMM yyyy", {
                        locale: id,
                      })}{" "}
                      –{" "}
                      {format(parseISO(row.tanggalSelesai), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </PeriodDateText>
                  </PeriodDateRow>
                </PeriodInfo>
                <LevelBadge $color={DRY_SPELL_COLOR[level]}>
                  Deret Terpanjang Hari Tidak Hujan {DRY_SPELL_LABEL[level]}
                </LevelBadge>
              </PeriodCard>
            );
          })}
        </List>
      </DataState>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #e6f4ff;
  border: 1.5px solid #0095ff;
  border-radius: 12px;
`;

const AlertText = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: #667a6c;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PeriodCard = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 20px;
`;

const PeriodInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
`;

const PeriodDuration = styled.span`
  font-family: var(--font-heading), sans-serif;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
  color: #1d2520;
  white-space: nowrap;
`;

const PeriodDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PeriodDateText = styled.span`
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  color: #8b9c90;
  white-space: nowrap;
`;

const LevelBadge = styled.span<{ $color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 16px;
  border-radius: 24px;
  background: ${(p) => p.$color};
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #ffffff;
  white-space: nowrap;
`;
