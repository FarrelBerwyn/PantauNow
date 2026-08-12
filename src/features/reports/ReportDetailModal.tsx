import { useState } from 'react';
import type { Report } from '@/types';
import { Modal } from '@/components/ui';
import { SEVERITY_CONFIG, CATEGORY_CONFIG, STATUS_CONFIG } from '@/lib';
import { formatDate, formatConfidence } from '@/utils';
import {
  MapPin,
  ExternalLink,
  User,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Wrench,
  ArrowRight,
} from 'lucide-react';

export interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onLocateOnMap?: (report: Report) => void;
}

export function ReportDetailModal({ report, isOpen, onClose, onLocateOnMap }: ReportDetailModalProps) {
  const [activePhotoTab, setActivePhotoTab] = useState<'before' | 'after'>('before');

  if (!report) return null;

  const severityConfig = SEVERITY_CONFIG[report.severity];
  const categoryInfo = CATEGORY_CONFIG[report.category] ?? { label: report.category, icon: '📋' };
  const statusInfo = STATUS_CONFIG[report.status] ?? { label: report.status, color: '#9ca3af' };
  const hasAfterImage = Boolean(report.resolvedImageUrl);

  const handleLocateClick = () => {
    onClose();
    if (onLocateOnMap) {
      onLocateOnMap(report);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs text-white font-bold shadow"
            style={{ backgroundColor: severityConfig.color }}
          >
            {severityConfig.icon}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-normal text-surface-400 font-mono">ID: {report.id}</span>
            <span className="text-sm font-bold text-white line-clamp-1">{report.title}</span>
          </div>
        </div>
      }
    >
      {/* ── Photo Comparison Section ────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary-400" /> Komparasi Kondisi Jalan
          </span>
          {hasAfterImage && (
            <div className="flex items-center gap-1 rounded-lg bg-surface-950 p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActivePhotoTab('before')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activePhotoTab === 'before'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                Sebelum
              </button>
              <button
                type="button"
                onClick={() => setActivePhotoTab('after')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  activePhotoTab === 'after'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                Sesudah
              </button>
            </div>
          )}
        </div>

        {/* Photo Display Grid / Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Before Photo */}
          <div className={`relative group overflow-hidden rounded-xl bg-surface-950 border border-rose-500/30 transition-all ${
            hasAfterImage && activePhotoTab === 'after' ? 'hidden md:block opacity-60' : 'block'
          }`}>
            {report.imageUrl ? (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={report.imageUrl}
                  alt="Kondisi Sebelum Perbaikan"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-bold text-rose-300 bg-rose-950/90 px-2 py-1 rounded-md backdrop-blur-md border border-rose-500/40">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  Sebelum Diperbaiki
                </span>
              </div>
            ) : (
              <div className="flex h-48 w-full items-center justify-center text-surface-500 text-xs">
                Tidak ada foto sebelum
              </div>
            )}
          </div>

          {/* After Photo */}
          <div className={`relative group overflow-hidden rounded-xl bg-surface-950 border border-emerald-500/30 transition-all ${
            hasAfterImage && activePhotoTab === 'before' ? 'hidden md:block opacity-60' : 'block'
          }`}>
            {hasAfterImage ? (
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={report.resolvedImageUrl}
                  alt="Kondisi Sesudah Perbaikan"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/90 px-2 py-1 rounded-md backdrop-blur-md border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Sesudah Diperbaiki
                </span>
              </div>
            ) : (
              <div className="flex h-48 w-full flex-col items-center justify-center p-4 bg-surface-950/80 text-surface-400 text-center">
                <Wrench className="w-8 h-8 mb-2 text-amber-400 animate-bounce" />
                <span className="text-xs font-semibold text-surface-200">Proses Perbaikan</span>
                <span className="text-[11px] text-surface-400 mt-1 max-w-[200px]">
                  Tim teknis sedang menangani lokasi ini. Foto sesudah akan diperbarui setelah selesai.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Key Metrics & Status Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Severity */}
        <div className="rounded-xl bg-surface-950/80 p-3 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-400">Tingkat Kerusakan</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: severityConfig.color }}
            >
              <span>{severityConfig.icon}</span>
              <span>{severityConfig.label}</span>
            </span>
          </div>
          <span className="text-[10px] text-surface-400 mt-1 font-mono">Radius: {severityConfig.radiusMeters}m</span>
        </div>

        {/* Category */}
        <div className="rounded-xl bg-surface-950/80 p-3 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-400">Kategori</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-base">{categoryInfo.icon}</span>
            <span className="text-xs font-semibold text-surface-200 truncate">{categoryInfo.label}</span>
          </div>
          <span className="text-[10px] text-surface-400 mt-1">Infrastruktur Jalan</span>
        </div>

        {/* Status */}
        <div className="rounded-xl bg-surface-950/80 p-3 border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-surface-400">Status Penanganan</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusInfo.color }} />
            <span className="text-xs font-semibold text-surface-200 truncate">{statusInfo.label}</span>
          </div>
          <span className="text-[10px] text-surface-400 mt-1 font-mono">{report.status.toUpperCase()}</span>
        </div>
      </div>

      {/* ── AI Confidence Gauge ──────────────────────────────────────────────── */}
      <div className="rounded-xl bg-gradient-to-r from-primary-950/60 to-surface-950 p-3.5 border border-primary-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-300">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span>Deteksi & Klasifikasi AI</span>
          </div>
          <span className="font-mono font-bold text-sm text-primary-400">
            {formatConfidence(report.aiConfidence)} Accuracy
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-cyan-400 transition-all duration-500 shadow-sm shadow-primary-500/50"
            style={{ width: `${(report.aiConfidence ?? 0) * 100}%` }}
          />
        </div>
        <p className="text-[11px] text-surface-400 leading-relaxed">
          Model AI menganalisis tekstur & kedalaman retakan berdasarkan citra visual pelaporan warga.
        </p>
      </div>

      {/* ── Location & Coordinates ──────────────────────────────────────────── */}
      <div className="rounded-xl bg-surface-950/80 p-3.5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-surface-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Lokasi GPS Koordinat
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-1 hover:underline"
          >
            Google Maps <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="font-mono text-xs text-surface-200 bg-surface-900 p-2.5 rounded-lg border border-white/5 flex items-center justify-between">
          <span>Lat: {report.latitude.toFixed(6)}</span>
          <span className="text-surface-600">|</span>
          <span>Lng: {report.longitude.toFixed(6)}</span>
        </div>
      </div>

      {/* ── Metadata Footer Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 text-xs text-surface-400 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-surface-500" />
          <span>Pelapor: <strong className="text-surface-200">{report.reporterName ?? 'Warga Anonymous'}</strong></span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Calendar className="w-3.5 h-3.5 text-surface-500" />
          <span>Dilaporkan: <strong className="text-surface-200">{formatDate(report.createdAt)}</strong></span>
        </div>
      </div>

      {/* ── Actions Row ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-surface-300 hover:text-white transition-colors"
        >
          Tutup
        </button>
        <button
          type="button"
          onClick={handleLocateClick}
          className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-md shadow-primary-600/30 transition-all flex items-center gap-1.5"
        >
          <span>Tampilkan di Peta</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Modal>
  );
}
