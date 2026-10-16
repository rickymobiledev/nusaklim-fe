"use client";

import { Headset, MessageCircle } from "lucide-react";
import styled from "styled-components";
import { HOTLINE_CONTACTS, toWhatsAppUrl } from "@/lib/hotline";

export function HotlineBanner() {
  return (
    <Wrapper>
      <Heading>
        <Headset size={22} aria-hidden />
        Hotline Nusaklim
      </Heading>
      <Contacts>
        {HOTLINE_CONTACTS.map((contact) => (
          <ContactLink
            key={contact.waNumber}
            href={toWhatsAppUrl(
              contact.waNumber,
              "Halo Nusaklim, saya ingin melaporkan stasiun yang tidak aktif.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi ${contact.name} via WhatsApp di ${contact.phone}`}
          >
            <MessageCircle size={20} aria-hidden />
            <span>
              {contact.phone} <Name>({contact.name})</Name>
            </span>
          </ContactLink>
        ))}
      </Contacts>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #ecefed;
  border-radius: 16px;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-manrope), sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #175fe2;
`;

const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Name = styled.span`
  font-weight: 700;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #e9faf0;
  border: 1px solid #b7ebcb;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #14753a;
  text-decoration: none;
  transition: background 0.15s ease;

  svg {
    flex-shrink: 0;
    color: #25d366;
  }

  &:hover {
    background: #d3f5e1;
  }

  &:focus-visible {
    outline: 2px solid #175fe2;
    outline-offset: 2px;
  }
`;
