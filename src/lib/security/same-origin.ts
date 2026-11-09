/**
 * Proteksi CSRF untuk Route Handler `app/api/**` (VA-05) — dipanggil dari
 * `src/proxy.ts`, jadi berlaku ke semua handler tanpa perlu diubah satu-satu.
 *
 * Request yang mengubah state (POST/PUT/PATCH/DELETE) hanya diterima kalau
 * berasal dari origin app sendiri:
 *  1. `Sec-Fetch-Site` (di-set browser, tidak bisa dipalsukan JS halaman lain)
 *     — `same-origin` diterima, `cross-site`/`same-site` ditolak. `same-site`
 *     ikut ditolak karena subdomain lain tetap ikut mengirim cookie SameSite=Lax.
 *  2. Browser lama tanpa `Sec-Fetch-Site`: host dari `Origin` (atau `Referer`)
 *     harus sama dengan host app. Tanpa keduanya -> ditolak.
 *
 * Host app diambil dari `X-Forwarded-Host`/`Host`, ditambah `AUTH_URL`,
 * `NEXTAUTH_URL`, dan `APP_ALLOWED_ORIGINS` (dipisah koma) untuk deployment
 * di belakang reverse proxy yang menulis ulang `Host`.
 */
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function hostOf(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

function allowedHosts(headers: Headers): Set<string> {
  const hosts = new Set<string>();
  const forwarded = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = headers.get("host")?.trim();
  if (forwarded) hosts.add(forwarded.toLowerCase());
  if (host) hosts.add(host.toLowerCase());

  const configured = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    ...(process.env.APP_ALLOWED_ORIGINS?.split(",") ?? []),
  ];
  for (const origin of configured) {
    const h = hostOf(origin?.trim());
    if (h) hosts.add(h);
  }
  return hosts;
}

/** `true` kalau request mengubah state dan TIDAK terbukti berasal dari app ini. */
export function isCrossOriginMutation(request: Request): boolean {
  if (!UNSAFE_METHODS.has(request.method.toUpperCase())) return false;

  const { headers } = request;
  const fetchSite = headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite !== "same-origin";

  const sourceHost = hostOf(headers.get("origin")) ?? hostOf(headers.get("referer"));
  if (!sourceHost) return true;
  return !allowedHosts(headers).has(sourceHost);
}
