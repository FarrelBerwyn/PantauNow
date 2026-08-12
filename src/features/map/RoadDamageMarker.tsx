import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Report } from '@/types';
import { getSeverityConfig } from '@/lib';
import { RoadDamagePopup } from '@/features/reports';

interface RoadDamageMarkerProps {
  report: Report;
  onSelect?: (report: Report) => void;
  onViewDetails?: (report: Report) => void;
}

/**
 * Generates an SVG HTML string for L.divIcon based on severity configuration.
 * Uses both color AND non-color shape symbols for accessibility.
 */
function createCustomMarkerIcon(severity: Report['severity']) {
  const config = getSeverityConfig(severity);

  // SVG HTML with glow, pin shape, and non-color icon
  const svgHtml = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 group select-none">
      <!-- Pulsing ripple ring for active severity warning -->
      <div 
        class="absolute -inset-2 rounded-full opacity-60 animate-ping pointer-events-none" 
        style="background-color: ${config.color}; animation-duration: ${config.animationDurationMs}ms;"
      ></div>

      <!-- Outer pin container -->
      <div 
        class="relative flex items-center justify-center w-9 h-9 rounded-full border-2 border-white shadow-xl text-white font-bold text-xs backdrop-blur-md transition-shadow group-hover:shadow-2xl"
        style="background-color: ${config.color}; box-shadow: 0 0 15px ${config.color}90;"
      >
        <!-- Non-color shape symbol (triangle, diamond, square, star) -->
        <span class="text-sm select-none drop-shadow-sm font-sans">${config.icon}</span>
      </div>

      <!-- Pin pointer tip -->
      <div 
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r border-b border-white/40"
        style="background-color: ${config.color};"
      ></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-road-damage-marker',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -40],
  });
}

export function RoadDamageMarker({ report, onSelect, onViewDetails }: RoadDamageMarkerProps) {
  const customIcon = createCustomMarkerIcon(report.severity);

  return (
    <Marker
      position={[report.latitude, report.longitude]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onSelect) onSelect(report);
        },
      }}
    >
      <Popup className="custom-leaflet-popup">
        <RoadDamagePopup report={report} onViewDetails={onViewDetails} />
      </Popup>
    </Marker>
  );
}
