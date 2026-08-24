import type { BackendUserProfile } from "@/types/auth";

/**
 * 4 user dummy, satu per role, company_code beda-beda supaya skenario
 * multi-tenant gampang dites. Nilai company_code/name di sini contoh
 * placeholder — gampang diganti begitu tim kasih kode/nama perusahaan
 * yang sebenarnya.
 */
export const MOCK_USERS: (BackendUserProfile & {
  email: string;
  username: string;
})[] = [
  {
    nik_sap: "10000001",
    email: "administrator@rpn.co.id",
    username: "administrator",
    name: "Andi Wijaya",
    image_url: null,
    user_role_code: "ADMINISTRATOR",
    user_role_name: "Administrator",
    company_code: "RPN",
    company_name: "PT Riset Perkebunan Nusantara",
  },
  {
    nik_sap: "10000002",
    email: "researcher@rpn.co.id",
    username: "researcher",
    name: "Siti Rahma",
    image_url: null,
    user_role_code: "RESEARCHER",
    user_role_name: "Peneliti",
    company_code: "SUMSEL",
    company_name: "PPKS Sumatera Selatan",
  },
  {
    nik_sap: "10000003",
    email: "viewer.anper@rpn.co.id",
    username: "vieweranper",
    name: "Budi Santoso",
    image_url: null,
    user_role_code: "VIEWER_ANPER",
    user_role_name: "Viewer Anak Perusahaan",
    company_code: "ANPER",
    company_name: "PT Anak Perusahaan Perkebunan",
  },
  {
    nik_sap: "10000004",
    email: "viewer.holding@rpn.co.id",
    username: "viewerholding",
    name: "Dewi Lestari",
    image_url: null,
    user_role_code: "VIEWER_HOLDING",
    user_role_name: "Viewer Holding",
    company_code: "HOLDING",
    company_name: "PTPN Holding",
  },
];
