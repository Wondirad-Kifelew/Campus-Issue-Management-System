// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { enforceRole } from '@/lib/middleware/auth';
import type { IssueCategory } from '@/lib/types';

type Params = { params: { id: string } };

// GET /api/users/:id  — admin only
export async function GET(request: NextRequest, { params }: Params) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const user = await User.findById(params.id).select('-password').lean();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH /api/users/:id  — admin updates user details or status (FR15, FR16, FR17)
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const user = await User.findById(params.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const body = await request.json();

  if (body.name !== undefined)   user.name   = body.name.trim();

  if (body.status !== undefined) {
    if (!['Active', 'Deactivated'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }
    user.status = body.status;
  }

  // FR17: admin can reassign the category of a staff member
  if (body.staffCategory !== undefined && user.role === 'staff') {
    const validCategories: IssueCategory[] = [
      'Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others',
    ];
    if (!validCategories.includes(body.staffCategory)) {
      return NextResponse.json({ error: 'Invalid staffCategory' }, { status: 400 });
    }
    user.staffCategory = body.staffCategory;
  }

  // Optionally reset password
  if (body.password !== undefined) {
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    user.password = await bcrypt.hash(body.password, 12);
  }

  await user.save();

  return NextResponse.json({
    message: 'User updated',
    user: {
      id:             user._id.toString(),
      name:           user.name,
      userId:         user.userId,
      role:           user.role,
      staffCategory:  user.staffCategory ?? null,
      status:         user.status,
      registeredDate: user.registeredDate,
    },
  });
}

// DELETE /api/users/:id  — admin only (hard-delete; use PATCH status=Deactivated for soft)
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const user = await User.findById(params.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  await user.deleteOne();
  return NextResponse.json({ message: 'User deleted' });
}