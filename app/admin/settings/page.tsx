'use client';

import { useState } from 'react';
import { Plus, Edit2, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function SystemSettings() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Infrastructure' },
    { id: '2', name: 'Cleanliness' },
    { id: '3', name: 'IT' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      setCategories([...categories, { id: String(categories.length + 1), name: categoryName }]);
      setCategoryName('');
      setShowAddForm(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setShowEditForm(true);
  };

  const handleSubmitEdit = () => {
    if (categoryName.trim() && editingId) {
      setCategories(categories.map(c => 
        c.id === editingId ? { ...c, name: categoryName } : c
      ));
      setCategoryName('');
      setEditingId(null);
      setShowEditForm(false);
    }
  };

  const handleCancelEdit = () => {
    setCategoryName('');
    setEditingId(null);
    setShowEditForm(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">System Settings</h2>
          <p className="text-slate-600">Manage categories</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
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
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{category.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add Category</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">category name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setCategoryName('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditForm && editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit category</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">category name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
