export function parseAccessTokenRole(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    // Decode base64url
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Fail closed for expired/malformed session payloads.
    if (typeof payload.exp !== 'number') return null;
    if (payload.exp * 1000 <= Date.now()) return null;

    return payload.ChucVu || null;
  } catch {
    return null;
  }
}
