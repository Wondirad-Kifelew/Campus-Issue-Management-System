'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useIssue } from '@/lib/context';
import type { Category } from '@/lib/types';

export default function SystemSettings() {
  const { categories, addCategory, updateCategory, deleteCategory } = useIssue();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    setIsSubmitting(true);
    await addCategory(categoryName.trim(), categoryDescription.trim());
    setIsSubmitting(false);
    resetForm();
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setShowAddForm(false);
  };

  const handleSubmitEdit = async () => {
    if (!categoryName.trim() || !editingId) return;
    setIsSubmitting(true);
    await updateCategory(editingId, {
      name: categoryName.trim(),
      description: categoryDescription.trim(),
    });
    setIsSubmitting(false);
    resetForm();
  };

  const handleDelete = async (category: Category) => {
    if (confirm(`Delete the "${category.name}" category? This cannot be undone.`)) {
      await deleteCategory(category.id);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-600">Manage issue categories used across the system</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Category Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Description</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-slate-600">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {category.description || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartEdit(category)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddForm || editingId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Transportation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Short description of this category"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleSubmitEdit : handleAddCategory}
                disabled={isSubmitting || !categoryName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
