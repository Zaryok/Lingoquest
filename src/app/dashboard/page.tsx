'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, LessonProgress, SUPPORTED_LANGUAGES } from '@/types';
import { getLessonsByLanguage } from '@/data/lessons';
import { getUserLessonProgress } from '@/lib/firestore';
import CharacterAvatar from '@/components/ui/CharacterAvatar';
import ProgressBar from '@/components/ui/ProgressBar';
import LessonCard from '@/components/ui/LessonCard';
import { PageLoading } from '@/components/ui/LoadingSpinner';
import { Flame, Star, Trophy, LogOut, Home, Settings, Globe } from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      // Get user's target language, default to Spanish if not set
      const targetLanguage = user?.targetLanguage || 'es';

      // Load language-specific lessons
      const languageLessons = getLessonsByLanguage(targetLanguage);

      const lessonsWithLockStatus = languageLessons.map((lesson, index) => {
        // First lesson is always unlocked
        if (index === 0) {
          return { ...lesson, isLocked: false };
        }

        // Check if prerequisites are completed
        const prerequisiteCompleted = lesson.prerequisites?.every(prereqId =>
          user?.lessonsCompleted.includes(prereqId)
        ) ?? true;

        return { ...lesson, isLocked: !prerequisiteCompleted };
      });

      setLessons(lessonsWithLockStatus);
      setLoading(false); // Set loading false immediately after lessons load

      // Load user's lesson progress in background (non-blocking)
      if (user) {
        getUserLessonProgress(user.id)
          .then(progress => {
            setLessonProgress(progress);
          })
          .catch(() => {
            setLessonProgress([]); // Set empty array as fallback
          });
      }
    } catch {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadDashboardData();
  }, [user, router, loadDashboardData]);

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      router.push(`/lesson/${lesson.id}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      // Silent fail for production, still redirect
      router.push('/login');
    }
  };

  if (loading || !user) {
    return <PageLoading text="Loading your realm..." />;
  }

  const completedLessons = user.lessonsCompleted.length;
  const totalLessons = lessons.length;

  const getLanguageByCode = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  };

  const sourceLanguage = user.sourceLanguage ? getLanguageByCode(user.sourceLanguage) : null;
  const targetLanguage = user.targetLanguage ? getLanguageByCode(user.targetLanguage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]">
      {/* Navigation Header */}
      <header className="p-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Home size={20} />
              <span>Home</span>
            </button>

            {sourceLanguage && targetLanguage && (
              <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                <Globe className="text-[var(--secondary)]" size={16} />
                <span className="text-sm text-[var(--text-secondary)]">
                  {sourceLanguage.flag} → {targetLanguage.flag} {targetLanguage.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/settings')}
              className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--secondary)] transition-colors"
              title="Settings"
            >
              <Settings className="text-[var(--text-secondary)]" size={20} />
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <LogOut size={20} />
              <span>Exit Realm</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <CharacterAvatar
                characterType={user.characterType}
                size="lg"
                showLevel
                level={user.level}
              />
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Ready to continue your linguistic adventure?
                </p>
              </div>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* XP Card */}
          <div className="card-medieval p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="text-[var(--secondary)]" size={24} />
                <span className="font-semibold text-[var(--text-primary)]">Mana</span>
              </div>
              <span className="text-2xl font-bold text-[var(--secondary)]">
                {user.xp}
              </span>
            </div>
            <ProgressBar
              current={user.xp % 100}
              max={100}
              label={`Level ${user.level}`}
              showPercentage={false}
            />
          </div>

          {/* Streak Card */}
          <div className="card-medieval p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="text-[var(--accent)]" size={24} />
                <span className="font-semibold text-[var(--text-primary)]">Adventure Chain</span>
              </div>
              <span className="text-2xl font-bold text-[var(--accent)]">
                {user.streak}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {user.streak > 0 ? 'Keep the momentum!' : 'Start your journey!'}
            </p>
          </div>

          {/* Completed Quests */}
          <div className="card-medieval p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="text-[var(--warning)]" size={24} />
                <span className="font-semibold text-[var(--text-primary)]">Quests</span>
              </div>
              <span className="text-2xl font-bold text-[var(--warning)]">
                {completedLessons}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              {completedLessons} of {totalLessons} completed
            </p>
          </div>

          {/* Overall Progress */}
          <div className="card-medieval p-6">
            <div className="mb-4">
              <span className="font-semibold text-[var(--text-primary)]">Overall Progress</span>
            </div>
            <ProgressBar
              current={completedLessons}
              max={totalLessons}
              showPercentage={true}
            />
          </div>
        </div>

        {/* Quest List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Available Quests
            </h2>
            {targetLanguage && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                  <Globe size={16} />
                  <span>Learning: {targetLanguage.flag} {targetLanguage.name}</span>
                </div>
                <button
                  onClick={() => router.push('/language-selection')}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--secondary)] transition-colors"
                >
                  Change Language
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const progress = lessonProgress.find(p => p.lessonId === lesson.id);
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isLocked={lesson.isLocked}
                  progress={progress}
                  onClick={() => handleLessonClick(lesson)}
                />
              );
            })}
          </div>
        </div>

          {/* Motivational Message */}
          <div className="card-medieval p-6 text-center">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Your Journey Continues
            </h3>
            <p className="text-[var(--text-secondary)]">
              Every quest completed brings you closer to mastering the ancient language arts.
              Choose your next adventure and let the learning begin!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
