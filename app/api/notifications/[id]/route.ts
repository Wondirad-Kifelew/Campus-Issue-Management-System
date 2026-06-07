// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { enforceRole } from '@/lib/middleware/auth';

type Params = { params: { id: string } };

// PATCH /api/notifications/:id  — mark a notification as read
export async function PATCH(request: NextRequest, { params }: Params) {
  const {id} = await params; 
  const auth = enforceRole(request, ['student']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const notification = await Notification.findById(id);

  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  // Ensure the notification belongs to the requesting student
  if (notification.recipientId !== auth.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  notification.read = true;
  await notification.save();

  return NextResponse.json({ message: 'Notification marked as read', notification });
}