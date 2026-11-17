import assert from "node:assert/strict";
import { test } from "node:test";
import { getSocialImageUrl } from "./getSocialImageUrl";

const imagePath = "/images/baner/easy-math-baner.jpg";
const urls = {
  URL: "https://example.netlify.app",
  DEPLOY_PRIME_URL: "https://deploy-preview-12--example.netlify.app",
  DEPLOY_URL: "https://unique--example.netlify.app",
};

test("production uses the primary site origin", () => {
  assert.equal(
    getSocialImageUrl({ ...urls, NETLIFY: "true", CONTEXT: "production" }),
    urls.URL + imagePath,
  );
});

test("preview and branch deploys never advertise the production origin", () => {
  for (const context of ["deploy-preview", "branch-deploy"]) {
    assert.equal(
      getSocialImageUrl({ ...urls, NETLIFY: "true", CONTEXT: context }),
      urls.DEPLOY_PRIME_URL + imagePath,
    );
    assert.equal(
      getSocialImageUrl({ URL: urls.URL, DEPLOY_URL: urls.DEPLOY_URL }),
      urls.DEPLOY_URL + imagePath,
    );
  }
});

test("Netlify requires a deployment URL and HTTPS", () => {
  assert.throws(() => getSocialImageUrl({ NETLIFY: "true", URL: urls.URL }));
  assert.throws(() =>
    getSocialImageUrl({ NETLIFY: "true", CONTEXT: "production" }),
  );
  assert.throws(() =>
    getSocialImageUrl({ DEPLOY_PRIME_URL: "http://example.netlify.app" }),
  );
  assert.throws(() => getSocialImageUrl({ DEPLOY_PRIME_URL: "invalid" }));
});

test("local builds work without Netlify environment variables", () => {
  assert.equal(getSocialImageUrl({}), `http://localhost:3000${imagePath}`);
});
