// workshop-reg/src/app/admin/workshops/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAdminAuthStore } from '../../../../lib/store/adminAuthStore';
import CreateWorkshopModal from '../../../../components/admin/CreateWorkshopModal';
import EditWorkshopModal from '../../../../components/admin/EditWorkshopModal';
import WorkshopTable from '../../../../components/admin/WorkshopTable';

interface Workshop {
  id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  registrations?: number;
  createdAt: string;
}

export default function WorkshopsManagementPage() {
  const { user, token } = useAdminAuthStore();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshops();
  }, [token]);

  const fetchWorkshops = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/admin/workshops', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to fetch workshops (${response.status})`);
      }

      const data = await response.json();
      setWorkshops(data.data?.workshops || []);
    } catch (error: any) {
      console.error('Error fetching workshops:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (workshopId: string) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;

    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/admin/workshops/${workshopId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete workshop');

      setWorkshops(workshops.filter((w) => w.id !== workshopId));
      alert('Workshop deleted successfully');
    } catch (error: any) {
      console.error('Error deleting workshop:', error);
      alert('Failed to delete workshop');
    }
  };

  const filteredWorkshops = workshops.filter((workshop) =>
    workshop.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Workshop Management</h1>
            <p className="text-gray-400">Create, edit, and manage your workshops</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg transition font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Workshop
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 text-red-400 rounded-lg">
            Error: {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search workshops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-white" />
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <p className="text-gray-400 text-lg">No workshops found</p>
            <p className="text-gray-500 mt-1">Create a new workshop to get started</p>
          </div>
        ) : (
          <WorkshopTable
            workshops={filteredWorkshops}
            onEdit={setEditingWorkshop}
            onDelete={handleDelete}
          />
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateWorkshopModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchWorkshops();
            }}
            token={token!}
          />
        )}

        {editingWorkshop && (
          <EditWorkshopModal
            workshop={editingWorkshop}
            isOpen={!!editingWorkshop}
            onClose={() => setEditingWorkshop(null)}
            onSuccess={() => {
              setEditingWorkshop(null);
              fetchWorkshops();
            }}
            token={token!}
          />
        )}
      </div>
    </div>
  );
}