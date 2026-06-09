// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { enforceRole } from '@/lib/middleware/auth';
import type { IssueCategory } from '@/lib/types';

// GET /api/categories — admin only, return available categories
export async function GET(request: NextRequest) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  const validCategories: IssueCategory[] = [
    'Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others',
  ];

  return NextResponse.json({ categories: validCategories });
}
