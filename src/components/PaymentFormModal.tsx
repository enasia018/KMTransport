'use client';

import { useState } from 'react';
import { X, CreditCard, Save } from 'lucide-react';
import { PaymentType, PaymentMethod, PaymentStatus, Unit } from '@/lib/types';

interface PaymentFormModalProps {
  memberId: string;
  units?: Unit[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentFormModal({
  memberId,
  units = [],
  isOpen,
  onClose,
  onSuccess,
}: PaymentFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    unit_id: units[0]?.id || '',
    payment_type: 'Monthly Franchise Due' as PaymentType,
    payment_method: 'GCash' as PaymentMethod,
    amount: 3500,
    reference_number: '',
    coverage_period: new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    payment_date: new Date().toISOString().slice(0, 10),
    status: 'Paid' as PaymentStatus,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          member_id: memberId,
          amount: Number(formData.amount),
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to record payment');
      }
    } catch (err) {
      alert('Error recording payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 text-base">Record Franchise Payment</h3>
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kind of Payment *
              </label>
              <select
                value={formData.payment_type}
                onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as PaymentType })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              >
                <option value="Monthly Franchise Due">Monthly Franchise Due</option>
                <option value="Membership Fee">Membership Fee</option>
                <option value="Franchise Renewal">Franchise Renewal</option>
                <option value="Terminal / Dispatch Fee">Terminal / Dispatch Fee</option>
                <option value="Insurance / TPL">Insurance / TPL</option>
                <option value="Penalty / Surcharge">Penalty / Surcharge</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method *
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              >
                <option value="GCash">GCash</option>
                <option value="Cash">Cash</option>
                <option value="Maya">Maya</option>
                <option value="Bank Transfer (BDO)">Bank Transfer (BDO)</option>
                <option value="Bank Transfer (BPI)">Bank Transfer (BPI)</option>
                <option value="Bank Transfer (Other)">Bank Transfer (Other)</option>
                <option value="Check">Check</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (PHP ₱) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                required
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference / Receipt No.
              </label>
              <input
                type="text"
                placeholder="e.g. GCash Ref 90281923"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coverage Period
              </label>
              <input
                type="text"
                placeholder="e.g. November 2026"
                value={formData.coverage_period}
                onChange={(e) => setFormData({ ...formData, coverage_period: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            {units.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tag to Specific Van Unit (Optional)
                </label>
                <select
                  value={formData.unit_id}
                  onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                >
                  <option value="">-- General Member Payment --</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unit_name} - {u.plate_number}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Paid in full via GCash QR"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
