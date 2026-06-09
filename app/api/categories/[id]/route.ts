// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { enforceRole } from '@/lib/middleware/auth';
import { connectDB } from '@/lib/db';
import Category from '@/lib/models/Category';
import Issue from '@/lib/models/Issue';
import User from '@/lib/models/User';

type Params = { params: Promise<{ id: string }> };

// PATCH /api/categories/:id — admin only, rename / edit a category
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  const { name, description } = await request.json();

  if (description !== undefined) {
    category.description = description.trim();
  }

  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Case-insensitive duplicate check (excluding this category)
    const existing = await Category.findOne({
      _id: { $ne: category._id },
      name: { $regex: `^${trimmed}$`, $options: 'i' },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    const oldName = category.name;
    category.name = trimmed;

    // Cascade the rename so existing issues and staff stay consistent
    if (oldName !== trimmed) {
      await Issue.updateMany({ category: oldName }, { category: trimmed });
      await User.updateMany({ staffCategory: oldName }, { staffCategory: trimmed });
    }
  }

  await category.save();

  return NextResponse.json({ message: 'Category updated', category });
}

// DELETE /api/categories/:id — admin only
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = enforceRole(request, ['admin']);
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const category = await Category.findById(id);
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  // Prevent deleting a category that is still in use
  const issueCount = await Issue.countDocuments({ category: category.name });
  const staffCount = await User.countDocuments({ staffCategory: category.name });
  if (issueCount > 0 || staffCount > 0) {
    return NextResponse.json(
      {
        error:
          'Cannot delete a category that is in use by existing issues or staff. Reassign them first.',
      },
      { status: 409 }
    );
  }

  await category.deleteOne();
  return NextResponse.json({ message: 'Category deleted' });
}
