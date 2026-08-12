/**
 * RoadWatch Indonesia — Dashboard Page
 *
 * Refined Layout with 16px (gap-4) Minimum Padding & Spacing Across All Screen Edges,
 * Fixed Search Icon Alignment, Futuristic PantauNow Branding, and Bottom-Right Collapse Button.
 */

import { useState, useMemo } from 'react';
import { APP_CONFIG, SEVERITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib';
import { MOCK_REPORTS } from '@/data';
import { RoadDamageMap } from '@/features/map';
import { ReportDetailModal } from '@/features/reports';
import type { Report, Severity } from '@/types';
import {
  Search,
  X,
  MapPin,
  ListFilter,
  Clock,
  Wrench,
  CheckCircle2,
  List,
  Map as MapIcon,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  PanelLeftOpen,
} from 'lucide-react';

type StatusFilterGroup = 'all' | 'unhandled' | 'in_progress' | 'resolved';

const STATUS_TABS: { id: StatusFilterGroup; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Semua', icon: <ListFilter className="w-4 h-4" /> },
  { id: 'unhandled', label: 'Belum Dikerjakan', icon: <Clock className="w-4 h-4 text-amber-400" /> },
  { id: 'in_progress', label: 'Sedang Dikerjakan', icon: <Wrench className="w-4 h-4 text-primary-400" /> },
  { id: 'resolved', label: 'Selesai', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
];

export default function DashboardPage() {
  const [reports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailReportModal, setDetailReportModal] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusGroup, setSelectedStatusGroup] = useState<StatusFilterGroup>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleSelectReportOnMap = (report: Report) => {
    setSelectedReport(report);
    // On mobile, automatically switch to map view when a report is focused
    setMobileView('map');
  };

  return (
    <div className="flex h-screen flex-col bg-surface-950 text-surface-100 select-none overflow-hidden font-sans">
      {/* ═══════════════════ TOP BAR: Header, Search & Filters ═══════════════════ */}
      <header className="flex h-16 items-center justify-between gap-6 border-b border-white/10 bg-surface-900/95 px-6 backdrop-blur-xl z-20 flex-shrink-0">
        {/* Left Section: Brand Logo & Title */}
        <div className="flex items-center gap-3.5 flex-shrink-0">
          {/* Logo Icon with Glowing Gradient */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-75 blur-sm animate-pulse" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-surface-950 border border-cyan-400/40 text-cyan-400 font-black text-base shadow-xl">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {/* Brand Name Typography */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
                Pantau<span className="text-cyan-400">Now</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[9px] font-extrabold text-cyan-300 tracking-wider uppercase shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                AI LIVE
              </span>
            </div>
            <span className="text-[10px] text-surface-400 font-medium tracking-wide hidden sm:inline">
              Peta Deteksi & Monitoring Kerusakan Jalan
            </span>
          </div>
        </div>

        {/* Center Section: Search Bar Input (Clear 44px left padding so text never overlaps icon) */}
        <div className="relative flex-1 max-w-md mx-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none flex items-center justify-center">
            <Search className="w-4 h-4 text-surface-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari lokasi, nama jalan, atau ID..."
            className="w-full rounded-2xl bg-surface-800/90 pl-11 pr-10 py-2 text-xs text-surface-100 placeholder-surface-400 border border-white/10 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-surface-400 hover:text-white hover:bg-surface-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Section: Severity Filter Scroll Pills (Right Gap Protected) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-shrink-0 pr-2 max-w-[220px] sm:max-w-none">
          {(['all', 'critical', 'high', 'medium', 'low'] as (Severity | 'all')[]).map((sev) => {
            const isAll = sev === 'all';
            const cfg = isAll ? null : SEVERITY_CONFIG[sev as Severity];
            const isActive = selectedSeverity === sev;

            let icon: React.ReactNode = null;
            if (sev === 'critical') icon = <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />;
            else if (sev === 'high') icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />;
            else if (sev === 'medium') icon = <AlertCircle className="w-3.5 h-3.5 text-amber-300" />;
            else if (sev === 'low') icon = <Info className="w-3.5 h-3.5 text-emerald-300" />;

            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev as Severity | 'all')}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-semibold transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? isAll
                      ? 'bg-surface-600 text-white shadow-sm border border-white/20'
                      : 'text-white shadow-md border border-white/30'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/80 border border-transparent'
                }`}
                style={isActive && cfg ? { backgroundColor: cfg.color } : undefined}
              >
                {icon}
                <span>{isAll ? 'Semua' : cfg?.label ?? sev}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══════════════════ MAIN CONTENT: Sidebar LEFT + Map RIGHT ═══════════════ */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ─── LEFT SIDEBAR (Collapsible on Desktop, Full Overlay on Mobile) ───── */}
        <aside
          className={`flex-shrink-0 flex-col border-r border-white/10 bg-surface-900/95 backdrop-blur-md overflow-hidden z-10 transition-all duration-300 ease-in-out relative ${
            // Desktop collapsed logic
            isSidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none' : 'lg:w-[430px] lg:opacity-100'
          } ${
            // Mobile active view logic
            mobileView === 'list' ? 'flex absolute inset-0 w-full z-20' : 'hidden lg:flex'
          }`}
        >
          {/* Sidebar Header: Status Tabs with 16px Padding & 12px Gap */}
          <div className="p-4 border-b border-white/10 bg-surface-950/90 flex-shrink-0">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-1 py-1">
              {STATUS_TABS.map((tab) => {
                const isActive = selectedStatusGroup === tab.id;
                const count = countForGroup(tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedStatusGroup(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 border border-primary-400/30'
                        : 'bg-surface-800/70 text-surface-300 hover:text-white hover:bg-surface-800 border border-white/5'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white font-bold' : 'bg-surface-950 text-surface-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Count & Quick Reset Bar (Protected 16px Edge Padding) */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-surface-950/40 flex-shrink-0">
            <span className="text-xs text-surface-300 font-medium flex items-center gap-1.5">
              <span>Menampilkan</span>
              <strong className="text-white font-bold font-mono px-2 py-0.5 rounded-md bg-surface-800 border border-white/10">
                {filteredReports.length}
              </strong>
              <span>Laporan</span>
            </span>
            {selectedSeverity !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSeverity('all')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold"
              >
                Reset Filter Severity
              </button>
            )}
          </div>

          {/* ─── Scrollable Report Cards List (16px Outer Padding p-4, 16px Gap space-y-4) ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <Search className="w-10 h-10 text-surface-500 mb-2" />
                <p className="text-sm font-semibold text-surface-300">Tidak ada laporan ditemukan</p>
                <p className="text-xs text-surface-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const severityConfig = SEVERITY_CONFIG[report.severity];
                const categoryInfo = CATEGORY_CONFIG[report.category] ?? { label: report.category, icon: '📋' };
                const statusInfo = STATUS_CONFIG[report.status] ?? { label: report.status, color: '#9ca3af' };
                const isSelected = selectedReport?.id === report.id;

                return (
                  <div
                    key={report.id}
                    className={`w-full rounded-2xl border p-4 transition-all duration-200 flex gap-4 ${
                      isSelected
                        ? 'bg-primary-950/70 border-cyan-500/60 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                        : 'bg-surface-800/50 border-white/10 hover:bg-surface-800/90 hover:border-white/20 shadow-md'
                    }`}
                  >
                    {/* Image Thumbnail */}
                    <div
                      onClick={() => handleSelectReportOnMap(report)}
                      className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-surface-950 cursor-pointer group shadow-md"
                    >
                      {report.imageUrl ? (
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-surface-600 text-base">
                          <MapPin className="w-6 h-6" />
                        </div>
                      )}
                      {/* Mini severity badge overlay */}
                      <span
                        className="absolute top-1.5 left-1.5 flex items-center justify-center h-5 w-5 rounded-md text-[10px] font-bold text-white shadow-md border border-white/20"
                        style={{ backgroundColor: severityConfig.color }}
                        title={`Severity: ${severityConfig.label}`}
                      >
                        {severityConfig.icon}
                      </span>
                    </div>

                    {/* Report Information */}
                    <div className="flex flex-col flex-1 min-w-0 justify-between py-0.5">
                      <div>
                        {/* Title */}
                        <h4
                          onClick={() => handleSelectReportOnMap(report)}
                          className="text-xs sm:text-sm font-bold text-white line-clamp-1 cursor-pointer hover:text-cyan-300 transition-colors leading-snug tracking-tight"
                        >
                          {report.title}
                        </h4>

                        {/* Location Coordinates */}
                        <p className="text-[11px] text-surface-400 line-clamp-1 mt-1 flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                          <span>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                        </p>
                      </div>

                      {/* Badges Row */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Category */}
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-950 px-2 py-0.5 text-[10px] text-surface-300 border border-white/10 font-medium">
                          <span>{categoryInfo.icon}</span>
                          <span className="truncate max-w-[100px]">{categoryInfo.label}</span>
                        </span>

                        {/* Status */}
                        <span
                          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleSelectReportOnMap(report)}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Fokus Peta</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDetailReportModal(report)}
                          className="text-surface-200 hover:text-white font-semibold transition-colors flex items-center gap-1 bg-surface-700/60 hover:bg-surface-700 px-2.5 py-1 rounded-lg border border-white/10"
                        >
                          <span>Detail</span>
                          <ChevronRight className="w-3 h-3 text-surface-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ─── Footer & Collapse Button at Bottom-Right of Sidebar (16px Padding p-4) ─── */}
          <div className="border-t border-white/10 bg-surface-950/90 p-4 flex-shrink-0 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
                Legend Warning Radius
              </span>

              {/* Bottom Right Sidebar Collapse Button */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                title="Sembunyikan Panel Sidebar"
                className="hidden lg:flex items-center gap-1.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 hover:text-white px-3.5 py-1.5 text-xs font-semibold border border-white/15 shadow-md transition-all active:scale-95"
              >
                <span>Sembunyikan</span>
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.values(SEVERITY_CONFIG).map((cfg) => (
                <div key={cfg.level} className="flex items-center gap-1.5 text-xs bg-surface-900/60 p-2 rounded-xl border border-white/5">
                  <span
                    className="h-3.5 w-3.5 rounded-md flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {cfg.icon}
                  </span>
                  <span className="text-surface-200 font-medium truncate">{cfg.label}</span>
                  <span className="text-surface-400 font-mono text-[10px] ml-auto">({cfg.radiusMeters}m)</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── MAP CANVAS ─────────────────────────────────────────────────────── */}
        <main className={`flex-1 relative bg-surface-950 ${
          mobileView === 'list' ? 'hidden lg:block' : 'block'
        }`}>
          {/* Floating Expand Sidebar Button (When Sidebar Collapsed on Desktop) */}
          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="hidden lg:flex absolute top-4 left-4 z-[30] items-center gap-2 rounded-2xl border border-white/15 bg-surface-900/90 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md shadow-2xl hover:bg-surface-800 transition-all active:scale-95"
            >
              <PanelLeftOpen className="w-4 h-4 text-cyan-400" />
              <span>Buka Sidebar ({filteredReports.length})</span>
            </button>
          )}

          <RoadDamageMap
            reports={filteredReports}
            selectedReport={selectedReport}
            onSelectReport={setSelectedReport}
            onViewDetails={(r) => setDetailReportModal(r)}
          />

          {/* ─── Floating Mobile View Switcher (Map 🗺️ / Daftar 📋) ────────────── */}
          <div className="lg:hidden fixed bottom-14 left-1/2 -translate-x-1/2 z-[40] flex items-center rounded-full bg-surface-900/95 border border-white/20 p-1 backdrop-blur-xl shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileView('map')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mobileView === 'map'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-surface-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                mobileView === 'list'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-surface-300 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar ({filteredReports.length})</span>
            </button>
          </div>
        </main>
      </div>

      {/* ═══════════════════ BOTTOM KPI STRIP ════════════════════════════════════ */}
      <footer className="flex h-10 items-center justify-between border-t border-white/10 bg-surface-900/90 px-6 text-xs z-20 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-5 text-[11px] sm:text-xs overflow-x-auto no-scrollbar">
          <span className="text-surface-400 whitespace-nowrap">Total: <strong className="text-white font-mono">{totalReports}</strong></span>
          <span className="text-surface-400 whitespace-nowrap">Belum: <strong className="text-amber-400 font-mono">{unhandledCount}</strong></span>
          <span className="text-surface-400 whitespace-nowrap">Proses: <strong className="text-primary-400 font-mono">{inProgressCount}</strong></span>
          <span className="text-surface-400 whitespace-nowrap">Selesai: <strong className="text-emerald-400 font-mono">{resolvedCount}</strong></span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-surface-500 whitespace-nowrap hidden xs:inline">{APP_CONFIG.FULL_NAME} &copy; 2026</span>
      </footer>

      {/* ═══════════════════ REPORT DETAIL MODAL ═════════════════════════════════ */}
      <ReportDetailModal
        report={detailReportModal}
        isOpen={Boolean(detailReportModal)}
        onClose={() => setDetailReportModal(null)}
        onLocateOnMap={handleSelectReportOnMap}
      />
    </div>
  );
}
