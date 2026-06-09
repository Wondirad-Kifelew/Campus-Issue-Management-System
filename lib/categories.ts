// lib/categories.ts — server-side helpers for category data
import { connectDB } from '@/lib/db';
import Category, { DEFAULT_CATEGORIES } from '@/lib/models/Category';

// Ensures the categories collection has the default seed data on first use.
export async function ensureCategoriesSeeded() {
  await connectDB();
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(
      DEFAULT_CATEGORIES.map((name) => ({ name, createdBy: 'system' }))
    );
  }
}

// Returns the list of valid category names from the database.
export async function getValidCategoryNames(): Promise<string[]> {
  await ensureCategoriesSeeded();
  const categories = await Category.find().select('name').lean();
  return categories.map((c) => c.name);
}
