const LOCAL_DEV_URL = "http://localhost:3000";

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return LOCAL_DEV_URL;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, "");
  }

  return `https://${trimmed}`.replace(/\/$/, "");
}

export function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitUrl) {
    return normalizeUrl(explicitUrl);
  }

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (productionUrl) {
    return normalizeUrl(productionUrl);
  }

  const deploymentUrl = process.env.VERCEL_URL?.trim();

  if (deploymentUrl) {
    return normalizeUrl(deploymentUrl);
  }

  return LOCAL_DEV_URL;
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}