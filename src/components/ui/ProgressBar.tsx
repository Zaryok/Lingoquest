'use client';

import React from 'react';
import { ProgressBarProps } from '@/types';
import { clsx } from 'clsx';

export function ProgressBar({
  current,
  max,
  label,
  showPercentage = true,
  className
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-[var(--secondary)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className="progress-bar h-6">
        <div
          className="progress-fill h-full flex items-center justify-center text-xs font-bold text-[var(--text-primary)]"
          style={{ width: `${percentage}%` }}
        >
          {percentage > 20 && `${current}/${max}`}
        </div>
      </div>
      
      {percentage < 20 && (
        <div className="text-center mt-1">
          <span className="text-xs text-[var(--text-muted)]">
            {current}/{max}
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;
