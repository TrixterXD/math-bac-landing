import assert from "node:assert/strict";
import { test } from "node:test";
import { unstable_doesMiddlewareMatch as doesProxyMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { config, proxy } from "./proxy";

function request(
  path: string,
  cookie?: string,
  headers?: Record<string, string>,
) {
  return new NextRequest(`https://example.test${path}`, {
    headers: {
      ...headers,
      ...(cookie ? { cookie: `math_bac_locale=${cookie}` } : {}),
    },
  });
}

test("root redirects temporarily to remembered locale or Romanian, never browser language", () => {
  for (const [cookie, target] of [
    [undefined, "ro"],
    ["ru", "ru"],
    ["ro", "ro"],
    ["en", "ro"],
    ["constructor", "ro"],
  ]) {
    const response = proxy(
      request("/?source=test", cookie, { "accept-language": "ru" }),
    );
    assert.equal(response.status, 307);
    assert.equal(
      response.headers.get("location"),
      `https://example.test/${target}?source=test`,
    );
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("set-cookie"), null);
    const destination = proxy(request(`/${target}`, cookie));
    assert.equal(destination.headers.get("location"), null);
  }
});

test("case variants are rejected before Next can reuse static locale pages", () => {
  for (const path of ["/RO", "/RU", "/Ro", "/rU"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url: path }), true);
    const response = proxy(request(path));
    assert.equal(response.status, 404);
    assert.equal(response.headers.get("set-cookie"), null);
  }
});

test("explicit locale wins and sets a host-only persistent preference cookie", () => {
  for (const locale of ["ro", "ru"]) {
    const response = proxy(
      request(`/${locale}`, locale === "ro" ? "ru" : "ro"),
    );
    assert.equal(response.headers.get("location"), null);
    const cookie = response.cookies.get("math_bac_locale");
    assert.equal(cookie?.value, locale);
    assert.equal(cookie?.path, "/");
    assert.equal(cookie?.sameSite, "lax");
    assert.equal(cookie?.httpOnly, true);
    assert.equal(cookie?.secure, true);
    assert.equal(cookie?.maxAge, 31536000);
    assert.equal(cookie?.domain, undefined);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
  assert.equal(
    proxy(new NextRequest("http://localhost:3000/ro")).cookies.get(
      "math_bac_locale",
    )?.secure,
    false,
  );
  assert.equal(
    proxy(
      new NextRequest("https://example.test/ru", { method: "HEAD" }),
    ).cookies.get("math_bac_locale")?.value,
    "ru",
  );
});

test("POSTs, actions and speculative requests pass through without redirects or cookies", () => {
  for (const path of ["/", "/ro", "/ru"]) {
    const post = proxy(
      new NextRequest(`https://example.test${path}`, {
        method: "POST",
        headers: { "next-action": "test-action" },
      }),
    );
    assert.equal(post.headers.get("location"), null);
    assert.equal(post.headers.get("set-cookie"), null);
    assert.equal(post.headers.get("cache-control"), null);
    const speculativeHeaders: Record<string, string>[] = [
      { "next-router-prefetch": "1" },
      { rsc: "1" },
      { purpose: "prefetch" },
      { "sec-purpose": "prefetch;prerender" },
      { "next-action": "test-action" },
    ];
    for (const headers of speculativeHeaders) {
      assert.equal(
        doesProxyMatch({ config, nextConfig: {}, url: path, headers }),
        false,
      );
      const response = proxy(request(path, "ru", headers));
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("set-cookie"), null);
      assert.equal(response.headers.get("cache-control"), null);
    }
  }
});

test("matcher is limited to landing entries and does not claim unsupported/static/action module paths", () => {
  for (const path of ["/", "/ro", "/ru"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url: path }), true);
  }
  for (const path of [
    "/en",
    "/constructor",
    "/ro/other",
    "/ru/other",
    "/_next/static/chunk.js",
    "/images/hero/nastya-hero.png",
    "/favicon.ico",
    "/actions/submitContact",
  ]) {
    assert.equal(
      doesProxyMatch({ config, nextConfig: {}, url: path }),
      false,
      path,
    );
    assert.equal(proxy(request(path)).headers.get("set-cookie"), null);
  }
});
