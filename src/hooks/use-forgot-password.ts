"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiItemResponse } from "@/types/api";
import { fetchJson } from "@/lib/api/client-fetch";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      fetchJson<ApiItemResponse<{ message: string }>>("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }),
  });
}
