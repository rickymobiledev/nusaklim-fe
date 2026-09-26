"use client";

import styled from "styled-components";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useNotificationDetail } from "@/hooks/use-notifications";
import { parseNotificationDate } from "@/lib/notification-time";
import { DataState } from "@/components/shared/DataState";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NewsHtml } from "@/components/domain/user-management/news/NewsContent";
import { media } from "@/lib/breakpoints";

/** Halaman baca satu notifikasi (`/notification/[id]`).
 *  Style tampilan mirip seperti baca berita, hanya menampilkan field yang tersedia:
 *  tanggal/waktu pembuatan (`created_at`), judul (`title`), dan isi pesan (`message` format HTML). */
export function NotificationDetailSection({
  notificationId,
}: {
  notificationId: string;
}) {
  const { data, isLoading, isError, error } =
    useNotificationDetail(notificationId);

  return (
    <>
      <Breadcrumb currentLabel={data?.judul} />
      <MobileTitle>Notifikasi</MobileTitle>
      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!data}
        emptyMessage="Notifikasi tidak ditemukan."
      >
        {data && (
          <Column>
            <TextCard>
              <DateText>
                {format(
                  parseNotificationDate(data.dibuatPada),
                  "d MMMM yyyy, HH:mm",
                  { locale: idLocale },
                )}
              </DateText>
              <Title>{data.judul}</Title>
              <Content html={data.pesan} />
            </TextCard>
          </Column>
        )}
      </DataState>
    </>
  );
}

const MobileTitle = styled.h1`
  font-family: var(--font-heading), sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  color: #000000;

  ${media.desktop} {
    display: none;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const TextCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
`;

const DateText = styled.span`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 13px;
  line-height: 18px;
  color: #667a6c;
`;

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-heading), sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
  color: #000000;

  ${media.desktop} {
    font-size: 24px;
    line-height: 32px;
  }
`;

const Content = styled(NewsHtml)`
  font-size: 15px;
  line-height: 24px;
  color: #1d2520;

  > * + * {
    margin-top: 16px;
  }

  p {
    margin: 0;
  }

  ul {
    padding-left: 20px;
    list-style-type: disc;
  }

  li {
    margin-top: 8px;
  }

  strong {
    color: #1d2520;
    font-weight: 700;
  }
`;
