// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { enforceRole } from '@/lib/middleware/auth';

// GET /api/notifications  — students only (FR10)
// Returns notifications belonging to the authenticated student
export async function GET(request: NextRequest) {
  
  const auth = enforceRole(request, ['student']);
  
  if (auth instanceof NextResponse) return auth;
  await connectDB();
  const notifications = await Notification.find({ recipientId: auth.userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ notifications });
}

// PATCH /api/notifications — mark all non-reply notifications as read
export async function PATCH(request: NextRequest) {
  const auth = enforceRole(request, ['student']);
console.log('Auth:', auth);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const result = await Notification.updateMany(
    {
      recipientId: auth.userId,
      type: { $ne: 'staff_reply' },
      read: false,
    },
    { $set: { read: true } }
  );

  return NextResponse.json({
    message: 'All non-reply notifications marked as read',
    modifiedCount: result.modifiedCount,
  });
}