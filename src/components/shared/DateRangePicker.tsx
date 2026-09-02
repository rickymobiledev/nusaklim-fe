"use client";

import styled from "styled-components";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/** Pertama kali dipakai nyata di halaman `/air-temperature`
 *  (`AirTemperatureFilters.tsx`) — sebelumnya "placeholder kerangka" yang
 *  belum dikabelin ke halaman manapun. Format label Indonesia
 *  ("01 Agt 2026 – 21 Agt 2026", en dash) sesuai Figma, bukan
 *  dd/MM/yyyy generik. */
export function DateRangePicker({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}) {
  const label = value?.from
    ? value.to
      ? `${format(value.from, "dd MMM yyyy", { locale: id })} – ${format(value.to, "dd MMM yyyy", { locale: id })}`
      : format(value.from, "dd MMM yyyy", { locale: id })
    : "Pilih rentang tanggal";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Trigger type="button">
          {label}
          <CalendarIcon size={20} color="#9EA2AE" />
        </Trigger>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  height: 48px;
  background: #f6f8f7;
  border: 1.5px solid #d6dcd8;
  border-radius: 12px;
  font-family: var(--font-body), sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #1d2520;
  white-space: nowrap;
`;
