"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import styled, { keyframes } from "styled-components";
import { useStations } from "@/hooks/use-stations";
import { getErrorMessage } from "@/lib/api/error-messages";
import { RefreshDoubleIcon } from "@/components/shared/DashboardIcons";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";
import type { StationStatus } from "@/types/domain";
import { HotlineBanner } from "./HotlineBanner";
import { StationStatusCard } from "./StationStatusCard";

const CONFIG: Record<
  StationStatus,
  { title: string; icon: string; emptyText: string; color: string }
> = {
  on: {
    title: "Stasiun Aktif",
    icon: "/brand/station-active.png",
    emptyText: "Belum ada stasiun aktif.",
    color: "#43B75D",
  },
  off: {
    title: "Stasiun Tidak Aktif",
    icon: "/brand/station-inactive.png",
    emptyText: "Semua stasiun sedang aktif.",
    color: "#EE443F",
  },
};

export function StationStatusSection({ status }: { status: StationStatus }) {
  const config = CONFIG[status];
  const { data, isLoading, isFetching, error, refetch } = useStations();
  const [query, setQuery] = useState("");

  const stations = useMemo(
    () => (data?.data ?? []).filter((s) => s.status === status),
    [data, status],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter(
      (s) => s.nama.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q),
    );
  }, [stations, query]);

  return (
    <Wrapper>
      <Header>
        <TitleBlock>
          <Image src={config.icon} alt="" width={48} height={48} />
          <Title>{config.title}</Title>
          {!isLoading && <Count $color={config.color}>{stations.length}</Count>}
        </TitleBlock>
        <Actions>
          <SearchBox>
            <Search size={16} aria-hidden />
            <SearchInput
              type="search"
              placeholder="Cari stasiun atau perusahaan"
              aria-label="Cari stasiun"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SearchBox>
          <RefreshButton type="button" onClick={() => refetch()} disabled={isFetching}>
            <SpinningIcon $spinning={isFetching} size={18} />
            Refresh
          </RefreshButton>
        </Actions>
      </Header>

      {status === "off" && <HotlineBanner />}

      {error ? (
        <Message role="alert">{getErrorMessage(error)}</Message>
      ) : isLoading ? (
        <Grid>
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBlock key={i} $h="188px" $radius="16px" />
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Message>{query ? "Tidak ada stasiun yang cocok." : config.emptyText}</Message>
      ) : (
        <Grid>
          {filtered.map((station) => (
            <StationStatusCard key={station.id} station={station} />
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dfe5e1;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Title = styled.h1`
  font-family: var(--font-manrope), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;
`;

const Count = styled.span<{ $color: string }>`
  min-width: 28px;
  padding: 2px 10px;
  border-radius: 999px;
  background: ${(p) => p.$color};
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchBox = styled.label`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dfe5e1;
  border-radius: 8px;
  color: #667a6c;

  &:focus-within {
    border-color: #175fe2;
  }

  @media (min-width: 768px) {
    flex: none;
    width: 280px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  color: #1d2520;

  &::placeholder {
    color: #8b9c90;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinningIcon = styled(RefreshDoubleIcon)<{ $spinning: boolean }>`
  animation: ${(p) => (p.$spinning ? spin : "none")} 0.8s linear infinite;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  height: 40px;
  padding: 0 14px;
  background: #ffffff;
  border: 1px solid #175fe2;
  border-radius: 8px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #175fe2;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Message = styled.p`
  padding: 48px 16px;
  text-align: center;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  color: #667a6c;
`;
