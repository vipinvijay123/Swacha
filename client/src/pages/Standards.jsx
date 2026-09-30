import React, { useEffect, useState } from 'react';
import { Award, Plus, Filter, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { standardService } from '../services/appServices';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

const Standards = () => {
  const { user } = useAuth();
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    category: 'Cleanliness & Hygiene',
    criterion: '',
    description: '',
    maximumScore: 2,
    active: true,
  });

  const categories = [
    'Cleanliness & Hygiene',
    'Waste Management',
    'Water Management',
    'Energy Management',
    'Green Environment',
    'Sanitation',
    'Awareness & Sustainability',
  ];

  useEffect(() => {
    fetchStandards();
  }, [activeCategory]);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const data = await standardService.getStandards({ category: activeCategory });
      setStandards(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: '',
      category: activeCategory || 'Cleanliness & Hygiene',
      criterion: '',
      description: '',
      maximumScore: 2,
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (std) => {
    setEditingId(std._id);
    setFormData({
      code: std.code,
      category: std.category,
      criterion: std.criterion,
      description: std.description,
      maximumScore: std.maximumScore,
      active: std.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this compliance standard?')) {
      try {
        await standardService.deleteStandard(id);
        fetchStandards();
      } catch (err) {
        alert('Failed to delete standard');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await standardService.updateStandard(editingId, formData);
      } else {
        await standardService.createStandard(formData);
      }
      setShowModal(false);
      fetchStandards();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save standard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Compliance Standards Framework</h1>
          <p className="text-xs text-slate-500 mt-1">Official guidelines across the 7 Swachhta & Green evaluation categories</p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Standard Criterion
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 gap-2 text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            activeCategory === '' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Categories ({standards.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Standards List */}
      {loading ? (
        <div className="p-8 text-center animate-pulse text-slate-400">Loading standards framework...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standards.map((std) => (
            <div
              key={std._id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {std.code}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{std.category}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">{std.criterion}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{std.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Max Points: {std.maximumScore}</span>
                {user?.role === 'admin' && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(std)} className="text-slate-500 hover:text-slate-800 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(std._id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Standard' : 'Add Compliance Standard'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Standard Code</label>
            <input
              type="text"
              placeholder="e.g. STD-105"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Criterion Title *</label>
            <input
              type="text"
              required
              value={formData.criterion}
              onChange={(e) => setFormData({ ...formData, criterion: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
              Save Standard
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Standards;
