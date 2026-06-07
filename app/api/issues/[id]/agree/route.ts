// app/api/issues/[id]/agree/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Issue from '@/lib/models/Issue';
import { enforceRole } from '@/lib/middleware/auth';

const URGENCY_THRESHOLD = 10; // BR-5: auto-elevate priority

type Params = { params: { id: string } };

// POST /api/issues/:id/agree  — students only (FR9 / BR-4)
export async function POST(request: NextRequest, context:any) {
  const params = await context.params;
  const id = params.id;
  console.log('id from context:', id);
 
  const auth = enforceRole(request, ['student']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  console.log('Connected to DB, looking for issue with id:', id);
  const issue = await Issue.findById(id);
  console.log('Issue found:', issue, 'id:', id); // params.id is undefined
  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  const alreadyAgreed = issue.agreedBy.includes(auth.userId);

  if (alreadyAgreed) {
    // Toggle off — remove agreement (BR-4: only once, so toggling is the "undo")
    issue.agreedBy      = issue.agreedBy.filter((id: string) => id !== auth.userId);
    issue.agreementCount = Math.max(0, issue.agreementCount - 1);
  } else {
    // Add agreement
    issue.agreedBy.push(auth.userId);
    issue.agreementCount += 1;
  }

  // BR-5: auto-elevate urgency flag when threshold is crossed
  issue.isUrgent = issue.agreementCount >= URGENCY_THRESHOLD;

  await issue.save();
  return NextResponse.json({
    issue
  });
}