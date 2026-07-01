/** JWT helpers shared by the browser client and Next.js proxy. */
export function getAccessTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob !== "undefined"
        ? atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf8");
    const decoded = JSON.parse(json) as { exp?: number };

    if (typeof decoded.exp === "number") return decoded.exp * 1000;
  } catch {
    return null;
  }

  return null;
}

export function isAccessTokenUsable(token: string, now = Date.now()) {
  const expiresAt = getAccessTokenExpiryMs(token);
  return expiresAt !== null && expiresAt > now;
}
