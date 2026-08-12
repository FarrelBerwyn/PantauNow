import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { Report } from '@/types';
import { MAP_CONFIG } from '@/lib';
import { RoadDamageMarker } from './RoadDamageMarker';
import { Plus, Minus, Target } from 'lucide-react';

/** Center of Jakarta (Monas area) */
export const JAKARTA_CENTER: [number, number] = [-6.2088, 106.8456];
export const JAKARTA_DEFAULT_ZOOM = 12;

interface MapViewControllerProps {
  selectedReport?: Report | null;
}

/**
 * Controller component to handle map flyTo when a report is selected
 */
function MapViewController({ selectedReport }: MapViewControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedReport) {
      map.flyTo([selectedReport.latitude, selectedReport.longitude], 15, {
        duration: 1.5,
      });
    }
  }, [selectedReport, map]);

  return null;
}

/**
 * Custom Floating Map Controls Component (Zoom In, Zoom Out, Reset Center)
 */
function FloatingMapControls() {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleResetCenter = () => map.flyTo(JAKARTA_CENTER, JAKARTA_DEFAULT_ZOOM, { duration: 1.2 });

  return (
    <div className="absolute bottom-16 right-4 sm:bottom-6 sm:right-6 z-[30] flex flex-col gap-2 pointer-events-auto select-none">
      {/* Zoom Buttons Group */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-white/15 bg-surface-900/90 backdrop-blur-md shadow-2xl">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Perbesar Peta (Zoom In)"
          aria-label="Zoom In"
          className="flex h-10 w-10 items-center justify-center text-surface-200 hover:bg-surface-800 hover:text-white transition-colors border-b border-white/10 active:bg-surface-700"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Perkecil Peta (Zoom Out)"
          aria-label="Zoom Out"
          className="flex h-10 w-10 items-center justify-center text-surface-200 hover:bg-surface-800 hover:text-white transition-colors active:bg-surface-700"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Reset Center Button */}
      <button
        type="button"
        onClick={handleResetCenter}
        title="Reset Lokasi Ke Wilayah Jakarta"
        className="flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-surface-900/90 px-3.5 text-xs font-semibold text-surface-200 hover:bg-surface-800 hover:text-white transition-all backdrop-blur-md shadow-2xl active:scale-[0.97]"
      >
        <Target className="w-4 h-4 text-primary-400" />
        <span className="hidden sm:inline">Reset Jakarta</span>
      </button>
    </div>
  );
}

interface RoadDamageMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onSelectReport?: (report: Report) => void;
  onViewDetails?: (report: Report) => void;
  center?: [number, number];
  zoom?: number;
}

export function RoadDamageMap({
  reports,
  selectedReport,
  onSelectReport,
  onViewDetails,
  center = JAKARTA_CENTER,
  zoom = JAKARTA_DEFAULT_ZOOM,
}: RoadDamageMapProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        zoomControl={false}
        className="h-full w-full z-0 bg-surface-950"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.TILE_ATTRIBUTION}
          maxZoom={MAP_CONFIG.MAX_ZOOM}
        />

        {/* View Controller for programmatic pan/zoom */}
        <MapViewController selectedReport={selectedReport} />

        {/* Custom Glassmorphism Floating Controls */}
        <FloatingMapControls />

        {/* Render Road Damage Markers */}
        {reports.map((report) => (
          <RoadDamageMarker
            key={report.id}
            report={report}
            onSelect={onSelectReport}
            onViewDetails={onViewDetails}
          />
        ))}
      </MapContainer>
    </div>
  );
}
