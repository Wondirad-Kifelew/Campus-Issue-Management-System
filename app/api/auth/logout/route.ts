// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/middleware/auth';

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  clearTokenCookie(response);
  return response;
}