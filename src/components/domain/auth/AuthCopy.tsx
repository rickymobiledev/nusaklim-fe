"use client";

import styled from "styled-components";
import { Button } from "@/components/ui/button";

export function AuthFooter() {
  return (
    <FooterWrapper>
      <FooterVersion>Nusaklim v1.0</FooterVersion>
      <FooterCopyright>2026 Nusaklim, All right Reserved</FooterCopyright>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  border-top: 1px solid #ecefed;
  padding-top: ${(p) => p.theme.spacing.md};
`;

const FooterVersion = styled.p`
  font-family: var(--font-nunito-sans), sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #394050;
`;

const FooterCopyright = styled.p`
  font-family: var(--font-nunito-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #8b9c90;
`;

export const AuthHeading = styled.h1`
  font-family: var(--font-manrope), sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 34px;
  color: #000000;
`;

export const AuthSubtext = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #000000;
`;

export const AuthLink = styled.button`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: ${(p) => p.theme.colors.primary[600]};

  &:hover {
    text-decoration: underline;
  }
`;

export const AuthSubmitButton = styled(Button)`
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
`;
