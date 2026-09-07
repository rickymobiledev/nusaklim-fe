import { NextResponse } from "next/server";
import { drySpellApi } from "@/lib/api";
import { getDefaultDrySpellYear } from "@/lib/api/dry-spell-api";
import { requireUser, apiErrorResponse, resolveCompanyId } from "@/lib/api/route-guard";

export async function GET(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (!user) return unauthorized;

  const { searchParams } = new URL(request.url);
  const companyId = resolveCompanyId(user, searchParams.get("companyId") ?? undefined);

  // `year` WAJIB di endpoint asli (lihat catatan di lib/api/dry-spell-api.ts)
  // — belum ada UI pemilih tahun di tab ini, jadi default ke tahun
  // berjalan kalau client tidak kirim.
  const year = Number(searchParams.get("year")) || getDefaultDrySpellYear();

  try {
    const result = await drySpellApi.getStationDrySpell({ companyId, year });
    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
