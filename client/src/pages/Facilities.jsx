import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  MapPin,
  Users,
  Eye,
  Edit,
  Trash2,
  ClipboardCheck,
  CheckCircle2,
} from 'lucide-react';
import { facilityService, userService } from '../services/appServices';
import { useAuth } from '../context/AuthContext';
import { getStatusBadge, formatDate } from '../utils/formatters';
import Modal from '../components/Modal';

const Facilities = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { searchQuery: globalSearch } = useOutletContext() || {};

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState(globalSearch || '');

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    facilityType: 'Educational Institution',
    address: '',
    city: '',
    state: '',
    pincode: '',
    manager: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    numberOfOccupants: 500,
    description: '',
  });

  useEffect(() => {
    fetchFacilities();
    fetchUsers();
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await facilityService.getFacilities({
        status: statusFilter,
        facilityType: typeFilter,
      });
      setFacilities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await userService.getUsers();
      setManagers(users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      facilityType: 'Educational Institution',
      address: '',
      city: '',
      state: '',
      pincode: '',
      manager: managers[0]?._id || '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      numberOfOccupants: 500,
      description: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (fac) => {
    setEditingId(fac._id);
    setFormData({
      name: fac.name,
      facilityType: fac.facilityType,
      address: fac.location?.address || '',
      city: fac.location?.city || '',
      state: fac.location?.state || '',
      pincode: fac.location?.pincode || '',
      manager: fac.manager?._id || '',
      contactPerson: fac.contact?.person || '',
      contactEmail: fac.contact?.email || '',
      contactPhone: fac.contact?.phone || '',
      numberOfOccupants: fac.numberOfOccupants || 0,
      description: fac.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility record?')) {
      try {
        await facilityService.deleteFacility(id);
        fetchFacilities();
      } catch (err) {
        alert('Failed to delete facility');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      facilityType: formData.facilityType,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      manager: formData.manager || null,
      contact: {
        person: formData.contactPerson,
        email: formData.contactEmail,
        phone: formData.contactPhone,
      },
      numberOfOccupants: Number(formData.numberOfOccupants),
      description: formData.description,
    };

    try {
      if (editingId) {
        await facilityService.updateFacility(editingId, payload);
      } else {
        await facilityService.createFacility(payload);
      }
      setShowModal(false);
      fetchFacilities();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving facility');
    }
  };

  const filteredFacilities = facilities.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.facilityId.toLowerCase().includes(q) ||
      f.location?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Facility Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Register, monitor, and audit compliance across institutions</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Facility
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search facility name, ID, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All Statuses</option>
            <option value="Excellent">Excellent (90%+)</option>
            <option value="Compliant">Compliant (75-89%)</option>
            <option value="Needs Improvement">Needs Improvement (50-74%)</option>
            <option value="Non-Compliant">Non-Compliant (&lt;50%)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="">All Facility Types</option>
            <option value="Educational Institution">Educational Institution</option>
            <option value="Government Office">Government Office</option>
            <option value="Commercial & Industrial">Commercial & Industrial</option>
            <option value="Public Facility">Public Facility</option>
            <option value="Healthcare Facility">Healthcare Facility</option>
          </select>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Facilities Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting search criteria or add a new facility.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {fac.facilityId}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadge(fac.status)}`}>
                    {fac.status}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-1">{fac.name}</h3>
                <p className="text-xs font-medium text-emerald-600 mt-0.5">{fac.facilityType}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{fac.location?.city}, {fac.location?.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{fac.numberOfOccupants || 0} Occupants / Staff</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">Compliance Index</span>
                    <span className="font-extrabold text-emerald-700">{fac.complianceScore || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        fac.complianceScore >= 90
                          ? 'bg-emerald-500'
                          : fac.complianceScore >= 75
                          ? 'bg-blue-500'
                          : fac.complianceScore >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${fac.complianceScore || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <button
                  onClick={() => navigate(`/facilities/${fac._id}`)}
                  className="text-slate-700 hover:text-emerald-700 flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> Profile
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/inspections/new?facility=${fac._id}`)}
                    className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <ClipboardCheck className="w-4 h-4" /> Inspect
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <button onClick={() => handleOpenEditModal(fac)} className="text-slate-500 hover:text-slate-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(fac._id)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Facility Name</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">City</th>
                <th className="py-3.5 px-6">Manager</th>
                <th className="py-3.5 px-6">Score</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredFacilities.map((fac) => (
                <tr key={fac._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-600">{fac.facilityId}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{fac.name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{fac.facilityType}</td>
                  <td className="py-3.5 px-6 text-slate-600">{fac.location?.city}</td>
                  <td className="py-3.5 px-6 text-slate-600">{fac.manager?.name || 'Unassigned'}</td>
                  <td className="py-3.5 px-6 font-extrabold text-emerald-700">{fac.complianceScore || 0}%</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadge(fac.status)}`}>
                      {fac.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/facilities/${fac._id}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/inspections/new?facility=${fac._id}`)}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Facility Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Facility Record' : 'Register New Facility'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facility Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Green Valley College Campus"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facility Type *</label>
              <select
                value={formData.facilityType}
                onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Educational Institution">Educational Institution</option>
                <option value="Government Office">Government Office</option>
                <option value="Public Facility">Public Facility</option>
                <option value="Healthcare Facility">Healthcare Facility</option>
                <option value="Commercial & Industrial">Commercial & Industrial</option>
                <option value="Residential Campus">Residential Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assign Manager</label>
              <select
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address or Sector"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Number of Occupants</label>
              <input
                type="number"
                value={formData.numberOfOccupants}
                onChange={(e) => setFormData({ ...formData, numberOfOccupants: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="contact@facility.com"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Save Facility
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Facilities;
