import React from 'react';
import type { Severity, ReportStatus } from '@/types';
import { SEVERITY_CONFIG, STATUS_CONFIG } from '@/lib';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, Wrench, XCircle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'severity' | 'status';
  severity?: Severity;
  status?: ReportStatus;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  severity,
  status,
  size = 'md',
  icon,
  className = '',
  style,
  ...props
}: BadgeProps) {
  let bgStyle: React.CSSProperties = {};
  let content = children;
  let defaultIcon: React.ReactNode = icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-semibold gap-2',
  }[size];

  if (variant === 'severity' && severity) {
    const config = SEVERITY_CONFIG[severity];
    if (config) {
      bgStyle = { backgroundColor: config.color };

      if (!defaultIcon) {
        if (severity === 'critical') defaultIcon = <ShieldAlert className="w-3 h-3" />;
        else if (severity === 'high') defaultIcon = <AlertTriangle className="w-3 h-3" />;
        else if (severity === 'medium') defaultIcon = <AlertCircle className="w-3 h-3" />;
        else defaultIcon = <Info className="w-3 h-3" />;
      }

      if (!content) {
        content = config.label;
      }
    }
  } else if (variant === 'status' && status) {
    const config = STATUS_CONFIG[status];
    if (config) {
      bgStyle = { backgroundColor: config.color };

      if (!defaultIcon) {
        if (status === 'resolved') defaultIcon = <CheckCircle2 className="w-3 h-3" />;
        else if (status === 'in_progress') defaultIcon = <Wrench className="w-3 h-3" />;
        else if (status === 'reported' || status === 'verified') defaultIcon = <Clock className="w-3 h-3" />;
        else if (status === 'rejected') defaultIcon = <XCircle className="w-3 h-3" />;
      }

      if (!content) {
        content = config.label;
      }
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-md font-medium tracking-tight text-white shadow-sm transition-all ${sizeClasses} ${className}`}
      style={{ ...bgStyle, ...style }}
      {...props}
    >
      {defaultIcon}
      {content && <span className="truncate">{content}</span>}
    </span>
  );
}
