/**
 * RoadWatch Indonesia — Constants
 *
 * Application-wide constants.
 */

/** Indonesia map defaults */
export const MAP_CONFIG = {
  /** Center of Indonesia (approximately) */
  DEFAULT_CENTER: [-2.5, 118.0] as [number, number],
  /** Default zoom level to show all of Indonesia */
  DEFAULT_ZOOM: 5,
  /** Min zoom level */
  MIN_ZOOM: 4,
  /** Max zoom level */
  MAX_ZOOM: 18,
  /** Tile layer URL */
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  /** Tile layer attribution */
  TILE_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;

/** Application metadata */
export const APP_CONFIG = {
  NAME: 'PantauNow',
  FULL_NAME: 'PantauNow',
  TAGLINE: 'Laporkan Jalan Rusak, Pantau Perbaikannya',
  VERSION: '0.1.0',
} as const;

/** Indonesia bounding box for validation */
export const INDONESIA_BOUNDS = {
  NORTH: 6.0,
  SOUTH: -11.0,
  WEST: 95.0,
  EAST: 141.0,
} as const;
