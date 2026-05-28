import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET env var is not set');
  return new TextEncoder().encode(s);
}

function getCheckinSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET env var is not set');
  return new TextEncoder().encode(s + ':checkin');
}

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function signCheckinToken(payload: { memberId: string; eventId: string }) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getCheckinSecret());
}

export async function verifyCheckinToken(token: string): Promise<{ memberId: string; eventId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getCheckinSecret());
    if (typeof payload.memberId === 'string' && typeof payload.eventId === 'string') {
      return { memberId: payload.memberId, eventId: payload.eventId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCheckinSession(eventId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('checkin-token')?.value;
  if (!token) return null;
  const payload = await verifyCheckinToken(token);
  if (!payload || payload.eventId !== eventId) return null;
  return payload;
}
