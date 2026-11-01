'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Car,
  CreditCard,
  FolderOpen,
  Printer,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  Eye,
  Download,
  Save,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { Member, Unit, Payment, DocumentAttachment } from '@/lib/types';
import UnitFormModal from '@/components/UnitFormModal';
import PaymentFormModal from '@/components/PaymentFormModal';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import DocumentViewerModal from '@/components/DocumentViewerModal';

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'units' | 'payments' | 'documents'>('info');

  // Edit Member Profile State
  const [editForm, setEditForm] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals state
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentAttachment | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'documents' || tabParam === 'units' || tabParam === 'payments' || tabParam === 'info') {
        setActiveTab(tabParam as any);
      }
    }
    loadMember();
  }, [id]);

  async function loadMember() {
    setLoading(true);
    try {
      const res = await fetch(`/api/members/${id}`);
      if (!res.ok) {
        setMember(null);
        return;
      }
      const data = await res.json();
      setMember(data);
      setEditForm({
        member_code: data.member_code,
        first_name: data.first_name,
        middle_name: data.middle_name || '',
        last_name: data.last_name,
        contact_number: data.contact_number,
        address: data.address,
        email: data.email || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_number: data.emergency_contact_number || '',
        status: data.status,
        join_date: data.join_date,
        notes: data.notes || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Save Member info
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadMember();
      } else {
        alert('Failed to update member profile');
      }
    } catch (err) {
      alert('Error updating member');
    } finally {
      setSavingProfile(false);
    }
  }

  // Delete Unit
  async function handleDeleteUnit(unitId: string, plate: string) {
    if (!confirm(`Are you sure you want to remove unit with plate "${plate}"?`)) return;
    try {
      const res = await fetch(`/api/units/${unitId}`, { method: 'DELETE' });
      if (res.ok) loadMember();
    } catch (e) {
      alert('Failed to delete unit');
    }
  }

  // Delete Payment
  async function handleDeletePayment(payId: string) {
    if (!confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const res = await fetch(`/api/payments/${payId}`, { method: 'DELETE' });
      if (res.ok) loadMember();
    } catch (e) {
      alert('Failed to delete payment');
    }
  }

  // Delete Document
  async function handleDeleteDoc(docId: string, title: string) {
    if (!confirm(`Are you sure you want to delete attached document "${title}"?`)) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) loadMember();
    } catch (e) {
      alert('Failed to delete document');
    }
  }

  // Delete Member entirely
  async function handleDeleteMember() {
    if (!confirm(`Are you sure you want to permanently delete member ${member?.full_name}?`)) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/members');
      }
    } catch (e) {
      alert('Failed to delete member');
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading member record...
      </div>
    );
  }

  if (!member || !editForm) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Member Not Found</h2>
        <p className="text-sm text-slate-500">The member record may have been deleted.</p>
        <Link
          href="/members"
          className="inline-flex items-center gap-2 bg-sky-600 text-white text-xs px-4 py-2 rounded-lg font-semibold"
        >
          Return to Members Directory
        </Link>
      </div>
    );
  }

  const totalPaid = (member.payments || [])
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Official Print Header (Visible when printed via browser or Print Dossier) */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="KM Tourist Transport Services Logo"
            className="w-20 h-20 object-contain rounded-full border border-slate-300"
          />
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase leading-tight">
              KM Tourist Transport Services OPC
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-0.5">
              SEC REG NO. 20240198058-20 • DTI CERT NO. 5511875 • 📞 0953 296 6323
            </p>
            <p className="text-[11px] text-slate-600 font-serif italic mt-0.5">
              Driven by Safety, Defined by Trust • Where Comfort Meet Compliance • Ride Safe! Ride Legal! Ride KM!
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-700 font-mono">
          <p className="font-bold text-slate-950">ID: {member.member_code}</p>
          <p>PRINTED: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/members"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {member.full_name}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                {member.member_code}
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                  member.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {member.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-sky-600" />
                {member.contact_number}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {member.address}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setDocUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 rounded-lg shadow-sm transition-all"
            title="Attach Resibo, OR/CR, or Signed Documents"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>+ Add Screenshot / File</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 px-3 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Dossier
          </button>
          <button
            onClick={handleDeleteMember}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 py-2 px-3 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'info'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          Member Info & Edit
        </button>

        <button
          onClick={() => setActiveTab('units')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'units'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Car className="w-4 h-4" />
          Units / Vans ({member.units?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'payments'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payments (₱{totalPaid.toLocaleString()})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
            activeTab === 'documents'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Documents ({member.documents?.length || 0})
        </button>
      </div>

      {/* Tab 1: Member Info & Edit */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Edit Member Details</h2>
              <p className="text-xs text-slate-500">
                Update operator's personal information, contact numbers, and address
              </p>
            </div>
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Saved successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Franchise Member Code
              </label>
              <input
                type="text"
                required
                value={editForm.member_code}
                onChange={(e) => setEditForm({ ...editForm, member_code: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Affiliation Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Joined Date
              </label>
              <input
                type="date"
                required
                value={editForm.join_date}
                onChange={(e) => setEditForm({ ...editForm, join_date: e.target.value })}
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
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={editForm.middle_name}
                onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })}
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
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
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
                value={editForm.contact_number}
                onChange={(e) => setEditForm({ ...editForm, contact_number: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential Address *
            </label>
            <input
              type="text"
              required
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                value={editForm.emergency_contact_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, emergency_contact_name: e.target.value })
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
                value={editForm.emergency_contact_number}
                onChange={(e) =>
                  setEditForm({ ...editForm, emergency_contact_number: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks & Special Instructions
            </label>
            <textarea
              rows={3}
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Member Information'}
            </button>
          </div>
        </form>

        {/* Dedicated Quick Documents & Screenshot Box on Member Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-sky-600" />
                Attached Documents & Receipts (Resibo, OR/CR, Signed Documents)
              </h3>
              <p className="text-xs text-slate-500">
                Preview and download official documents for {member.full_name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDocUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 rounded-lg shadow-sm transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              + Add Screenshot / Upload File
            </button>
          </div>

          {!member.documents || member.documents.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No documents attached yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "+ Add Screenshot / Upload File" above to attach the member's OR/CR, payment resibo, or signed documents.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {member.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                      {doc.category === 'OR_CR'
                        ? '🚐 OR/CR of Van'
                        : doc.category === 'PAYMENT_RECEIPT'
                        ? '🧾 Resibo / Receipt'
                        : doc.category === 'MEMBERSHIP_CONTRACT'
                        ? '✍️ Signed Contract'
                        : doc.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-2 line-clamp-1">{doc.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.file_name}</p>
                    {doc.expiry_date && (
                      <p className="text-[11px] font-medium text-amber-700 mt-1">Expires: {doc.expiry_date}</p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setViewingDoc(doc)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Document
                    </button>
                    <a
                      href={doc.file_data}
                      download={doc.file_name}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Tab 2: Units / Vans */}
      {activeTab === 'units' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Assigned Units & Vans</h2>
              <p className="text-xs text-slate-500">
                Toyota HiAce, Nissan Urvan, and chartered vehicles under this franchise operator
              </p>
            </div>
            <button
              onClick={() => {
                setEditingUnit(null);
                setUnitModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3.5 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Van Unit
            </button>
          </div>

          {!member.units || member.units.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <Car className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800">No units registered</h3>
              <p className="text-xs text-slate-500">
                Click "Add Van Unit" to register this member's vehicle model, plate number, and franchise case info.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.units.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          {unit.unit_name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            unit.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {unit.status}
                        </span>
                      </div>
                      <span className="inline-block bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded mt-1.5 shadow-xs">
                        {unit.plate_number}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingUnit(unit);
                          setUnitModalOpen(true);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        title="Edit Van"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id, unit.plate_number)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Van"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Model / Color
                      </span>
                      <span>
                        {unit.model_year || 'N/A'} • {unit.color || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Capacity
                      </span>
                      <span>{unit.seating_capacity || 14} Passenger Seats</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        LTFRB Case No.
                      </span>
                      <span className="font-mono text-slate-700">
                        {unit.franchise_case_number || 'Pending Assignment'}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Authorized Route
                      </span>
                      <span className="text-slate-700">
                        {unit.route_details || 'Tourist Charter Scope'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Payments */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Franchise Payments Ledger</h2>
              <p className="text-xs text-slate-500">
                Membership fees, monthly dues, and franchise renewals
              </p>
            </div>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3.5 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Record Payment
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {!member.payments || member.payments.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-semibold text-slate-800">No payments recorded</h3>
                <p className="text-xs text-slate-500">
                  Record monthly dues, renewal fees, and passenger insurance payments.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
                    {member.payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {pay.payment_type}
                          {pay.notes && (
                            <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                              {pay.notes}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          <span className="font-medium text-slate-800">{pay.payment_method}</span>
                          {pay.reference_number && (
                            <p className="text-[11px] font-mono text-slate-400">
                              Ref: {pay.reference_number}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {pay.coverage_period || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">{pay.payment_date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          ₱{Number(pay.amount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              pay.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeletePayment(pay.id)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete payment"
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
      )}

      {/* Tab 4: Documents Vault */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Attached Documents Vault</h2>
              <p className="text-xs text-slate-500">
                OR/CR, LTFRB permits, driver licenses, passenger insurance policies, and valid IDs
              </p>
            </div>
            <button
              onClick={() => setDocUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white py-2 px-3.5 rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Attach Document
            </button>
          </div>

          {!member.documents || member.documents.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800">No documents attached</h3>
              <p className="text-xs text-slate-500">
                Click "Attach Document" to upload OR/CR, Insurance, and LTFRB permits directly to the database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {member.documents.map((doc) => {
                const isExpiringSoon =
                  doc.expiry_date &&
                  new Date(doc.expiry_date).getTime() - new Date().getTime() <
                    45 * 24 * 60 * 60 * 1000;

                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-100">
                          {doc.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                            title="Preview Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-semibold text-slate-900 text-sm mt-2 line-clamp-1">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {doc.file_name} • {(doc.file_size / 1024).toFixed(1)} KB
                      </p>

                      {doc.expiry_date && (
                        <div
                          className={`mt-2 text-xs flex items-center gap-1 font-medium ${
                            isExpiringSoon ? 'text-amber-600' : 'text-slate-500'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Expires: {doc.expiry_date}
                          {isExpiringSoon && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                              Renewal Soon
                            </span>
                          )}
                        </div>
                      )}

                      {doc.notes && (
                        <p className="text-xs text-slate-500 italic mt-1 line-clamp-2">
                          "{doc.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setViewingDoc(doc)}
                        className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      <a
                        href={doc.file_data}
                        download={doc.file_name}
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UnitFormModal
        memberId={member.id}
        initialUnit={editingUnit}
        isOpen={unitModalOpen}
        onClose={() => {
          setUnitModalOpen(false);
          setEditingUnit(null);
        }}
        onSuccess={loadMember}
      />

      <PaymentFormModal
        memberId={member.id}
        units={member.units || []}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={loadMember}
      />

      <DocumentUploadModal
        memberId={member.id}
        units={member.units || []}
        isOpen={docUploadModalOpen}
        onClose={() => setDocUploadModalOpen(false)}
        onSuccess={loadMember}
      />

      <DocumentViewerModal
        document={viewingDoc}
        isOpen={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
      />
    </div>
  );
}
