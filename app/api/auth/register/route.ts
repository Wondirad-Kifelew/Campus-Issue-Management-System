// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, setTokenCookie } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, userId, password, role } = await request.json();

    if (!name || !userId || !password || !role) {
      return NextResponse.json(
        { error: 'name, userId, password, and role are required' },
        { status: 400 }
      );
    }

    // Admin accounts cannot be self-registered (NFR-3)
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts must be provisioned by a developer.' },
        { status: 403 }
      );
    }

    if (!['student', 'staff'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (role === 'student' && !/^[a-zA-Z]{3}\/\d{4}\/\d{2}$/.test(userId)){
      return NextResponse.json(
        { error: 'Student ID must be in the format ABC/1234/56' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ userId });
    if (existing) {
      return NextResponse.json(
        { error: 'A user with this ID already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      userId,
      password: hashedPassword,
      role,
      status: 'Active',
    });

    const token = signToken({
      id: newUser._id.toString(),
      userId: newUser.userId,
      name: newUser.name,
      role: newUser.role,
      staffCategory: newUser.staffCategory,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          userId: newUser.userId,
          role: newUser.role,
          staffCategory: newUser.staffCategory ?? null,
          registeredDate: newUser.registeredDate,
        },
      },
      { status: 201 }
    );

    setTokenCookie(response, token);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}