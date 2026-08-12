/**
 * RoadWatch Indonesia — Dashboard Page
 *
 * Clean layout inspired by reference: top filter bar, left sidebar with thumbnail cards, right map canvas.
 * Sidebar stays on the LEFT per user requirement.
 */

import { useState, useMemo } from 'react';
import { APP_CONFIG, SEVERITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib';
import { MOCK_REPORTS } from '@/data';
import { RoadDamageMap } from '@/features/map';
import type { Report, Severity } from '@/types';

type StatusFilterGroup = 'all' | 'unhandled' | 'in_progress' | 'resolved';

const STATUS_TABS: { id: StatusFilterGroup; label: string; icon: string }[] = [
  { id: 'all', label: 'Semua', icon: '📋' },
  { id: 'unhandled', label: 'Belum Dikerjakan', icon: '⏳' },
  { id: 'in_progress', label: 'Sedang Dikerjakan', icon: '🛠️' },
  { id: 'resolved', label: 'Selesai Dikerjakan', icon: '✅' },
];

export default function DashboardPage() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusGroup, setSelectedStatusGroup] = useState<StatusFilterGroup>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStatus = true;
      if (selectedStatusGroup === 'unhandled') {
        matchesStatus = report.status === 'reported' || report.status === 'verified';
      } else if (selectedStatusGroup === 'in_progress') {
        matchesStatus = report.status === 'in_progress';
      } else if (selectedStatusGroup === 'resolved') {
        matchesStatus = report.status === 'resolved';
      }

      const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [reports, searchQuery, selectedStatusGroup, selectedSeverity]);

  // Stats
  const totalReports = reports.length;
  const unhandledCount = reports.filter((r) => r.status === 'reported' || r.status === 'verified').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const countForGroup = (g: StatusFilterGroup) =>
    g === 'all' ? totalReports : g === 'unhandled' ? unhandledCount : g === 'in_progress' ? inProgressCount : resolvedCount;

  return (
    <div className="flex h-screen flex-col bg-surface-950 text-surface-100 select-none overflow-hidden font-sans">

      {/* ═══════════════════ TOP BAR: Search + Filter Dropdowns ═══════════════════ */}
      <header className="flex h-14 items-center gap-4 border-b border-white/10 bg-surface-900/90 px-5 backdrop-blur-xl z-20 flex-shrink-0">
        {/* Brand Icon */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-md shadow-primary-600/30">
            P
          </div>
          <h1 className="text-sm font-bold tracking-tight text-white hidden md:block">
            {APP_CONFIG.NAME}
          </h1>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-xs">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi, nama jalan, atau ID laporan..."
            className="w-full rounded-xl bg-surface-800/80 pl-8 pr-8 py-2 text-xs text-surface-100 placeholder-surface-500 border border-white/10 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-surface-400 hover:text-white">✕</button>
          )}
        </div>

        {/* Filter by Severity */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-surface-400 text-xs hidden lg:inline">📍 Severity:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as (Severity | 'all')[]).map((sev) => {
            const isAll = sev === 'all';
            const cfg = isAll ? null : SEVERITY_CONFIG[sev as Severity];
            const isActive = selectedSeverity === sev;
            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev as Severity | 'all')}
                className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? isAll ? 'bg-surface-600 text-white' : 'text-white shadow-sm'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                }`}
                style={isActive && cfg ? { backgroundColor: cfg.color } : undefined}
              >
                {isAll ? 'All' : `${cfg?.icon ?? ''} ${cfg?.label ?? sev}`}
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══════════════════ MAIN CONTENT: Sidebar LEFT + Map RIGHT ═══════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── LEFT SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className="hidden w-[380px] flex-shrink-0 flex-col border-r border-white/10 bg-surface-900/70 backdrop-blur-md lg:flex overflow-hidden">

          {/* Sidebar Header: Status Tabs */}
          <div className="flex items-center border-b border-white/10 bg-surface-950/50 flex-shrink-0">
            {STATUS_TABS.map((tab) => {
              const isActive = selectedStatusGroup === tab.id;
              const count = countForGroup(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatusGroup(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-medium border-b-2 transition-all ${
                    isActive
                      ? 'border-primary-500 text-primary-400 bg-primary-500/5'
                      : 'border-transparent text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden xl:inline">{tab.label}</span>
                  <span className={`font-mono text-[10px] px-1 py-px rounded ${
                    isActive ? 'bg-primary-500/20 text-primary-400' : 'bg-surface-800 text-surface-500'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Report Count */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 flex-shrink-0">
            <span className="text-xs text-surface-300 font-medium">
              Menampilkan <strong className="text-surface-100">{filteredReports.length}</strong> Laporan
            </span>
          </div>

          {/* ─── Scrollable Report Card List ────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto">
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-sm font-semibold text-surface-300">Tidak ada laporan ditemukan</p>
                <p className="text-xs text-surface-500 mt-1">Ubah kata kunci atau filter status.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const severityConfig = SEVERITY_CONFIG[report.severity];
                const categoryInfo = CATEGORY_CONFIG[report.category] ?? { label: report.category, icon: '📋' };
                const statusInfo = STATUS_CONFIG[report.status] ?? { label: report.status, color: '#9ca3af' };
                const isSelected = selectedReport?.id === report.id;

                const statusLabel =
                  report.status === 'reported' ? 'Belum Dikerjakan' :
                  report.status === 'verified' ? 'Terverifikasi' :
                  report.status === 'in_progress' ? 'Sedang Dikerjakan' :
                  report.status === 'resolved' ? 'Selesai Dikerjakan' :
                  report.status === 'rejected' ? 'Ditolak' : report.status;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    className={`w-full text-left flex gap-3 p-3.5 border-b transition-all duration-150 ${
                      isSelected
                        ? 'bg-primary-950/40 border-primary-500/30'
                        : 'border-white/5 hover:bg-surface-800/60'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-800">
                      {report.imageUrl ? (
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-surface-600 text-lg">🗺️</div>
                      )}
                      {/* Severity mini badge on thumbnail */}
                      <span
                        className="absolute top-1 left-1 flex items-center justify-center h-5 w-5 rounded-md text-[9px] font-bold text-white shadow"
                        style={{ backgroundColor: severityConfig.color }}
                      >
                        {severityConfig.icon}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                      {/* Title */}
                      <h4 className="text-xs font-semibold text-surface-100 line-clamp-1 leading-snug">
                        {report.title}
                      </h4>

                      {/* Location / Coordinates */}
                      <p className="text-[11px] text-surface-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                        <span>📍</span>
                        <span className="font-mono">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                      </p>

                      {/* Badges Row */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {/* Category Badge */}
                        <span className="inline-flex items-center gap-0.5 rounded bg-surface-800 px-1.5 py-0.5 text-[10px] text-surface-300 border border-white/5">
                          {categoryInfo.icon} {categoryInfo.label}
                        </span>

                        {/* Status Badge */}
                        <span
                          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      {/* Bottom Row: Actions */}
                      <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                        <span className="text-primary-400 hover:text-primary-300 font-medium cursor-pointer">
                          Lihat Detail
                        </span>
                        <span className="text-surface-600">·</span>
                        <span className="text-primary-400 hover:text-primary-300 font-medium cursor-pointer">
                          Tampilkan di Peta
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* ─── Legend (bottom of sidebar) ──────────────────────────────── */}
          <div className="border-t border-white/10 bg-surface-950/40 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">Warning Radius</span>
            </div>
            <div className="flex items-center gap-3">
              {Object.values(SEVERITY_CONFIG).map((cfg) => (
                <div key={cfg.level} className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className="h-3 w-3 rounded flex items-center justify-center text-[8px] text-white font-bold"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {cfg.icon}
                  </span>
                  <span className="text-surface-300">{cfg.label}</span>
                  <span className="text-surface-500 font-mono">{cfg.radiusMeters}m</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── MAP CANVAS (takes remaining space) ───────────────────────────────── */}
        <main className="relative flex-1 bg-surface-950">
          <RoadDamageMap
            reports={filteredReports}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
          />
        </main>
      </div>

      {/* ═══════════════════ BOTTOM KPI STRIP ════════════════════════════════════ */}
      <footer className="flex h-10 items-center justify-between border-t border-white/10 bg-surface-900/90 px-5 text-xs z-20 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-5">
          <span className="text-surface-400">Total: <strong className="text-surface-100 font-mono">{totalReports}</strong></span>
          <span className="text-surface-400">Belum: <strong className="text-slate-300 font-mono">{unhandledCount}</strong></span>
          <span className="text-surface-400">Proses: <strong className="text-amber-400 font-mono">{inProgressCount}</strong></span>
          <span className="text-surface-400">Selesai: <strong className="text-emerald-400 font-mono">{resolvedCount}</strong></span>
        </div>
        <span className="text-[11px] text-surface-500">{APP_CONFIG.FULL_NAME} &copy; 2026</span>
      </footer>
    </div>
  );
}
