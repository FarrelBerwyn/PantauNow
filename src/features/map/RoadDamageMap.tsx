/**
 * RoadWatch Indonesia — RoadDamageMap Component
 *
 * Interactive Leaflet Map component centered on Jakarta / Indonesia.
 * Renders OSM tiles, road damage markers, floating map controls, and handles viewport operations.
 */

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import type { Report } from '@/types';
import { MAP_CONFIG } from '@/lib';
import { RoadDamageMarker } from './RoadDamageMarker';

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
    <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-2">
      <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface-900/80 backdrop-blur-md shadow-2xl">
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="flex h-9 w-9 items-center justify-center text-surface-200 hover:bg-surface-800 hover:text-white transition-colors border-b border-white/10"
        >
          ➕
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="flex h-9 w-9 items-center justify-center text-surface-200 hover:bg-surface-800 hover:text-white transition-colors"
        >
          ➖
        </button>
      </div>

      <button
        type="button"
        onClick={handleResetCenter}
        title="Reset Ke Wilayah Jakarta"
        className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-surface-900/80 px-3 text-xs font-medium text-surface-200 hover:bg-surface-800 hover:text-white transition-colors backdrop-blur-md shadow-2xl"
      >
        <span>🎯</span>
        <span className="hidden sm:inline">Reset Jakarta</span>
      </button>
    </div>
  );
}

interface RoadDamageMapProps {
  reports: Report[];
  selectedReport?: Report | null;
  onSelectReport?: (report: Report) => void;
  center?: [number, number];
  zoom?: number;
}

export function RoadDamageMap({
  reports,
  selectedReport,
  onSelectReport,
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
          />
        ))}
      </MapContainer>
    </div>
  );
}
