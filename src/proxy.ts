import { type NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale } from "./i18n/locales";

export function proxy(request: NextRequest) {
  if (
    !["GET", "HEAD"].includes(request.method) ||
    request.headers.has("next-action") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.has("rsc") ||
    /prefetch/i.test(request.headers.get("purpose") ?? "") ||
    /prefetch/i.test(request.headers.get("sec-purpose") ?? "")
  )
    return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const preference = request.cookies.get("math_bac_locale")?.value;
    const url = request.nextUrl.clone();
    url.pathname = `/${isLocale(preference) ? preference : defaultLocale}`;
    const response = NextResponse.redirect(url, 307);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const locale = pathname.slice(1);
  // Reject case variants before Next can reuse a static locale page.
  if (!isLocale(locale)) return new NextResponse(null, { status: 404 });
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.cookies.set("math_bac_locale", locale, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: [
    {
      source: "/:locale([rR][oOuU])?",
      // Next may normalize RSC headers before proxy; exclude speculative requests at matching time.
      missing: [
        { type: "header", key: "next-action" },
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "rsc" },
        { type: "header", key: "purpose", value: ".*prefetch.*" },
        { type: "header", key: "sec-purpose", value: ".*prefetch.*" },
      ],
    },
  ],
};
