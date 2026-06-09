'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { IssueCategory } from '@/lib/types';

export default function SystemSettings() {
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('[v0] Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      toast.info('Categories are system-defined and cannot be modified. Current categories: Infrastructure, Cleanliness, Technology, Safety, Cafeteria, Others');
      setCategoryName('');
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (category: IssueCategory) => {
    setEditingId(category);
    setCategoryName(category);
    setShowEditForm(true);
  };

  const handleSubmitEdit = () => {
    toast.info('Categories are system-defined and cannot be modified.');
    setCategoryName('');
    setEditingId(null);
    setShowEditForm(false);
  };

  const handleCancelEdit = () => {
    setCategoryName('');
    setEditingId(null);
    setShowEditForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-600">View system-defined issue categories</p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Category Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-center text-slate-600">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{category}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
