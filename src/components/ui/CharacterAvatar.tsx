'use client';

import React from 'react';
import { CharacterAvatarProps } from '@/types';
import { CHARACTER_TYPES } from '@/types';
import { clsx } from 'clsx';

const sizeClasses = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
  xl: 'w-32 h-32 text-6xl'
};

export function CharacterAvatar({
  characterType,
  size = 'md',
  showLevel = false,
  level = 1
}: CharacterAvatarProps) {
  const character = CHARACTER_TYPES.find(char => char.id === characterType);
  
  if (!character) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <div
        className={clsx(
          'card-medieval flex items-center justify-center relative overflow-hidden',
          sizeClasses[size]
        )}
      >
        <span className="select-none">
          {character.avatar}
        </span>
        
        {/* Character glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {showLevel && (
        <div className="absolute -bottom-2 -right-2 bg-[var(--accent)] text-[var(--text-primary)] text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[var(--surface)]">
          {level}
        </div>
      )}
      
      {/* Character type tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--surface)] text-[var(--text-primary)] text-sm rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">{character.name}</div>
        <div className="text-xs text-[var(--text-muted)]">{character.bonuses.specialAbility}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[var(--surface)]" />
      </div>
    </div>
  );
}

export default CharacterAvatar;
