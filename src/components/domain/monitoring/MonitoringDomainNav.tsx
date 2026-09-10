"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";

/** Teks/icon sama persis `app/(dashboard)/monitoring/page.tsx` (landing
 *  grid 4 domain Monitoring) — nav pill ini versi ringkas yang dirender
 *  DI ATAS konten tiap halaman domain (bukan pengganti landing grid),
 *  supaya user bisa pindah antar domain tanpa balik ke `/monitoring`
 *  dulu, sesuai referensi Figma. Icon PNG asli Figma (bukan lucide lagi
 *  seperti Fase 2), pola sama `AirPressureTitle.tsx` — file-nya di
 *  `public/brand/<slug>.png`, ditaruh user sendiri, tidak perlu ubah
 *  kode ini lagi begitu file-nya ada/diganti. */
const ITEMS = [
  {
    href: "/monitoring/water-balance",
    title: "Keseimbangan Air",
    desc: "Periksa semua laporan analisis keseimbangan air",
    icon: "/brand/water-balance.png",
  },
  {
    href: "/monitoring/dry-spell",
    title: "Deret Terpanjang Hari Tidak Hujan",
    desc: "Periksa laporan tentang deret terpanjang hari tidak hujan",
    icon: "/brand/dry-spell.png",
  },
  {
    href: "/monitoring/lama-penyinaran",
    title: "Lama Penyinaran",
    desc: "Periksa laporan dari lama penyinaran",
    icon: "/brand/lama-penyinaran.png",
  },
  {
    href: "/monitoring/vpd",
    title: "VPD",
    desc: "Periksa indeks cekaman kekeringan pada tanaman",
    icon: "/brand/vpd.png",
  },
] as const;

export function MonitoringDomainNav() {
  const pathname = usePathname();

  return (
    <Grid>
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <NavCard key={item.href} href={item.href} $active={active}>
            <NavRow>
              <Image src={item.icon} alt="" width={24} height={24} />
              <NavTitle>{item.title}</NavTitle>
              <ChevronDown size={18} color="#131927" />
            </NavRow>
            <NavDesc>{item.desc}</NavDesc>
          </NavCard>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const NavCard = styled(Link)<{ $active: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${(p) => (p.$active ? "#eff5ff" : "rgba(255, 255, 255, 0.7)")};
  border: 1px solid ${(p) => (p.$active ? "#175fe2" : "#e5e7ea")};
  border-radius: 12px;
  text-decoration: none;
`;

const NavRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavTitle = styled.p`
  flex: 1;
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #000000;
`;

const NavDesc = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #6d717f;
`;
