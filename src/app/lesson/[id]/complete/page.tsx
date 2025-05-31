'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllLessons } from '@/data/lessons';
import { Trophy, Star, Flame, ArrowRight, RotateCcw } from 'lucide-react';

export default function LessonCompletePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const lessonId = params.id as string;

  const [showConfetti, setShowConfetti] = useState(false);
  const allLessons = getAllLessons();
  const lesson = allLessons.find(l => l.id === lessonId);

  const xpGained = parseInt(searchParams.get('xp') || '0');
  const score = parseInt(searchParams.get('score') || '0');
  const streak = parseInt(searchParams.get('streak') || '0');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Show confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [user, router]);

  const getScoreMessage = (score: number) => {
    if (score === 100) return "Perfect! You are a true language master!";
    if (score >= 80) return "Excellent work! You're making great progress!";
    if (score >= 60) return "Good job! Keep practicing to improve!";
    return "Nice try! Every attempt makes you stronger!";
  };

  const getScoreColor = (score: number) => {
    if (score === 100) return 'var(--secondary)';
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--accent)';
  };

  const handleContinue = () => {
    console.log('Navigating back to dashboard');
    router.push('/dashboard');
  };

  const handleRetry = () => {
    console.log('Retrying lesson:', lessonId);
    router.push(`/lesson/${lessonId}`);
  };

  if (!user || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--secondary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['⭐', '🎉', '✨', '🏆', '🎊'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Main Completion Card */}
        <div className="card-medieval p-8 text-center space-y-6 bounce-in">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary-dark)] rounded-full flex items-center justify-center">
              <Trophy size={48} className="text-[var(--text-primary)]" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
              Quest Complete!
            </h1>
            <h2 className="text-2xl text-[var(--secondary)] mb-4">
              {lesson.title}
            </h2>
            <p className="text-[var(--text-secondary)]">
              {getScoreMessage(score)}
            </p>
          </div>

          {/* Score Display */}
          <div className="space-y-4">
            <div className="text-center">
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: getScoreColor(score) }}
              >
                {score}%
              </div>
              <p className="text-[var(--text-muted)]">Final Score</p>
            </div>
          </div>

          {/* Rewards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* XP Gained */}
            <div className="card-medieval p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="text-[var(--secondary)]" size={24} />
              </div>
              <div className="text-2xl font-bold text-[var(--secondary)]">
                +{xpGained}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                Mana Gained
              </div>
            </div>

            {/* New Level */}
            <div className="card-medieval p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="text-[var(--warning)]" size={24} />
              </div>
              <div className="text-2xl font-bold text-[var(--warning)]">
                {user.level}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                Current Level
              </div>
            </div>

            {/* Streak */}
            <div className="card-medieval p-4">
              <div className="flex items-center justify-center mb-2">
                <Flame className="text-[var(--accent)]" size={24} />
              </div>
              <div className="text-2xl font-bold text-[var(--accent)]">
                {streak}
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                Adventure Chain
              </div>
            </div>
          </div>

          {/* Perfect Score Bonus */}
          {score === 100 && (
            <div className="bg-gradient-to-r from-[var(--secondary)]/20 to-[var(--secondary-dark)]/20 border border-[var(--secondary)] rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-[var(--secondary)]">
                <Star size={20} />
                <span className="font-bold">Perfect Score Bonus!</span>
                <Star size={20} />
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                You earned an extra 50 XP for your flawless performance!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleContinue}
              className="btn-medieval flex-1 flex items-center justify-center space-x-2"
            >
              <span>Continue Adventure</span>
              <ArrowRight size={20} />
            </button>

            {score < 100 && (
              <button
                onClick={handleRetry}
                className="flex-1 px-6 py-3 border-2 border-[var(--border)] text-[var(--text-secondary)] rounded-lg hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Retry Quest</span>
              </button>
            )}
          </div>
        </div>

        {/* Next Lesson Preview */}
        <div className="mt-6 card-medieval p-6 text-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            What&apos;s Next?
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            Continue your journey with more exciting quests and challenges!
          </p>
          <div className="text-sm text-[var(--text-muted)]">
            Return to the quest board to discover new adventures.
          </div>
        </div>
      </div>
    </div>
  );
}
