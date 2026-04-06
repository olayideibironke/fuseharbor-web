export function isAllowedSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  if (!host) {
    return false;
  }

  const expectedOrigin = `${forwardedProto}://${host}`;

  return origin === expectedOrigin;
}