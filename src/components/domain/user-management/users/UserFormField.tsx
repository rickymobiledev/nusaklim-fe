"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import styled from "styled-components";
import { Eye, EyeOff, Lock } from "lucide-react";

type UserFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  /** Tampilkan ikon gembok + tombol mata (field kata sandi). */
  password?: boolean;
};

/** Field form Tambah/Edit Pengguna (Figma "Input": label + kotak 48px). */
export const UserFormField = forwardRef<HTMLInputElement, UserFormFieldProps>(
  function UserFormField({ id, label, error, password = false, ...rest }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Box $invalid={!!error}>
          {password && <Lock size={24} strokeWidth={1.5} color="#8B9C90" />}
          <TextInput
            id={id}
            ref={ref}
            {...rest}
            type={password ? (visible ? "text" : "password") : rest.type}
            aria-invalid={!!error}
          />
          {password && (
            <ToggleButton
              type="button"
              aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? (
                <Eye size={24} strokeWidth={1.5} />
              ) : (
                <EyeOff size={24} strokeWidth={1.5} />
              )}
            </ToggleButton>
          )}
        </Box>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  },
);

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: #1d2520;
`;

export const FieldError = styled.p`
  margin: 0;
  font-family: var(--font-body), sans-serif;
  font-size: 12px;
  color: ${(p) => p.theme.colors.danger[600]};
`;

const Box = styled.div<{ $invalid: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  height: 48px;
  background: #ffffff;
  border: 1.5px solid ${(p) => (p.$invalid ? p.theme.colors.danger[600] : "#d6dcd8")};
  border-radius: 12px;

  &:focus-within {
    border-color: #175fe2;
  }
`;

const TextInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  font-family: var(--font-plus-jakarta-sans), sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #1d2520;

  &::placeholder {
    color: #8b9c90;
  }

  &:disabled {
    color: #8b9c90;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #8b9c90;
  cursor: pointer;
`;
