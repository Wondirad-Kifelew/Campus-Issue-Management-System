// app/api/issues/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Issue from '@/lib/models/Issue';
import Notification from '@/lib/models/Notification';
import { enforceRole, verifyToken } from '@/lib/middleware/auth';
import { getValidCategoryNames } from '@/lib/categories';
import type { IssueCategory, IssueStatus } from '@/lib/types';

const URGENCY_THRESHOLD = 10;

// GET /api/issues
// - Students: all issues (for All Issues page)
// - Staff:    only issues matching their staffCategory
// - Admin:    all issues
export async function GET(request: NextRequest) {
  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as IssueCategory | null;
  const status   = searchParams.get('status')   as IssueStatus   | null;
  const sortBy   = searchParams.get('sortBy');   // 'newest' | 'most-agreed'

  // Build filter
  const filter: Record<string, unknown> = {};

  if (payload.role === 'staff') {
    // BR-8: staff can only see issues in their category
    if (payload.staffCategory) {
      filter.category = payload.staffCategory;
    }
  } else if (category) {
    filter.category = category;
  }

  if (status) filter.status = status;

  // Build sort
  const sort: Record<string, 1 | -1> =
    sortBy === 'most-agreed'
      ? { agreementCount: -1 }
      : { submittedDate: -1, createdAt: -1 };

  const issues = await Issue.find(filter).sort(sort).lean();

  return NextResponse.json({ issues });
}

// POST /api/issues  — students only (FR5)
export async function POST(request: NextRequest) {
  const auth = enforceRole(request, ['student']);
  if (auth instanceof NextResponse) return auth;

  const { title, description, category } = await request.json();

  if (!title?.trim() || !description?.trim() || !category) {
    return NextResponse.json(
      { error: 'title, description, and category are required' },
      { status: 400 }
    );
  }

  await connectDB();

  const validCategories = await getValidCategoryNames();
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const issue = await Issue.create({
    title:         title.trim(),
    description:   description.trim(),
    category,
    status:        'Pending',
    studentId:     auth.userId,
    studentName:   auth.name,
    agreementCount: 0,
    agreedBy:       [],
    isUrgent:       false,
  });

  return NextResponse.json({ message: 'Issue submitted', issue }, { status: 201 });
}
