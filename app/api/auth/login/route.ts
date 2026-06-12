// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, setTokenCookie } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, password, role } = await request.json();

    if (!userId || !password || !role) {
      return NextResponse.json(
        { error: 'userId, password, and role are required' },
        { status: 400 }
      );
    }
     if (role === 'student' && !/^[a-zA-Z]{3}\/\d{4}\/\d{2}$/.test(userId)){
      return NextResponse.json(
        { error: 'Student ID must be in the format ABC/1234/56' },
        { status: 400 }
      );
    }
    await connectDB();

    const user = await User.findOne({ userId, role });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.status === 'Deactivated') {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Contact an administrator.' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      id: user._id.toString(),
      userId: user.userId,
      name: user.name,
      role: user.role,
      staffCategory: user.staffCategory,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        userId: user.userId,
        role: user.role,
        staffCategory: user.staffCategory ?? null,
        registeredDate: user.registeredDate,
      },
    });

    setTokenCookie(response, token);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}