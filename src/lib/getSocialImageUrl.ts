export function getSocialImageUrl(
  env: Partial<NodeJS.ProcessEnv> = process.env,
) {
  const origin =
    env.CONTEXT === "production"
      ? env.URL
      : env.DEPLOY_PRIME_URL || env.DEPLOY_URL;

  if (env.NETLIFY && !origin)
    throw new Error("Missing Netlify deployment origin for social images");

  const image = new URL(
    "/images/baner/easy-math-baner.jpg",
    origin || "http://localhost:3000",
  );
  if (origin && image.protocol !== "https:")
    throw new Error("Social image deployment origin must use HTTPS");

  return image.href;
}
