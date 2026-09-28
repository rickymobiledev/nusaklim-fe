"use client";

import styled from "styled-components";
import { SkeletonBlock } from "@/components/shared/SkeletonBlock";

/** Skeleton area chart: blok setinggi chart (default 320px = `ResponsiveContainer`
 *  di halaman Monitoring) + satu baris footnote, supaya kartu tidak melompat
 *  saat data datang. */
export function ChartSkeleton({ height = 320 }: { height?: number }) {
  return (
    <Wrapper>
      <SkeletonBlock $h={`${height}px`} $radius="8px" />
      <SkeletonBlock $w="60%" $h="14px" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
