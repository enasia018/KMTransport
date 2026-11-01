'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Car,
  CreditCard,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Phone,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { DashboardStats, Member, Payment } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, membersRes, paymentsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/members'),
          fetch('/api/payments'),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setRecentMembers(membersData.slice(0, 5));
        }
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          setRecentPayments(paymentsData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Cover Photo & Official Brand Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden transition-all">
        {/* The Official Cover Banner Image */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[26/9] lg:aspect-[28/9] bg-slate-950 overflow-hidden">
          <img
            src="/cover.png"
            alt="KM Tourist Transport Services OPC Official Cover Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Official Profile & Information Bar (Matching Page Header) */}
        <div className="p-5 sm:p-6 bg-white border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Circular Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-1 shrink-0 border-2 border-amber-400 shadow-lg -mt-10 sm:-mt-12 relative z-10 bg-white">
              <img
                src="/logo.png"
                alt="KM Tourist Transport Services OPC Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Profile Text & Slogans */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-extrabold text-xl sm:text-2xl text-slate-950 tracking-tight">
                  KM Tourist Transport Services OPC
                </h1>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium border border-slate-200">
                  1K followers • 3 following
                </span>
              </div>

              {/* Taglines / Slogans from photo */}
              <div className="text-xs sm:text-sm font-serif italic text-slate-700 tracking-wide space-y-0.5">
                <p className="font-medium text-slate-800 uppercase">DRIVEN BY SAFETY, DEFINED BY TRUST</p>
                <p className="font-medium text-slate-800 uppercase">WHERE COMFORT MEET COMPLIANCE</p>
                <p className="font-bold text-amber-600 uppercase">RIDE SAFE! RIDE LEGAL! RIDE KM!</p>
              </div>

              {/* Meta: Transportation Service & Contact Phone */}
              <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  🚌 Transportation Service
                </span>
                <a
                  href="tel:09532966323"
                  className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  0953 296 6323
                </a>
                <span className="text-slate-400 font-mono text-[11px]">
                  SEC: 20240198058-20 • DTI: 5511875
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2.5 flex-wrap self-start lg:self-center">
            <Link
              href="/members/new"
              className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Member & Van
            </Link>
            <Link
              href="/payments"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Record Payment
            </Link>
            <Link
              href="/members"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all"
            >
              Directory
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Members
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats?.totalMembers ?? 0}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {stats?.activeMembers ?? 0} Active Operators
            </p>
          </div>
        </div>

        {/* Total Units / Vans */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Franchise Units / Vans
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats?.totalUnits ?? 0}
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              {stats?.activeUnits ?? 0} Units in Operation
            </p>
          </div>
        </div>

        {/* Month Collections */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Collections (This Month)
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ₱{loading ? '...' : (stats?.totalCollectedThisMonth ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Franchise dues & fees
            </p>
          </div>
        </div>

        {/* Attention / Expiring docs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Doc Renewals Alert
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats?.expiringDocsCount ?? 0}
            </div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              Expiring in next 45 days
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Members & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Members (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Franchise Members</h2>
              <p className="text-xs text-slate-500">Recently registered or updated members</p>
            </div>
            <Link
              href="/members"
              className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading members...</div>
            ) : recentMembers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No members registered yet.</div>
            ) : (
              recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0">
                      {member.first_name[0]}
                      {member.last_name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/members/${member.id}`}
                          className="font-semibold text-slate-900 hover:text-sky-600 text-sm"
                        >
                          {member.full_name}
                        </Link>
                        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {member.member_code}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            member.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {member.contact_number}
                        </span>
                        <span className="truncate max-w-[200px] hidden sm:inline">
                          {member.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/members/${member.id}`}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition-colors"
                    >
                      Edit & Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 text-base">Recent Payments</h2>
              <p className="text-xs text-slate-500">Franchise fee collections</p>
            </div>
            <Link
              href="/payments"
              className="text-xs font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading payments...</div>
            ) : recentPayments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No payment records yet.</div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      ₱{Number(payment.amount).toLocaleString()}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        payment.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-0.5">
                    {payment.payment_type}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>{payment.member_name || 'Member'}</span>
                    <span>{payment.payment_method}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Ref: {payment.reference_number || 'N/A'} • {payment.payment_date}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/payments"
              className="text-xs font-medium text-sky-600 hover:underline"
            >
              + Record New Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
