'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sword, Shield, Star, Users, BookOpen, Trophy, Settings, Play, RotateCcw, Crown, Castle } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading state during hydration to prevent hydration mismatch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--secondary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading your realm...</p>
        </div>
      </div>
    );
  }

  const handleStartLearning = () => {
    if (user) {
      // If user exists but no language selected, go to language selection
      if (!user.sourceLanguage || !user.targetLanguage) {
        router.push('/language-selection');
      } else {
        // If user has languages set, go to dashboard
        router.push('/dashboard');
      }
    } else {
      // New user - go to language selection first
      router.push('/language-selection');
    }
  };

  const handleContinueJourney = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)]">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sword className="text-[var(--secondary)] mr-2" size={28} />
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">LingoQuest</h1>
          </div>
          <button
            onClick={handleSettings}
            className="p-3 rounded-lg border-2 border-[var(--border)] hover:border-[var(--secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Settings"
            aria-label="Open Settings"
          >
            <Settings className="text-[var(--text-secondary)]" size={20} />
          </button>
        </div>
      </header>

      {/* Zaryab's Realm Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--secondary)]/10 via-[var(--accent)]/10 to-[var(--secondary)]/10 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
          <div className="realm-banner-container">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Castle className="text-[var(--secondary)] mr-3 sm:mr-4 castle-float" size={28} />
              <Crown className="text-[var(--accent)] mx-2 sm:mx-3 animate-pulse" size={24} />
              <Castle className="text-[var(--secondary)] ml-3 sm:ml-4 castle-float" size={28} />
            </div>
            <div className="realm-title-wrapper mb-4 sm:mb-6 w-full">
              <div className="w-full flex items-center justify-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center w-full">
                  <span className="bg-gradient-to-r from-[var(--secondary)] via-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent realm-title block">
                    Welcome to Zaryab&apos;s Realm
                  </span>
                </h2>
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed px-4 text-center">
              Enter the legendary domain where ancient wisdom meets modern learning.{' '}
              <span className="text-[var(--accent)] font-semibold">Master Zaryab</span> invites you to discover the secrets of language mastery through epic quests and mystical adventures.
            </p>
            <div className="flex items-center justify-center mt-6 sm:mt-8 space-x-3">
              <div className="w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-r from-transparent to-[var(--secondary)]"></div>
              <Crown className="text-[var(--accent)]" size={20} />
              <div className="w-12 sm:w-16 lg:w-20 h-0.5 bg-gradient-to-l from-transparent to-[var(--secondary)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo and Title */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Sword className="text-[var(--secondary)] mr-2 sm:mr-4" size={48} />
              <div className="flex items-center justify-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
                  LingoQuest
                </h1>
              </div>
              <Shield className="text-[var(--secondary)] ml-2 sm:ml-4" size={48} />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl text-[var(--text-secondary)] mb-3 sm:mb-4 leading-relaxed px-2">
              Embark on an epic journey to master new languages
            </p>
            <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-3xl mx-auto px-4 leading-relaxed">
              Choose your character, select your languages, and begin an adventure through medieval realms while learning new tongues
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center mb-12 sm:mb-16 px-4">
            <button
              onClick={handleStartLearning}
              className="btn-medieval text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 min-w-[240px] sm:min-w-[250px] min-h-[56px] flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all touch-manipulation"
              aria-label="Start your language learning journey"
            >
              <Play size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="whitespace-nowrap">Start Learning</span>
            </button>

            {user && (
              <button
                onClick={handleContinueJourney}
                className="btn-medieval-secondary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 min-w-[240px] sm:min-w-[250px] min-h-[56px] flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all touch-manipulation"
                aria-label="Continue your existing adventure"
              >
                <RotateCcw size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Return to Quest</span>
              </button>
            )}

            {!user && (
              <button
                onClick={() => router.push('/login')}
                className="btn-medieval-secondary text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 min-w-[240px] sm:min-w-[250px] min-h-[56px] flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl transition-all touch-manipulation"
                aria-label="Continue your adventure by logging in"
              >
                <Shield size={20} className="sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="whitespace-nowrap">Continue Adventure</span>
              </button>
            )}
          </div>

          {/* User Status */}
          {user && (
            <div className="card-medieval p-6 sm:p-8 mb-8 sm:mb-12 bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--accent)]/10 mx-2 sm:mx-4">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4 text-center">
                Welcome back, {user.name}!
              </h3>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="text-[var(--secondary)]" size={16} />
                  <span className="text-[var(--text-secondary)]">Level {user.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="text-[var(--warning)]" size={16} />
                  <span className="text-[var(--text-secondary)]">{user.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-[var(--accent)]" size={16} />
                  <span className="text-[var(--text-secondary)]">{user.lessonsCompleted.length} Quests Completed</span>
                </div>
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12 px-2 sm:px-4">
            <div className="card-medieval p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="text-[var(--secondary)] mx-auto mb-4 sm:mb-6" size={48} />
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
                Interactive Quests
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Learn through engaging adventures and challenges designed to make language learning an epic journey
              </p>
            </div>

            <div className="card-medieval p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="text-[var(--secondary)] mx-auto mb-4 sm:mb-6" size={48} />
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
                Character Classes
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Choose your path as a Mage, Warrior, or Rogue, each with unique learning bonuses and abilities
              </p>
            </div>

            <div className="card-medieval p-6 sm:p-8 text-center hover:shadow-lg transition-shadow">
              <Trophy className="text-[var(--secondary)] mx-auto mb-4 sm:mb-6" size={48} />
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
                Progress Tracking
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                Track your XP, maintain learning streaks, and unlock achievements as you master new languages
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="card-medieval p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-[var(--background)] to-[var(--background-secondary)] mx-2 sm:mx-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8 text-center">
              Join the Adventure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <Star className="text-[var(--secondary)] mr-2 sm:mr-3" size={24} />
                  <span className="text-3xl sm:text-4xl font-bold text-[var(--secondary)]">10+</span>
                </div>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg">Languages Available</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <BookOpen className="text-[var(--secondary)] mr-2 sm:mr-3" size={24} />
                  <span className="text-3xl sm:text-4xl font-bold text-[var(--secondary)]">100+</span>
                </div>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg">Interactive Quests</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <Trophy className="text-[var(--secondary)] mr-2 sm:mr-3" size={24} />
                  <span className="text-3xl sm:text-4xl font-bold text-[var(--secondary)]">50+</span>
                </div>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 sm:p-8 text-center text-[var(--text-muted)] border-t border-[var(--border)]">
        <div className="flex items-center justify-center mb-2 flex-wrap">
          <Crown className="text-[var(--accent)] mr-1 sm:mr-2" size={14} />
          <p className="text-base sm:text-lg px-2">&copy; 2024 LingoQuest - Zaryab&apos;s Realm</p>
          <Crown className="text-[var(--accent)] ml-1 sm:ml-2" size={14} />
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] px-4">Begin your linguistic adventure in the legendary realm today.</p>
      </footer>
    </div>
  );
}
