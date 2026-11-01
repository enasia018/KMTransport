'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  Search,
  Filter,
  Eye,
  Download,
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { DocumentAttachment } from '@/lib/types';
import DocumentViewerModal from '@/components/DocumentViewerModal';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewingDoc, setViewingDoc] = useState<DocumentAttachment | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        setDocuments(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete document "${title}"?`)) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      alert('Error deleting document');
    }
  }

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const matchesSearch =
        search === '' ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.file_name.toLowerCase().includes(search.toLowerCase()) ||
        (d.member_name && d.member_name.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory =
        categoryFilter === 'All' || d.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [documents, search, categoryFilter]);

  // Expiring in next 45 days
  const expiringDocs = useMemo(() => {
    const now = new Date();
    const in45Days = new Date();
    in45Days.setDate(in45Days.getDate() + 45);

    return documents.filter((d) => {
      if (!d.expiry_date) return false;
      const exp = new Date(d.expiry_date);
      return exp >= now && exp <= in45Days;
    });
  }, [documents]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents Vault</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            OR/CR certificates, LTFRB permits, driver licenses, and vehicle insurance policies
          </p>
        </div>
      </div>

      {/* Expiring Alert Banner if any */}
      {expiringDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-950 text-sm">
              {expiringDocs.length} Document(s) Require Renewal Within 45 Days
            </h4>
            <div className="mt-1 space-y-1">
              {expiringDocs.map((d) => (
                <div key={d.id} className="flex items-center gap-2">
                  <span className="font-semibold text-amber-900">{d.title}</span>
                  <span className="text-amber-700">({d.member_name})</span>
                  <span className="font-mono bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                    Expires: {d.expiry_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document title, operator, file..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-lg outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { label: 'All Docs', value: 'All' },
            { label: 'OR/CR', value: 'OR_CR' },
            { label: 'LTFRB Permit', value: 'FRANCHISE_PERMIT' },
            { label: 'Driver License', value: 'DRIVER_LICENSE' },
            { label: 'Insurance', value: 'INSURANCE' },
            { label: 'Valid ID', value: 'VALID_ID' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                categoryFilter === cat.value
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500">
            {search || categoryFilter !== 'All'
              ? 'Try adjusting your filters.'
              : 'Upload documents from individual member profiles.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
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
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.title)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm mt-2 line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {doc.file_name} • {(doc.file_size / 1024).toFixed(1)} KB
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Member Operator
                  </span>
                  <Link
                    href={`/members/${doc.member_id}`}
                    className="font-medium text-sky-600 hover:underline flex items-center gap-1"
                  >
                    {doc.member_name || 'View Member'}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>

                {doc.expiry_date && (
                  <div className="mt-2 text-xs flex items-center gap-1 font-medium text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid until: {doc.expiry_date}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview Document
                </button>
                <a
                  href={doc.file_data}
                  download={doc.file_name}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewer Modal */}
      <DocumentViewerModal
        document={viewingDoc}
        isOpen={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
      />
    </div>
  );
}
