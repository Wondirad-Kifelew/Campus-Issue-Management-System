// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { enforceRole, verifyToken } from '@/lib/middleware/auth';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';
import { ensureCategoriesSeeded } from '@/lib/categories';

// GET /api/categories — any authenticated user can read the category list
export async function GET(request: NextRequest) {
  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await ensureCategoriesSeeded();
  const categories = await Category.find().sort({ createdAt: 1 }).lean();

  return NextResponse.json({ categories });
}

// POST /api/categories — admin only, create a new category
export async function POST(request: NextRequest) {
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  const { name, description } = await request.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  await connectDB();
  await ensureCategoriesSeeded();

  // Case-insensitive duplicate check
  const existing = await Category.findOne({
    name: { $regex: `^${name.trim()}$`, $options: 'i' },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'A category with this name already exists' },
      { status: 409 }
    );
  }

  const category = await Category.create({
    name: name.trim(),
    description: description?.trim() || '',
    createdBy: auth.userId,
  });

  return NextResponse.json({ message: 'Category created', category }, { status: 201 });
}