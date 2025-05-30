'use client';

import React from 'react';
import { Loader2, Sword, Shield } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'medieval';
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'medieval') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative mb-4">
          <div className="flex items-center space-x-2 animate-pulse">
            <Sword className="text-[var(--secondary)] animate-bounce" size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
            <Shield className="text-[var(--accent)] animate-bounce delay-150" size={size === 'lg' ? 32 : size === 'md' ? 24 : 16} />
          </div>
        </div>
        <p className={`text-[var(--text-secondary)] ${textSizeClasses[size]} font-medium`}>
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-[var(--secondary)] mb-2`} />
      <p className={`text-[var(--text-secondary)] ${textSizeClasses[size]}`}>
        {text}
      </p>
    </div>
  );
}

// Full page loading component
export function PageLoading({ text = 'Loading your adventure...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]">
      <div className="text-center">
        <LoadingSpinner size="lg" text={text} variant="medieval" />
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
