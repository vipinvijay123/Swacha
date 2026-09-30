import React, { useEffect, useState } from 'react';
import { Users as UsersIcon, Plus, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { userService, facilityService } from '../services/appServices';
import Modal from '../components/Modal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'inspector',
    phone: '',
    status: 'active',
    assignedFacility: '',
  });

  useEffect(() => {
    fetchUsers();
    fetchFacilities();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const data = await facilityService.getFacilities();
      setFacilities(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'inspector',
      phone: '',
      status: 'active',
      assignedFacility: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditingId(u._id);
    setFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      phone: u.phone || '',
      status: u.status || 'active',
      assignedFacility: u.assignedFacility?._id || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove user account?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userService.updateUser(editingId, formData);
      } else {
        await userService.createUser(formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">User Role Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage system administrators, inspectors, and facility managers</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add User Account
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center animate-pulse text-slate-400">Loading user accounts...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase border-b border-slate-200/60">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Assigned Facility</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                        u.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : u.role === 'inspector'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {u.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{u.assignedFacility?.name || 'All Facilities'}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(u)} className="text-slate-500 hover:text-slate-800 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password {editingId ? '(Leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              required={!editingId}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">User Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="admin">Admin</option>
                <option value="inspector">Inspector</option>
                <option value="facility_manager">Facility Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Facility</label>
            <select
              value={formData.assignedFacility}
              onChange={(e) => setFormData({ ...formData, assignedFacility: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="">All / Unassigned</option>
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
              Save User Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
