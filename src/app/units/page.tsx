'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Car,
  Search,
  Filter,
  Users,
  Phone,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { Unit } from '@/lib/types';

export default function FleetPage() {
  const [units, setUnits] = useState<(Unit & { member_name?: string; member_contact?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    setLoading(true);
    try {
      const res = await fetch('/api/units');
      if (res.ok) {
        const data = await res.json();
        setUnits(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      const matchesSearch =
        search === '' ||
        u.unit_name.toLowerCase().includes(search.toLowerCase()) ||
        u.plate_number.toLowerCase().includes(search.toLowerCase()) ||
        (u.member_name && u.member_name.toLowerCase().includes(search.toLowerCase())) ||
        (u.franchise_case_number && u.franchise_case_number.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'All' || u.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [units, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Fleet Cover Banner */}
      <div className="relative w-full aspect-[24/9] sm:aspect-[28/9] max-h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950">
        <img
          src="/cover.png"
          alt="KM Tourist Transport Services Fleet Cover Banner"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Fleet & Van Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Toyota HiAce, Nissan Urvan, and all tourist transport units affiliated with KM Tourist Franchise
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plate number, van model, operator..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-sky-500 rounded-lg outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Active', 'Maintenance', 'Inactive'].map((status) => (
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

      {/* Units Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Loading vehicle fleet...</div>
      ) : filteredUnits.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <Car className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No vans found</h3>
          <p className="text-xs text-slate-500">
            {search || statusFilter !== 'All'
              ? 'Try adjusting your filters.'
              : 'Add members and their affiliated van units to see them listed here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-3 py-1 rounded shadow-xs tracking-wider">
                    {unit.plate_number}
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

                <h3 className="font-bold text-slate-900 text-base mt-3">{unit.unit_name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {unit.model_year || 'Year N/A'} • {unit.color || 'Color N/A'} •{' '}
                  {unit.seating_capacity || 14} Passenger Seats
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Franchise Case:</span>
                    <span className="font-mono font-medium text-slate-700">
                      {unit.franchise_case_number || 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Route / Area:</span>
                    <span className="truncate">{unit.route_details || 'Tourist Charter'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Franchise Member
                  </span>
                  <Link
                    href={`/members/${unit.member_id}`}
                    className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    {unit.member_name || 'Member Profile'}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                {unit.member_contact && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Contact
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      {unit.member_contact}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
