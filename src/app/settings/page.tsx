'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    setLoading(true);
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        setDbStatus(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleInitDb() {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/database/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        await checkStatus();
      } else {
        setMessage({ type: 'error', text: data.message || 'Initialization failed' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Network error' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMigrateSeed() {
    if (!confirm('This will synchronize and copy all local members, units, payments, and documents into your Neon PostgreSQL database. Proceed?')) {
      return;
    }
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/database/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate_seed' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || 'Migration failed' });
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Network error' });
    } finally {
      setActionLoading(false);
    }
  }

  // Download raw local backup
  async function downloadBackup() {
    try {
      const [membersRes, unitsRes, paymentsRes, docsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/units'),
        fetch('/api/payments'),
        fetch('/api/documents'),
      ]);

      const backup = {
        franchise: 'KM Tourist Franchise',
        exported_at: new Date().toISOString(),
        members: await membersRes.json(),
        units: await unitsRes.json(),
        payments: await paymentsRes.json(),
        documents: await docsRes.json(),
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KM_Tourist_Franchise_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to generate database backup');
    }
  }

  function copyCode(text: string, stepId: string) {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cloud Database & Web Deployment Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure your Neon PostgreSQL database, push source code to GitHub, and deploy online so your friend can access KM Tourist Franchise anywhere.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. Current Database Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                dbStatus?.neonConfigured
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Database Engine Status</h2>
              <p className="text-xs text-slate-500">
                {dbStatus?.neonConfigured
                  ? 'Connected to Neon Serverless PostgreSQL Cloud'
                  : 'Running in Local Safe-Storage Mode (Mock/JSON)'}
              </p>
            </div>
          </div>
          <button
            onClick={checkStatus}
            disabled={loading}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Active Storage Mode
            </span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
              {dbStatus?.mode || 'Detecting...'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Neon Database URL
            </span>
            <span className="font-mono text-slate-700 text-xs mt-0.5 truncate block">
              {dbStatus?.databaseUrlMasked || 'Not yet configured in .env.local'}
            </span>
          </div>
        </div>

        {/* Action Buttons for Neon */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {dbStatus?.neonConfigured ? (
            <>
              <button
                onClick={handleInitDb}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                {actionLoading ? 'Working...' : 'Verify & Initialize Neon Tables'}
              </button>
              <button
                onClick={handleMigrateSeed}
                disabled={actionLoading}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-lg shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Sync Local Records into NeonDB
              </button>
            </>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 w-full space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Ready to link NeonDB!
              </p>
              <p className="text-amber-800">
                Create a free database on <strong>neon.tech</strong> and paste your connection string in <code>.env.local</code>. Follow the guide below:
              </p>
            </div>
          )}

          <button
            onClick={downloadBackup}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 px-4 rounded-lg shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download Complete Backup (.JSON)
          </button>
        </div>
      </div>

      {/* 2. Step 1: Setting up NeonDB */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
            1
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 1: Get Free NeonDB Database</h3>
            <p className="text-xs text-slate-500">
              Neon gives you a free, lightning-fast PostgreSQL database in the cloud.
            </p>
          </div>
        </div>

        <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed pl-1">
          <li>
            Open{' '}
            <a
              href="https://neon.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 font-semibold underline"
            >
              https://neon.tech
            </a>{' '}
            and sign in with GitHub or Google (Free Forever tier).
          </li>
          <li>Click <strong>"Create Project"</strong> and name it <code>km-tourist-db</code>.</li>
          <li>
            In your Neon Dashboard, copy the connection string. It will look like:
            <div className="mt-2 relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                postgresql://kmuser:password@ep-sample-1234.us-east-2.aws.neon.tech/neondb?sslmode=require
              </pre>
            </div>
          </li>
          <li>
            Open or create the file <code>.env.local</code> in this project folder and paste:
            <div className="mt-2 relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                DATABASE_URL="postgresql://username:password@ep-your-host.neon.tech/neondb?sslmode=require"
              </pre>
              <button
                onClick={() =>
                  copyCode(
                    'DATABASE_URL="postgresql://username:password@ep-your-host.neon.tech/neondb?sslmode=require"',
                    'env'
                  )
                }
                className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                {copiedStep === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </li>
        </ol>
      </div>

      {/* 3. Step 2: Push to GitHub */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
            2
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 2: Save Source Code to GitHub</h3>
            <p className="text-xs text-slate-500">
              Store your project on GitHub so it can auto-deploy to the web whenever you make updates.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700">
          Run these commands in PowerShell in this folder:
        </p>

        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
            <div>git init</div>
            <div>git add .</div>
            <div>git commit -m "Initial KM Tourist Franchise database system"</div>
            <div>git branch -M main</div>
            <div>git remote add origin https://github.com/YOUR_USERNAME/km-tourist-franchise.git</div>
            <div>git push -u origin main</div>
          </pre>
          <button
            onClick={() =>
              copyCode(
                `git init\ngit add .\ngit commit -m "Initial KM Tourist Franchise database system"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/km-tourist-franchise.git\ngit push -u origin main`,
                'git'
              )
            }
            className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
          >
            {copiedStep === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 4. Step 3: Deploy to the Web */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
            3
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Step 3: Webhost Online (Access Anywhere)</h3>
            <p className="text-xs text-slate-500">
              Host for free with automatic SSL, phone support, and zero maintenance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vercel (Recommended) */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-600" />
                Vercel (Recommended)
              </span>
              <span className="text-[10px] font-bold uppercase bg-sky-600 text-white px-2 py-0.5 rounded-full">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Native host for Next.js. Deploy in 2 clicks.
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1">
              <li>Go to <a href="https://vercel.com" target="_blank" className="text-sky-600 font-semibold underline">vercel.com</a> and sign in with GitHub.</li>
              <li>Click <strong>"Add New" → "Project"</strong>.</li>
              <li>Import your <code>km-tourist-franchise</code> repository.</li>
              <li>Under <strong>Environment Variables</strong>, add <code>DATABASE_URL</code> with your NeonDB connection string.</li>
              <li>Click <strong>Deploy</strong>! You'll get a permanent link like: <code className="text-sky-700 font-semibold">km-tourist.vercel.app</code></li>
            </ol>
          </div>

          {/* Render / Google Cloud Run / Railway */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-600" />
                Render / Railway / Google Cloud
              </span>
              <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                Alternative
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Can also be hosted on Render (render.com), Railway, or Google Cloud Run.
            </p>
            <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1">
              <li>Sign in to Render or Railway with GitHub.</li>
              <li>Create a new Web Service and link the repository.</li>
              <li>Build command: <code>npm run build</code></li>
              <li>Start command: <code>npm run start</code></li>
              <li>Add environment variable <code>DATABASE_URL</code> from Neon.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
