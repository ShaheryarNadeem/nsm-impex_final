// src/lib/auth.ts
// Native Web Crypto API implementation - Edge & Node.js compatible (No external packages needed)

export const AUTH_COOKIE_NAME = 'nsm_admin_session';

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array | string): string {
  const binary = typeof bytes === 'string' ? bytes : String.fromCharCode(...bytes);
  if (typeof btoa !== 'undefined') {
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return Buffer.from(binary, 'binary').toString('base64url');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  if (typeof atob !== 'undefined') {
    return atob(str);
  }
  return Buffer.from(str, 'base64').toString('binary');
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  exp: number;
}

/**
 * Creates an encrypted HMAC-SHA256 JWT session token
 */
export async function signAdminSession(email: string): Promise<string> {
  const secret = process.env.ADMIN_JWT_SECRET || 'nsm_impex_secure_jwt_secret_2026_default_key_protect';
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days validity
  const payload: AdminSessionPayload = { email, role: 'admin', exp };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${data}.${encodedSignature}`;
}

/**
 * Verifies the JWT session token
 */
export async function verifyAdminSession(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;
  const secret = process.env.ADMIN_JWT_SECRET || 'nsm_impex_secure_jwt_secret_2026_default_key_protect';

  try {
    const key = await getCryptoKey(secret);
    const data = `${headerB64}.${payloadB64}`;

    const sigStr = base64UrlDecode(signatureB64);
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(payloadB64)) as AdminSessionPayload;
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }
    return payload;
  } catch {
    return null;
  }
}
