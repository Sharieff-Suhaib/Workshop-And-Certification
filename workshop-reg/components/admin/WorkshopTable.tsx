// workshop-reg/components/admin/WorkshopTable.tsx
'use client';

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

interface WorkshopTableProps {
  workshops: Workshop[];
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshopId: string) => void;
}

export default function WorkshopTable({
  workshops,
  onEdit,
  onDelete,
}: WorkshopTableProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 border-b border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Title</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Date</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Time</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Location</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop) => (
              <tr
                key={workshop.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4 text-white font-semibold">
                  {workshop.title}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {workshop.date ? new Date(workshop.date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {workshop.date ? new Date(workshop.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                {/* 
                  <td className="px-6 py-4 text-gray-400">
                  {workshop.time || '-'}
                </td>
                 */}
                
                <td className="px-6 py-4 text-gray-400">
                  {workshop.location || '-'}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {workshop.capacity || '-'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex">
                  <button
                    onClick={() => onEdit(workshop)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(workshop.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}