/**
 * RoadWatch Indonesia — Report Types
 *
 * Core data model per PRD §11 & user request.
 * These types are the single source of truth for report data shape.
 */

import { z } from 'zod/v4';

// ─── Enums ───────────────────────────────────────────────────────────────────

export const DamageCategory = {
  POTHOLE: 'pothole',
  CRACK: 'crack',
  RUTTING: 'rutting',
  SURFACE_DAMAGE: 'surface_damage',
  OTHER: 'other',
} as const;

export type DamageCategory = (typeof DamageCategory)[keyof typeof DamageCategory];

export const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type Severity = (typeof Severity)[keyof typeof Severity];

export const ReportStatus = {
  REPORTED: 'reported',
  VERIFIED: 'verified',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const damageCategorySchema = z.enum([
  DamageCategory.POTHOLE,
  DamageCategory.CRACK,
  DamageCategory.RUTTING,
  DamageCategory.SURFACE_DAMAGE,
  DamageCategory.OTHER,
]);

export const severitySchema = z.enum([
  Severity.LOW,
  Severity.MEDIUM,
  Severity.HIGH,
  Severity.CRITICAL,
]);

export const reportStatusSchema = z.enum([
  ReportStatus.REPORTED,
  ReportStatus.VERIFIED,
  ReportStatus.IN_PROGRESS,
  ReportStatus.RESOLVED,
  ReportStatus.REJECTED,
]);

export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: damageCategorySchema,
  severity: severitySchema,
  status: reportStatusSchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  /** Image of damage before repair (Sebelum) */
  imageUrl: z.string().url().optional(),
  /** Image of road after repair (Sesudah diperbaiki) */
  resolvedImageUrl: z.string().url().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  reporterName: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Report = z.infer<typeof reportSchema>;

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface ReportFilters {
  categories: DamageCategory[];
  severities: Severity[];
  statuses: ReportStatus[];
  searchQuery: string;
}

// ─── Map Types ───────────────────────────────────────────────────────────────

export interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// ─── AI Prediction Types ─────────────────────────────────────────────────────

export interface AIPrediction {
  damageType: DamageCategory;
  severityPrediction: Severity;
  confidence: number;
  modelVersion: string;
}
