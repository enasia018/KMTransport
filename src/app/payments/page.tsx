'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Calendar,
  ExternalLink,
  Edit2,
  UserCheck,
} from 'lucide-react';
import { Payment, Member } from '@/lib/types';
import PaymentFormModal from '@/components/PaymentFormModal';
import MemberEditModal from '@/components/MemberEditModal';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Record payment modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [payRes, memRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/members'),
      ]);
      if (payRes.ok) setPayments(await payRes.json());
      if (memRes.ok) {
        const memData = await memRes.json();
        setMembers(memData);
        if (memData.length > 0 && !selectedMemberId) {
          setSelectedMemberId(memData[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert('Error deleting payment');
    }
  }

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        search === '' ||
        (p.member_name && p.member_name.toLowerCase().includes(search.toLowerCase())) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(search.toLowerCase())) ||
        p.payment_type.toLowerCase().includes(search.toLowerCase()) ||
        p.payment_method.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'All' || p.payment_type === typeFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [payments, search, typeFilter, statusFilter]);

  const totalCollected = filteredPayments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  function exportCSV() {
    if (payments.length === 0) return;
    const headers = ['Date', 'Member Name', 'Payment Type', 'Method', 'Reference No', 'Coverage Period', 'Amount (PHP)', 'Status'];
    const rows = filteredPayments.map((p) => [
      `"${p.payment_date}"`,
      `"${(p.member_name || '').replace(/"/g, '""')}"`,
      `"${p.payment_type}"`,
      `"${p.payment_method}"`,
      `"${p.reference_number || ''}"`,
      `"${p.coverage_period || ''}"`,
      p.amount,
      `"${p.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM_Tourist_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payments & Accounting</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Franchise fee collections, monthly dues, insurance, and affiliation renewals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 px-3 rounded-lg shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3.5 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <span className="text-xs text-emerald-200 uppercase font-semibold tracking-wider">
            Filtered Collections Total
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold mt-1">
            ₱{totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-100/80 mt-1">
            Showing {filteredPayments.length} recorded payments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-lg text-center border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-emerald-200 block">
              Paid Records
            </span>
            <span className="text-lg font-bold">
              {filteredPayments.filter((p) => p.status === 'Paid').length}
            </span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-lg text-center border border-white/10">
            <span className="text-[10px] uppercase font-semibold text-emerald-200 block">
              Pending
            </span>
            <span className="text-lg font-bold">
              {filteredPayments.filter((p) => p.status === 'Pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member, ref #, payment type..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-lg outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
          >
            <option value="All">All Kinds of Payment</option>
            <option value="Monthly Franchise Due">Monthly Franchise Due</option>
            <option value="Membership Fee">Membership Fee</option>
            <option value="Franchise Renewal">Franchise Renewal</option>
            <option value="Terminal / Dispatch Fee">Terminal / Dispatch Fee</option>
            <option value="Insurance / TPL">Insurance / TPL</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No payment records found</h3>
            <p className="text-xs text-slate-500">
              {search || typeFilter !== 'All' ? 'Try adjusting your filters.' : 'Record the first franchise payment.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Kind of Payment</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4">Coverage</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/members/${p.member_id}`}
                        className="font-semibold text-slate-900 hover:text-sky-600 flex items-center gap-1"
                      >
                        {p.member_name || 'Member'}
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      {p.unit_name && (
                        <p className="text-xs text-slate-400">{p.unit_name}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {p.payment_type}
                      {p.notes && (
                        <p className="text-[11px] text-slate-400 font-normal italic">
                          {p.notes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">{p.payment_method}</span>
                      {p.reference_number && (
                        <p className="font-mono text-slate-400 text-[11px]">
                          {p.reference_number}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {p.coverage_period || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">{p.payment_date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₱{Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                          p.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setEditingMemberId(p.member_id)}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 py-1.5 px-2.5 rounded-lg border border-sky-200 transition-colors shadow-2xs"
                        title="Edit all member information (Name, Phone, Address, Status, Emergency Contacts)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Member</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete payment record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Select Franchise Member</h3>
            <p className="text-xs text-slate-500">
              Choose the member who made this payment:
            </p>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.member_code})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  // Open payment form modal with selected member
                  router.push(`/members/${selectedMemberId}?tab=payments`);
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg shadow-sm"
              >
                Proceed to Record Form →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-Place Member Edit Modal for Administrator */}
      <MemberEditModal
        memberId={editingMemberId}
        isOpen={Boolean(editingMemberId)}
        onClose={() => setEditingMemberId(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
