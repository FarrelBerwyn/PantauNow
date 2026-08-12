import type { Report } from '@/types';
import { getSeverityConfig, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib';
import { formatDate, formatConfidence } from '@/utils';
import { MapPin, ExternalLink, Bot, ChevronRight, Image as ImageIcon, Wrench, CheckCircle2 } from 'lucide-react';

interface RoadDamagePopupProps {
  report: Report;
  onViewDetails?: (report: Report) => void;
}

export function RoadDamagePopup({ report, onViewDetails }: RoadDamagePopupProps) {
  const severityConfig = getSeverityConfig(report.severity);
  const categoryInfo = CATEGORY_CONFIG[report.category] ?? { label: report.category, icon: '📋' };
  const statusInfo = STATUS_CONFIG[report.status] ?? { label: report.status, color: '#9ca3af' };

  const hasAfterImage = Boolean(report.resolvedImageUrl);

  return (
    <div className="w-[340px] max-w-[90vw] overflow-hidden rounded-2xl border border-white/15 bg-surface-900/95 text-surface-100 shadow-2xl backdrop-blur-xl transition-all">
      {/* ── Top Header Row: Severity & ID Badge ───────────────────────────────── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-surface-950/80 border-b border-white/10 text-xs">
        <div
          className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-bold text-white shadow-sm"
          style={{ backgroundColor: severityConfig.color }}
        >
          <span>{severityConfig.icon}</span>
          <span>{severityConfig.label}</span>
          <span className="opacity-80 text-[10px]">({severityConfig.radiusMeters}m)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-surface-400 bg-surface-900 px-2 py-0.5 rounded border border-white/10">
            {report.id}
          </span>
        </div>
      </div>

      {/* ── 2-Column Photo Comparison Grid ─────────────────────────────────── */}
      <div className="p-3 bg-surface-950/40 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-surface-300 flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-primary-400" /> Kondisi Jalan
          </span>
          <span className="text-[10px] text-surface-400 font-medium">Sebelum vs Sesudah</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Sebelum (Before) */}
          <div className="relative group overflow-hidden rounded-xl bg-surface-950 border border-rose-500/30">
            {report.imageUrl ? (
              <div className="relative h-24 w-full">
                <img
                  src={report.imageUrl}
                  alt="Kondisi Sebelum diperbaiki"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[9px] font-bold text-rose-300 bg-rose-950/90 px-1.5 py-0.5 rounded backdrop-blur-md border border-rose-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Sebelum
                </span>
              </div>
            ) : (
              <div className="flex h-24 w-full items-center justify-center text-surface-500 text-[10px]">
                Tidak ada foto
              </div>
            )}
          </div>

          {/* Sesudah (After) */}
          <div className="relative group overflow-hidden rounded-xl bg-surface-950 border border-emerald-500/30">
            {hasAfterImage ? (
              <div className="relative h-24 w-full">
                <img
                  src={report.resolvedImageUrl}
                  alt="Kondisi Sesudah diperbaiki"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/90 px-1.5 py-0.5 rounded backdrop-blur-md border border-emerald-500/30">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  Sesudah
                </span>
              </div>
            ) : (
              <div className="flex h-24 w-full flex-col items-center justify-center text-center p-2 bg-surface-900/60 text-surface-400">
                <Wrench className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-[10px] font-medium leading-tight text-surface-300">Proses Perbaikan</span>
                <span className="text-[9px] text-surface-500 mt-0.5">Belum Ada Foto</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content & Details ─────────────────────────────────────────────────── */}
      <div className="p-3.5 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-xs leading-snug text-surface-50 tracking-tight line-clamp-1">
          {report.title}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-surface-300 line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* GPS Coordinates Bar */}
        <div className="flex items-center justify-between rounded-xl bg-surface-950/80 p-2 border border-white/10 text-xs">
          <div className="flex items-center gap-1 font-mono text-[10px] text-surface-200 truncate">
            <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
            <span className="truncate">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-0.5 flex-shrink-0"
          >
            Maps <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {/* Category */}
          <div className="flex items-center gap-2 rounded-lg bg-surface-800/80 p-2 border border-surface-700/50">
            <span className="text-sm">{categoryInfo.icon}</span>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-surface-400 font-semibold">Kategori</span>
              <span className="text-[11px] font-medium text-surface-200 truncate">{categoryInfo.label}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 rounded-lg bg-surface-800/80 p-2 border border-surface-700/50">
            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: statusInfo.color }} />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-surface-400 font-semibold">Status</span>
              <span className="text-[11px] font-medium text-surface-200 truncate">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="rounded-xl bg-surface-950/60 p-2 border border-surface-800/80 flex items-center justify-between text-xs">
          <span className="text-surface-400 font-medium text-[10px] flex items-center gap-1">
            <Bot className="w-3 h-3 text-primary-400" /> Prediksi AI
          </span>
          <span className="font-mono font-bold text-[11px] text-primary-400">{formatConfidence(report.aiConfidence)}</span>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-[10px] text-surface-400 pt-1 border-t border-surface-800/80">
          <span>Pelapor: <strong className="text-surface-200 font-medium">{report.reporterName ?? 'Warga'}</strong></span>
          <span>{formatDate(report.createdAt)}</span>
        </div>

        {/* View Details Action Button */}
        <button
          type="button"
          onClick={() => onViewDetails?.(report)}
          className="w-full rounded-xl bg-primary-600 hover:bg-primary-500 py-2 px-3 text-xs font-semibold text-white transition-all duration-150 shadow-md shadow-primary-600/25 flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <span>Buka Detail Lengkap</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
