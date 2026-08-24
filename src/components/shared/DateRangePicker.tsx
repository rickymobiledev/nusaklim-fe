"use client";

import styled from "styled-components";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Trigger = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.spacing.xs};
  color: ${(p) => p.theme.colors.neutral[900]};
`;

/** Placeholder kerangka — belum dikabelin ke halaman manapun (lihat
 *  catatan di unduh-data/page.tsx). */
export function DateRangePicker({
  value,
  onChange,
}: {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}) {
  const label = value?.from
    ? value.to
      ? `${format(value.from, "dd/MM/yyyy")} - ${format(value.to, "dd/MM/yyyy")}`
      : format(value.from, "dd/MM/yyyy")
    : "Pilih rentang tanggal";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Trigger variant="outline">
          <CalendarIcon className="h-4 w-4" />
          {label}
        </Trigger>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="range" selected={value} onSelect={onChange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}
