'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Download,
  Phone,
  MapPin,
  Car,
  Filter,
  Eye,
  Trash2,
  FileSpreadsheet,
} from 'lucide-react';
import { Member } from '@/lib/types';

function MembersContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to remove member "${name}" and all associated van units and documents?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Failed to delete member.');
      }
    } catch (err) {
      alert('Error deleting member.');
    }
  }

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        m.full_name.toLowerCase().includes(q) ||
        m.member_code.toLowerCase().includes(q) ||
        m.contact_number.includes(q) ||
        m.address.toLowerCase().includes(q) ||
        // MATCH BY PLATE NUMBER OF ANY ASSIGNED VAN!
        (m.units && m.units.some((u) => u.plate_number.toLowerCase().includes(q) || u.unit_name.toLowerCase().includes(q))) ||
        // MATCH BY ATTACHED DOCUMENT TITLE OR CATEGORY!
        (m.documents && m.documents.some((d) => d.title.toLowerCase().includes(q) || d.file_name.toLowerCase().includes(q)));

      const matchesStatus =
        statusFilter === 'All' || m.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  // Export to CSV
  function exportCSV() {
    if (members.length === 0) return;
    const headers = ['Member ID', 'Full Name', 'Contact Number', 'Address', 'Email', 'Status', 'Join Date'];
    const rows = filteredMembers.map((m) => [
      `"${m.member_code}"`,
      `"${m.full_name.replace(/"/g, '""')}"`,
      `"${m.contact_number}"`,
      `"${m.address.replace(/"/g, '""')}"`,
      `"${m.email || ''}"`,
      `"${m.status}"`,
      `"${m.join_date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KM_Tourist_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Members Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            KM Tourist Franchise operators, driver affiliations, and vehicle assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 px-3 rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <Link
            href="/members/new"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, phone, address..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-lg outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Active', 'Pending', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading members directory...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No members found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search terms or filters.'
                : 'Get started by registering the first member in the KM Tourist Franchise database.'}
            </p>
            <Link
              href="/members/new"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 rounded-lg shadow-sm mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Member
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Member Operator</th>
                  <th className="py-3 px-4">Assigned Van & Plate No.</th>
                  <th className="py-3 px-4">Attached Documents</th>
                  <th className="py-3 px-4">Contact & Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                          {member.first_name[0]}
                          {member.last_name[0]}
                        </div>
                        <div>
                          <Link
                            href={`/members/${member.id}`}
                            className="font-bold text-slate-900 hover:text-sky-600 flex items-center gap-2"
                          >
                            <span>{member.full_name}</span>
                          </Link>
                          <span className="text-xs text-slate-500 font-mono">
                            {member.member_code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Vans & Plate Numbers */}
                    <td className="py-3.5 px-4 text-xs">
                      {member.units && member.units.length > 0 ? (
                        <div className="space-y-1">
                          {member.units.map((u) => (
                            <div key={u.id} className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-slate-900 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded shadow-2xs">
                                🚐 {u.plate_number}
                              </span>
                              <span className="text-slate-600 font-medium text-[11px]">
                                {u.unit_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No van assigned</span>
                      )}
                    </td>

                    {/* Attached Documents Counter & Pills */}
                    <td className="py-3.5 px-4 text-xs">
                      {member.documents && member.documents.length > 0 ? (
                        <div className="space-y-1">
                          <Link
                            href={`/members/${member.id}?tab=documents`}
                            className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors"
                          >
                            📎 {member.documents.length} Document(s)
                          </Link>
                          <div className="flex flex-wrap gap-1">
                            {member.documents.slice(0, 2).map((d) => (
                              <span
                                key={d.id}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded truncate max-w-[120px]"
                                title={d.title}
                              >
                                {d.category === 'OR_CR' ? 'OR/CR' : d.category === 'PAYMENT_RECEIPT' ? 'Resibo' : d.title}
                              </span>
                            ))}
                            {member.documents.length > 2 && (
                              <span className="text-[10px] text-slate-400">+{member.documents.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/members/${member.id}?tab=documents`}
                          className="text-[11px] text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 font-medium inline-block"
                        >
                          + Add OR/CR & Resibo
                        </Link>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Phone className="w-3 h-3 text-sky-600" />
                        <span>{member.contact_number}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 mt-0.5 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{member.address}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium inline-block ${
                          member.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/members/${member.id}`}
                        className="inline-flex items-center gap-1 text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-2xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Info & Docs
                      </Link>
                      <button
                        onClick={() => handleDelete(member.id, member.full_name)}
                        className="inline-flex items-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Member"
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
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading members...</div>}>
      <MembersContent />
    </Suspense>
  );
}
