// app/api/issues/[id]/respond/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Issue from '@/lib/models/Issue';
import Notification from '@/lib/models/Notification';
import { enforceRole } from '@/lib/middleware/auth';

type Params = { params: { id: string } };

// POST /api/issues/:id/respond  — staff only (FR13 / UC-009)
export async function POST(request: NextRequest, { params }: Params) {
  const {id} = await params; // Ensure params is destructured to avoid unused variable error
  const auth = enforceRole(request, ['staff']);
  if (auth instanceof NextResponse) return auth;

  const { response: responseText } = await request.json();

  if (!responseText?.trim()) {
    return NextResponse.json(
      { error: 'Response text is required' },
      { status: 400 }
    );
  }

  await connectDB();

  const issue = await Issue.findById(id);
  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  // BR-8: staff can only respond to issues in their category
  if (auth.staffCategory && issue.category !== auth.staffCategory) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const newResponse = {
    staffId:   auth.userId,
    staffName: auth.name,
    response:  responseText.trim(),
    timestamp: new Date().toISOString(),
  };

  issue.responses.push(newResponse);
  await issue.save();

  // FR10 / UC-005: notify the student of the staff reply
  await Notification.create({
    type:        'staff_reply',
    issueId:     issue._id.toString(),
    issueTitle:  issue.title,
    message:     responseText.trim(),
    recipientId: issue.studentId,
    staffName:   auth.name,
    read:        false,
  });

  return NextResponse.json({
    message:  'Response added',
    response: newResponse,
  }, { status: 201 });
}