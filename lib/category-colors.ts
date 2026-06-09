// lib/category-colors.ts — deterministic badge colors for dynamic categories
const COLOR_PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-cyan-100 text-cyan-700',
  'bg-purple-100 text-purple-700',
  'bg-red-100 text-red-700',
  'bg-yellow-100 text-yellow-700',
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-pink-100 text-pink-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
];

const FALLBACK = 'bg-gray-100 text-gray-700';

// Returns a stable Tailwind color class for a given category name.
// The same name always maps to the same color via a simple string hash.
export function getCategoryColor(category?: string): string {
  if (!category) return FALLBACK;
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash << 5) - hash + category.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}
