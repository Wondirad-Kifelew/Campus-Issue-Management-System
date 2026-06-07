// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { enforceRole } from '@/lib/middleware/auth';
import type { IssueCategory } from '@/lib/types';

// GET /api/users  — admin only (FR15, FR16)
// Optional query params: role=student|staff|admin
export async function GET(request: NextRequest) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select('-password')
    .sort({ registeredDate: -1 })
    .lean();

  return NextResponse.json({ users });
}

// POST /api/users  — admin creates a new staff or student account (FR15, FR16)
export async function POST(request: NextRequest) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  const { name, userId, password, role, staffCategory } = await request.json();

  if (!name || !userId || !password || !role) {
    return NextResponse.json(
      { error: 'name, userId, password, and role are required' },
      { status: 400 }
    );
  }

  if (!['student', 'staff', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  // Staff must have a category assigned (FR17 / BR-6)
  if (role === 'staff') {
    const validCategories: IssueCategory[] = [
      'Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others',
    ];
    if (!staffCategory || !validCategories.includes(staffCategory)) {
      return NextResponse.json(
        { error: 'A valid staffCategory is required for staff accounts' },
        { status: 400 }
      );
    }
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

  const user = await User.create({
    name,
    userId,
    password: hashedPassword,
    role,
    staffCategory: role === 'staff' ? staffCategory : undefined,
    status: 'Active',
  });

  return NextResponse.json(
    {
      message: 'User created',
      user: {
        id:             user._id.toString(),
        name:           user.name,
        userId:         user.userId,
        role:           user.role,
        staffCategory:  user.staffCategory ?? null,
        status:         user.status,
        registeredDate: user.registeredDate,
      },
    },
    { status: 201 }
  );
}