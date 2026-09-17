import { redirect } from "next/navigation";

/** "/user-management" sendiri bukan halaman — cuma dipakai sebagai `href`
 *  induk item nav "Lainnya" (buat active-state prefix-match), tujuan
 *  klik sebenarnya dropdown "Manajemen" -> "/user-management/users". */
export default function UserManagementIndexPage() {
  redirect("/user-management/users");
}
