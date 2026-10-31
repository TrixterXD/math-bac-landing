import "server-only";

export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES?.split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (!secret || !siteKey || !hostnames?.length) return false;
  // Official dummy keys must never turn a production deployment into an always-pass form.
  if (
    process.env.NODE_ENV === "production" &&
    (/^[123]x0{20,}/.test(secret) || /^[123]x0{18,}/.test(siteKey))
  )
    return false;
  if (typeof token !== "string" || !token.trim() || token.length > 2048)
    return false;

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) return false;
    const result: unknown = await response.json();
    return (
      typeof result === "object" &&
      result !== null &&
      "success" in result &&
      result.success === true &&
      "hostname" in result &&
      typeof result.hostname === "string" &&
      hostnames.includes(result.hostname)
    );
  } catch {
    return false;
  }
}
