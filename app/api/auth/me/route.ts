// [INTEGRATED] GET /api/auth/me
// Endpoint to check if user is authenticated and return current user data
// Used for session persistence on page refresh

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token from httpOnly cookie
    const payload = verifyToken(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user from database to get latest data
    await connectDB();
    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        userId: user.userId,
        role: user.role,
        staffCategory: user.staffCategory ?? null,
        registeredDate: user.registeredDate,
      },
    });
  } catch (error) {
    console.error('[INTEGRATED] /me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
