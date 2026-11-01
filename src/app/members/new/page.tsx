'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  UserPlus,
  Car,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Member Form State
  const [formData, setFormData] = useState({
    member_code: `KM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    first_name: '',
    middle_name: '',
    last_name: '',
    contact_number: '',
    address: '',
    email: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    status: 'Active',
    join_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  // Optional Unit state
  const [includeUnit, setIncludeUnit] = useState(true);
  const [unitData, setUnitData] = useState({
    unit_name: 'Toyota HiAce Commuter Deluxe',
    plate_number: '',
    model_year: new Date().getFullYear().toString(),
    color: 'White',
    seating_capacity: 15,
    franchise_case_number: '',
    route_details: 'Metro Manila to any point of Luzon / Tourist Charter',
    status: 'Active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create Member
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create member');
      }

      const createdMember = await res.json();

      // 2. If Unit details provided, create the unit
      if (includeUnit && unitData.plate_number.trim()) {
        await fetch('/api/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...unitData,
            member_id: createdMember.id,
          }),
        });
      }

      router.push(`/members/${createdMember.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <Link
          href="/members"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Register New Member
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            KM Tourist Franchise Operator & Van Affiliation
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Member Personal Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserPlus className="w-5 h-5 text-sky-600" />
            <h2 className="font-semibold text-slate-900 text-base">
              Member Personal & Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Franchise Code / ID *
              </label>
              <input
                type="text"
                required
                value={formData.member_code}
                onChange={(e) => setFormData({ ...formData, member_code: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Membership Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending Review</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affiliation / Joined Date *
              </label>
              <input
                type="date"
                required
                value={formData.join_date}
                onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Juan"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="e.g. Santos"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dela Cruz"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cellphone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 0917-123-4567"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. juan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Residential Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Block 15 Lot 2, Phase 2, San Roque, Quezon City"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact Person
              </label>
              <input
                type="text"
                placeholder="e.g. Maria Dela Cruz (Spouse)"
                value={formData.emergency_contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact Cellphone
              </label>
              <input
                type="tel"
                placeholder="e.g. 0918-987-6543"
                value={formData.emergency_contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, emergency_contact_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Member Notes / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Tourist van charter operator, specializes in Baguio and Ilocos routes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Section 2: Unit / Van Details (Optional checkbox) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-slate-900 text-base">
                Assigned Unit / Van Information
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={includeUnit}
                onChange={(e) => setIncludeUnit(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              Register Unit Now
            </label>
          </div>

          {includeUnit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Name of Unit / Van Model *
                  </label>
                  <input
                    type="text"
                    required={includeUnit}
                    list="van-models"
                    placeholder="e.g. Toyota HiAce Grandia GL"
                    value={unitData.unit_name}
                    onChange={(e) => setUnitData({ ...unitData, unit_name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                  />
                  <datalist id="van-models">
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
                    Plate Number / Conduction Sticker *
                  </label>
                  <input
                    type="text"
                    required={includeUnit}
                    placeholder="e.g. NAA 1234 or MV-FILE-1234"
                    value={unitData.plate_number}
                    onChange={(e) =>
                      setUnitData({ ...unitData, plate_number: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Model Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={unitData.model_year}
                    onChange={(e) => setUnitData({ ...unitData, model_year: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit Color
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. White / Silver"
                    value={unitData.color}
                    onChange={(e) => setUnitData({ ...unitData, color: e.target.value })}
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
                    value={unitData.seating_capacity}
                    onChange={(e) =>
                      setUnitData({
                        ...unitData,
                        seating_capacity: parseInt(e.target.value) || 14,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LTFRB Franchise Case Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LTFRB-NCR-2024-XXXX"
                    value={unitData.franchise_case_number}
                    onChange={(e) =>
                      setUnitData({ ...unitData, franchise_case_number: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Authorized Route / Charter Scope
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Manila to Any Point of Luzon"
                    value={unitData.route_details}
                    onChange={(e) =>
                      setUnitData({ ...unitData, route_details: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/members"
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving Member Record...' : 'Save & Register Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
