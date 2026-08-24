"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import styled from "styled-components";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthFormField({
  id,
  label,
  icon: Icon,
  trailing,
  hint,
  error,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: LucideIcon;
  trailing?: ReactNode;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldWrapper>
      <StyledLabel htmlFor={id}>{label}</StyledLabel>
      <InputWrapper>
        <LeadingIcon>
          <Icon size={24} strokeWidth={1.5} />
        </LeadingIcon>
        <StyledInput id={id} $hasTrailing={Boolean(trailing)} {...inputProps} />
        {trailing && <TrailingSlot>{trailing}</TrailingSlot>}
      </InputWrapper>
      {hint && <HelperText>{hint}</HelperText>}
      {error && <ErrorText>{error}</ErrorText>}
    </FieldWrapper>
  );
}

export const AuthIconButton = styled.button`
  display: inline-flex;
  color: #8b9c90;

  &:hover {
    color: #1d2520;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled(Label)`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #1d2520;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled(Input)<{ $hasTrailing: boolean }>`
  height: 48px;
  padding: 12px 12px 12px 48px;
  padding-right: ${(p) => (p.$hasTrailing ? "48px" : "12px")};
  border-radius: 12px;
  border: 1.5px solid #d6dcd8;
  background: #f6f8f7;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  line-height: 24px;

  &::placeholder {
    color: #8b9c90;
  }
`;

const LeadingIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  display: flex;
  transform: translateY(-50%);
  color: #8b9c90;
  pointer-events: none;
`;

const TrailingSlot = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`;

const HelperText = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  color: #8b9c90;
`;

const ErrorText = styled.p`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 12px;
  color: ${(p) => p.theme.colors.danger[600]};
`;
