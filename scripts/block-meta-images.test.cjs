const assert = require("node:assert/strict");
const { test } = require("node:test");

const handler = import("../netlify/edge-functions/block-meta-images.js");
const imagePath = "/_next/image?url=%2Fimages%2Fhero.png&w=1080&q=75";

function request(path, userAgent) {
  return new Request(`https://example.netlify.app${path}`, {
    headers: userAgent ? { "User-Agent": userAgent } : {},
  });
}

test("only the exact optimizer route is declared", async () => {
  const { config } = await handler;
  assert.deepEqual(config, { path: "/_next/image" });
});

test("Meta optimizer requests return empty uncacheable 403s without fetching", async (t) => {
  const { default: blockMetaImages } = await handler;
  const fetch = t.mock.method(globalThis, "fetch", () => {
    throw new Error("Blocked requests must not fetch images");
  });
  for (const ua of ["facebookexternalhit/1.1", "FACEBOOKEXTERNALHIT/1.1"]) {
    const response = blockMetaImages(request(imagePath, ua));
    assert.equal(response.status, 403);
    assert.equal(response.body, null);
    assert.equal(await response.text(), "");
    assert.equal(response.headers.get("Cache-Control"), "no-store");
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("browser, other crawler and missing UAs continue without modifying the request", async () => {
  const { default: blockMetaImages } = await handler;
  for (const ua of ["Mozilla/5.0", "Googlebot", undefined]) {
    const input = request(imagePath, ua);
    const headers = [...input.headers];
    assert.equal(blockMetaImages(input), undefined);
    assert.deepEqual([...input.headers], headers);
    assert.equal(input.bodyUsed, false);
  }
});

test("Meta HTML, static OG image and similar paths continue unchanged", async () => {
  const { default: blockMetaImages } = await handler;
  for (const path of [
    "/ro",
    "/ru",
    "/images/baner/easy-math-baner.jpg",
    "/_next/image/",
    "/_next/images",
    "/.netlify/images",
  ]) {
    assert.equal(
      blockMetaImages(request(path, "facebookexternalhit/1.1")),
      undefined,
    );
  }
});

test("a blocked request does not change subsequent browser decisions", async () => {
  const { default: blockMetaImages } = await handler;
  for (const ua of ["Mozilla/5.0", "facebookexternalhit/1.1", "Mozilla/5.0"]) {
    const response = blockMetaImages(request(imagePath, ua));
    if (ua.startsWith("facebook")) {
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
    } else {
      assert.equal(response, undefined);
    }
  }
});
