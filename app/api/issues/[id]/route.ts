// app/api/issues/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Issue from '@/lib/models/Issue';
import Notification from '@/lib/models/Notification';
import { enforceRole, verifyToken } from '@/lib/middleware/auth';
import type { IssueCategory } from '@/lib/types';

// type Params = { params: { id: string } };
type Params = { params: Promise<{ id: string }> };


// GET /api/issues/:id  — any authenticated users
export async function GET(request: NextRequest, { params }: Params) {
    const { id } = await params;

  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const issue = await Issue.findById(id).lean();

  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  // BR-8: staff can only view issues in their category
  if (payload.role === 'staff' && payload.staffCategory) {
    if (issue.category !== payload.staffCategory) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.json({ issue });
}

// PATCH /api/issues/:id
// - Student: edit title/description/category (BR-2, BR-3: only own, only Pending)
// - Staff:   update status (FR12)
// - Admin:   unrestricted updates
export async function PATCH(request: NextRequest, { params }: Params) {
  
  const { id } = await params;
  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
 
  const issue = await Issue.findById(id);

  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  const body = await request.json();

  if (payload.role === 'student') {
    // BR-2: students can only edit their own issues
    if (issue.studentId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden: not your issue' }, { status: 403 });
    }
    // BR-3: can only edit while Pending
    if (issue.status !== 'Pending') {
      return NextResponse.json(
        { error: 'Issues can only be edited while in Pending status' },
        { status: 403 }
      );
    }

    const validCategories: IssueCategory[] = [
      'Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others',
    ];

    if (body.title !== undefined)       issue.title       = body.title.trim();
    if (body.description !== undefined) issue.description = body.description.trim();
    if (body.category !== undefined) {
      if (!validCategories.includes(body.category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      issue.category = body.category;
    }

  } else if (payload.role === 'staff') {
    // BR-8: staff can only update issues in their category
    if (payload.staffCategory && issue.category !== payload.staffCategory) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (body.status !== undefined) {
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      const previousStatus = issue.status;
      issue.status = body.status;

      // FR10 / UC-005: send notification to student when status changes
      if (body.status !== previousStatus) {
        const notifMessage =
          body.status === 'Resolved' ? 'has been resolved' : `is now ${body.status.toLowerCase()}`;

        await Notification.create({
          type:        body.status === 'Resolved' ? 'issue_resolved' : 'status_update',
          issueId:     issue._id.toString(),
          issueTitle:  issue.title,
          message:     notifMessage,
          recipientId: issue.studentId,
          read:        false,
        });
      }
    }

  } else if (payload.role === 'admin') {
    // Admin can change anything
    if (body.title !== undefined)       issue.title       = body.title;
    if (body.description !== undefined) issue.description = body.description;
    if (body.category !== undefined)    issue.category    = body.category;
    if (body.status !== undefined)      issue.status      = body.status;
  }

  await issue.save();
  return NextResponse.json({ message: 'Issue updated', issue });
}

// DELETE /api/issues/:id  — student (own + Pending only) or admin
export async function DELETE(request: NextRequest, { params }: Params) {
    const { id } = await params;

  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const issue = await Issue.findById(id);

  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  if (payload.role === 'student') {
    // BR-2: own issues only
    if (issue.studentId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden: not your issue' }, { status: 403 });
    }
    // BR-3: only while Pending
    if (issue.status !== 'Pending') {
      return NextResponse.json(
        { error: 'Issues can only be deleted while in Pending status' },
        { status: 403 }
      );
    }
  } else if (payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await issue.deleteOne();
  return NextResponse.json({ message: 'Issue deleted' });
}