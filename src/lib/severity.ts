/**
 * RoadWatch Indonesia — Severity Configuration
 *
 * Centralized severity rules per PRD §7 & §8.
 * Maps severity levels to visual properties, radius, and animation timing.
 * Business logic is kept here, NOT in Leaflet components.
 */

import type { Severity } from '@/types';

export interface SeverityConfig {
  level: Severity;
  label: string;
  /** Warning radius in meters */
  radiusMeters: number;
  /** Priority rank (1=lowest, 4=highest) */
  priority: number;
  /** Primary color (hex) */
  color: string;
  /** Background/fill color with transparency */
  bgColor: string;
  /** CSS animation duration in ms */
  animationDurationMs: number;
  /** Icon indicator (non-color differentiation per PRD §15) */
  icon: string;
  /** Description for legend */
  description: string;
}

export const SEVERITY_CONFIG: Record<Severity, SeverityConfig> = {
  low: {
    level: 'low',
    label: 'Low',
    radiusMeters: 50,
    priority: 1,
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    animationDurationMs: 4000,
    icon: '△',
    description: 'Minor damage, low priority',
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    radiusMeters: 100,
    priority: 2,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    animationDurationMs: 3000,
    icon: '◆',
    description: 'Visible damage, needs monitoring',
  },
  high: {
    level: 'high',
    label: 'High',
    radiusMeters: 200,
    priority: 3,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    animationDurationMs: 2000,
    icon: '■',
    description: 'Significant damage, high attention',
  },
  critical: {
    level: 'critical',
    label: 'Critical',
    radiusMeters: 500,
    priority: 4,
    color: '#7c3aed',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    animationDurationMs: 1000,
    icon: '★',
    description: 'Severe damage, immediate priority',
  },
} as const;

/**
 * Get severity config for a given severity level.
 */
export function getSeverityConfig(severity: Severity): SeverityConfig {
  return SEVERITY_CONFIG[severity];
}

/**
 * Get radius in meters for a given severity.
 */
export function getSeverityRadius(severity: Severity): number {
  return SEVERITY_CONFIG[severity].radiusMeters;
}

/**
 * Get ordered severity levels from lowest to highest priority.
 */
export function getSeverityLevels(): Severity[] {
  return ['low', 'medium', 'high', 'critical'];
}

/**
 * Category display configuration.
 */
export const CATEGORY_CONFIG: Record<string, { label: string; icon: string }> = {
  pothole: { label: 'Pothole', icon: '🕳️' },
  crack: { label: 'Crack', icon: '⚡' },
  rutting: { label: 'Rutting', icon: '〰️' },
  surface_damage: { label: 'Surface Damage', icon: '🔨' },
  other: { label: 'Other', icon: '📋' },
};

/**
 * Status display configuration.
 */
export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  reported: { label: 'Reported', color: '#6b7280' },
  verified: { label: 'Verified', color: '#3b82f6' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  resolved: { label: 'Resolved', color: '#22c55e' },
  rejected: { label: 'Rejected', color: '#ef4444' },
};
