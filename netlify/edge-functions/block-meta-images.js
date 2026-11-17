export default function blockMetaImages(request) {
  if (
    new URL(request.url).pathname === "/_next/image" &&
    /facebookexternalhit/i.test(request.headers.get("user-agent") ?? "")
  ) {
    return new Response(null, {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }
}

export const config = { path: "/_next/image" };
