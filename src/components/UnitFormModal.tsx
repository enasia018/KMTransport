'use client';

import { useState } from 'react';
import { X, Car, Save } from 'lucide-react';
import { Unit } from '@/lib/types';

interface UnitFormModalProps {
  memberId: string;
  initialUnit?: Unit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UnitFormModal({
  memberId,
  initialUnit,
  isOpen,
  onClose,
  onSuccess,
}: UnitFormModalProps) {
  const isEditing = Boolean(initialUnit);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    unit_name: initialUnit?.unit_name || 'Toyota HiAce Commuter Deluxe',
    plate_number: initialUnit?.plate_number || '',
    model_year: initialUnit?.model_year || '2024',
    color: initialUnit?.color || 'White',
    engine_number: initialUnit?.engine_number || '',
    chassis_number: initialUnit?.chassis_number || '',
    seating_capacity: initialUnit?.seating_capacity || 15,
    franchise_case_number: initialUnit?.franchise_case_number || '',
    route_details: initialUnit?.route_details || 'Metro Manila to any point of Luzon / Tourist Charter',
    status: initialUnit?.status || 'Active',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/units/${initialUnit?.id}` : '/api/units';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          member_id: memberId,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save unit');
      }
    } catch (err) {
      alert('Error saving unit information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900 text-base">
              {isEditing ? 'Edit Van / Unit Information' : 'Add New Van / Unit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name of Unit / Van Model *
              </label>
              <input
                type="text"
                required
                list="van-models-modal"
                placeholder="e.g. Toyota HiAce Grandia GL"
                value={formData.unit_name}
                onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
              <datalist id="van-models-modal">
                <option value="Toyota HiAce GL Grandia" />
                <option value="Toyota HiAce Commuter Deluxe" />
                <option value="Toyota HiAce Super Grandia" />
                <option value="Nissan NV350 Urvan Premium" />
                <option value="Nissan NV350 Urvan Standard" />
                <option value="Hyundai Starex Royale" />
                <option value="Foton View Transvan" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plate Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NDO 4821"
                value={formData.plate_number}
                onChange={(e) =>
                  setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Under Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Model Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2024"
                value={formData.model_year}
                onChange={(e) => setFormData({ ...formData, model_year: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Color
              </label>
              <input
                type="text"
                placeholder="e.g. Silver Metallic"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                min="4"
                max="30"
                value={formData.seating_capacity}
                onChange={(e) =>
                  setFormData({ ...formData, seating_capacity: parseInt(e.target.value) || 14 })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Franchise Case No.
              </label>
              <input
                type="text"
                placeholder="e.g. LTFRB-NCR-2024-XXXX"
                value={formData.franchise_case_number}
                onChange={(e) =>
                  setFormData({ ...formData, franchise_case_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Route / Charter Scope
              </label>
              <input
                type="text"
                placeholder="e.g. Metro Manila to Any Point of Luzon"
                value={formData.route_details}
                onChange={(e) => setFormData({ ...formData, route_details: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
