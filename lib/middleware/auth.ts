import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined. Please add it to your .env.local file.');
}

export interface JWTPayload {
  id: string;
  userId: string;
  name: string;
  role: UserRole;
  staffCategory?: string;
}

// Extracts and verifies the JWT from the request cookie
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('aau_token')?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET as string) as JWTPayload;
  } catch {
    return null;
  }
}

// AuthController.enforceRole() — call this at the top of any protected route
// Usage: const auth = enforceRole(request, ['staff', 'admin'])
//        if (auth instanceof NextResponse) return auth  ← early return if unauthorized
export function enforceRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): JWTPayload | NextResponse {
  const payload = verifyToken(request);

  if (!payload) {
    return NextResponse.json(
      { error: 'Unauthorized — please log in' },
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(payload.role)) {
    return NextResponse.json(
      { error: `Forbidden — requires one of: ${allowedRoles.join(', ')}` },
      { status: 403 }
    );
  }

  return payload;
}

// Creates a signed JWT for a user after login/register
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' });
}

// Attaches the token as an httpOnly cookie on a response
export function setTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set('aau_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clears the token cookie on logout
export function clearTokenCookie(response: NextResponse): void {
  response.cookies.set('aau_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}