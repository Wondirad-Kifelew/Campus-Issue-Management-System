'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, X, Check } from 'lucide-react';
import { useAdmin } from '@/lib/context';
import { User } from '@/lib/types';

export default function StudentManagement() {
  const { users, isLoadingUsers, fetchUsers, addUser, updateUser, deleteUser } = useAdmin();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    userId: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers('student');
  }, [fetchUsers]);

  const students = users.filter(u => u.role === 'student');

  const handleEdit = (student: User) => {
    setEditingId(student.id);
    setEditName(student.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleSubmitEdit = async (id: string) => {
    await updateUser(id, { name: editName });
    setEditingId(null);
    setEditName('');
  };

  const handleToggleStatus = async (student: User) => {
    const newStatus = student.id ? 'Deactivated' : 'Active';
    await updateUser(student.id, { status: newStatus });
  };

  const handleAddStudent = async () => {
    if (addFormData.name.trim() && addFormData.userId.trim() && addFormData.password.trim()) {
      await addUser(addFormData.name, addFormData.userId, addFormData.password, 'student');
      setAddFormData({ name: '', userId: '', password: '' });
      setShowAddForm(false);
    }
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Student Management</h2>
          <p className="text-slate-600">Manage student accounts</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Date Registered</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-slate-600">
                    No students yet
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{student.userId}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{student.registeredDate}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEdit(student)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(student)}
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

      {/* Add Student Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add Student</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={addFormData.userId}
                  onChange={(e) => setAddFormData({ ...addFormData, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="User ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setAddFormData({ name: '', userId: '', password: '' });
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Edit Student</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                onClick={() => handleSubmitEdit(editingId)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Submit changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
