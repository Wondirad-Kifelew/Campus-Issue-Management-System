// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { enforceRole } from '@/lib/middleware/auth';

// GET /api/notifications  — students only (FR10)
// Returns notifications belonging to the authenticated student
export async function GET(request: NextRequest) {
  
  const auth = enforceRole(request, ['staff']);
  
  if (auth instanceof NextResponse) return auth;
  await connectDB();
  const notifications = await Notification.find({ recipientId: auth.userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ notifications });
}