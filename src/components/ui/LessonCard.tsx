'use client';

import React from 'react';
import { LessonCardProps } from '@/types';
import { DIFFICULTY_COLORS } from '@/types';
import { clsx } from 'clsx';
import { Lock, Clock, Star, CheckCircle } from 'lucide-react';

export function LessonCard({ lesson, isLocked, progress, onClick }: LessonCardProps) {
  const isCompleted = progress?.isCompleted || false;
  const progressPercentage = progress 
    ? Math.round((progress.completedSteps.length / lesson.steps.length) * 100)
    : 0;

  const difficultyColor = DIFFICULTY_COLORS[lesson.difficulty];

  return (
    <div
      className={clsx(
        'card-medieval p-6 cursor-pointer relative overflow-hidden',
        isLocked && 'opacity-60 cursor-not-allowed',
        !isLocked && 'hover:scale-105'
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Difficulty indicator */}
      <div
        className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px]"
        style={{ borderTopColor: difficultyColor }}
      />
      
      {/* Lock icon for locked lessons */}
      {isLocked && (
        <div className="absolute top-3 right-3 text-[var(--text-muted)]">
          <Lock size={20} />
        </div>
      )}
      
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-3 right-3 text-[var(--success)]">
          <CheckCircle size={24} />
        </div>
      )}
      
      <div className="space-y-4">
        {/* Title and description */}
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            {lesson.title}
          </h3>
          <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
            {lesson.description}
          </p>
        </div>
        
        {/* Lesson metadata */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-[var(--text-muted)]">
              <Clock size={16} />
              <span>{lesson.estimatedTime}m</span>
            </div>
            
            <div className="flex items-center space-x-1 text-[var(--secondary)]">
              <Star size={16} />
              <span>{lesson.xpReward} XP</span>
            </div>
          </div>
          
          <div className="text-xs px-2 py-1 rounded-full border border-current"
               style={{ color: difficultyColor }}>
            {lesson.difficulty.toUpperCase()}
          </div>
        </div>
        
        {/* Progress bar for started lessons */}
        {progress && !isCompleted && progressPercentage > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Progress</span>
              <span className="text-[var(--secondary)]">{progressPercentage}%</span>
            </div>
            <div className="progress-bar h-2">
              <div
                className="progress-fill h-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Completion status */}
        {isCompleted && progress && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--success)] font-medium">
              ✓ Completed
            </span>
            <span className="text-[var(--text-muted)]">
              Score: {progress.score}%
            </span>
          </div>
        )}
        
        {/* Category tag */}
        <div className="flex justify-between items-center">
          <span className="text-xs px-3 py-1 bg-[var(--surface-light)] text-[var(--text-secondary)] rounded-full">
            {lesson.category}
          </span>
          
          {!isLocked && !isCompleted && (
            <button className="text-[var(--secondary)] hover:text-[var(--secondary-dark)] font-medium text-sm transition-colors">
              {progressPercentage > 0 ? 'Continue Quest' : 'Start Quest'}
            </button>
          )}
        </div>
      </div>
      
      {/* Hover effect overlay */}
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
}

export default LessonCard;
