'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, X } from 'lucide-react';
import { useAdmin } from '@/lib/context';
import { User } from '@/lib/types';

const VALID_CATEGORIES = ['Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others'];

export default function StaffManagement() {
  const { users, isLoadingUsers, fetchUsers, addUser, updateUser, deleteUser } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    staffCategory: '',
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    staffCategory: '',
  });

  useEffect(() => {
    fetchUsers('staff');
  }, [fetchUsers]);

  const staffMembers = users.filter(u => u.role === 'staff');

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddStaff = async () => {
    if (formData.name && formData.userId && formData.password && formData.staffCategory) {
      await addUser(formData.name, formData.userId, formData.password, 'staff', formData.staffCategory);
      setFormData({ name: '', userId: '', password: '', staffCategory: '' });
      setShowAddForm(false);
    }
  };

  const handleEditStaff = (staff: User) => {
    setEditingId(staff.id);
    setEditFormData({
      name: staff.name,
      staffCategory: staff.staffCategory || '',
    });
    setShowEditForm(true);
  };

  const handleSubmitEdit = async () => {
    if (formData.name && formData.staffCategory && editingId) {
      await updateUser(editingId, {
        name: editFormData.name,
        staffCategory: editFormData.staffCategory,
      });
      setEditFormData({ name: '', staffCategory: '' });
      setEditingId(null);
      setShowEditForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({ name: '', staffCategory: '' });
    setEditingId(null);
    setShowEditForm(false);
  };

  const handleToggleStatus = async (staff: User) => {
    const newStatus = staff.id ? 'Deactivated' : 'Active';
    await updateUser(staff.id, { status: newStatus });
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Staff Management</h2>
          <p className="text-slate-600">Manage staff accounts and assignments</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add staff member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Issue Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Date Registered</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-slate-600">
                    No staff members yet
                  </td>
                </tr>
              ) : (
                staffMembers.map((staff) => (
                  <tr key={staff.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{staff.userId}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{staff.staffCategory || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        staff.id && staff.id.length > 0
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{staff.registeredDate}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEditStaff(staff)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className="px-3 py-1 rounded text-xs font-medium transition-colors bg-red-100 hover:bg-red-200 text-red-700"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Member Modal */}
      {showEditForm && editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Staff Member</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Category</label>
                <select
                  value={editFormData.staffCategory}
                  onChange={(e) => setEditFormData({...editFormData, staffCategory: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Member Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add Staff Member</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={formData.userId}
                  onChange={(e) => handleFormChange('userId', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="User ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleFormChange('password', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Category</label>
                <select
                  value={formData.staffCategory}
                  onChange={(e) => handleFormChange('staffCategory', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', userId: '', password: '', staffCategory: '' });
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
