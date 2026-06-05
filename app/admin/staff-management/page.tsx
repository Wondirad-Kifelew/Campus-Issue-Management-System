'use client';

import { useState } from 'react';
import { Plus, Edit2, X } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  issueCategory: string;
  assignedIssues: number;
  status: 'Active' | 'Deactivated';
  dateJoined: string;
}

interface Category {
  id: string;
  name: string;
}

export default function StaffManagement() {
  const [categories] = useState<Category[]>([
    { id: '1', name: 'Infrastructure' },
    { id: '2', name: 'Cleanliness' },
    { id: '3', name: 'IT' },
  ]);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: '1', name: 'Alem Abebe', staffId: 'ST001', issueCategory: 'Canteen', assignedIssues: 8, status: 'Active', dateJoined: '2026-03-10' },
    { id: '2', name: 'Nahom Minas', staffId: 'ST002', issueCategory: 'Infrastructure', assignedIssues: 12, status: 'Deactivated', dateJoined: '2026-03-10' },
    { id: '3', name: 'Habtam Alemu', staffId: 'ST023', issueCategory: 'IT', assignedIssues: 2, status: 'Active', dateJoined: '2026-03-10' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    issueCategory: '',
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddStaff = () => {
    if (formData.name && formData.staffId && formData.issueCategory) {
      const newStaff: StaffMember = {
        id: String(staffMembers.length + 1),
        name: formData.name,
        staffId: formData.staffId,
        issueCategory: formData.issueCategory,
        assignedIssues: 0,
        status: 'Active',
        dateJoined: new Date().toISOString().split('T')[0],
      };
      setStaffMembers([...staffMembers, newStaff]);
      setFormData({ name: '', staffId: '', issueCategory: '' });
      setShowAddForm(false);
    }
  };

  const handleEditStaff = (staff: StaffMember) => {
    setEditingId(staff.id);
    setFormData({
      name: staff.name,
      staffId: staff.staffId,
      issueCategory: staff.issueCategory,
    });
    setShowEditForm(true);
  };

  const handleSubmitEdit = () => {
    if (formData.name && formData.staffId && formData.issueCategory && editingId) {
      setStaffMembers(staffMembers.map(s =>
        s.id === editingId
          ? { ...s, name: formData.name, staffId: formData.staffId, issueCategory: formData.issueCategory }
          : s
      ));
      setFormData({ name: '', staffId: '', issueCategory: '' });
      setEditingId(null);
      setShowEditForm(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', staffId: '', issueCategory: '' });
    setEditingId(null);
    setShowEditForm(false);
  };

  const handleToggleStatus = (id: string) => {
    setStaffMembers(staffMembers.map(s =>
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Deactivated' : 'Active' } : s
    ));
  };

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
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Staff ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Issue Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Assigned Issues</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Date Joined</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{staff.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{staff.staffId}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{staff.issueCategory}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{staff.assignedIssues}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{staff.dateJoined}</td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <button
                      onClick={() => handleEditStaff(staff)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(staff.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        staff.status === 'Active'
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {staff.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Member Modal */}
      {showEditForm && editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Staff Member</h3>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Staff ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => handleFormChange('staffId', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Category</label>
                <select
                  value={formData.issueCategory}
                  onChange={(e) => handleFormChange('issueCategory', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Staff ID</label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => handleFormChange('staffId', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Category</label>
                <select
                  value={formData.issueCategory}
                  onChange={(e) => handleFormChange('issueCategory', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', staffId: '', issueCategory: '' });
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
