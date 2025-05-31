'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, LessonProgress } from '@/types';
import { getAllLessons } from '@/data/lessons';
import {
  getLessonProgress,
  createLessonProgress,
  updateLessonProgress,
  completeLessonAndUpdateUser
} from '@/lib/firestore';
import StepRenderer from '@/components/lesson/StepRenderer';
import ProgressBar from '@/components/ui/ProgressBar';
import { PageLoading } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import {
  monitorLessonStart,
  monitorStepCompletion,
  monitorProfileUpdate,
  monitorProfileUpdateComplete,
  monitorNavigation,
  monitorNavigationComplete,
  monitorError,
  monitorTimeout,
  monitorTimeoutTriggered,
  logCompletionReport
} from '@/utils/lessonCompletionMonitor';

export default function LessonPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // const [score, setScore] = useState(0); // Unused for now
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [startTime] = useState(Date.now());

  const loadLesson = useCallback(async () => {
    try {
      setLoading(true);

      // Start monitoring if user is available
      if (user) {
        monitorLessonStart(lessonId, user.id);
      }

      // Find lesson in all lessons data
      const allLessons = getAllLessons();
      const foundLesson = allLessons.find(l => l.id === lessonId);
      if (!foundLesson) {
        monitorError(new Error('Lesson not found'), 'lesson_initialization');
        router.push('/dashboard');
        return;
      }

      setLesson(foundLesson);

      // Try to load existing progress, but don't block if Firestore fails
      if (user) {
        try {
          const existingProgress = await getLessonProgress(user.id, lessonId);
          if (existingProgress) {
            setProgress(existingProgress);
            setCurrentStepIndex(existingProgress.currentStep);
            setCorrectAnswers(existingProgress.completedSteps.length);
          } else {
            // Create new progress (local first, sync later)
            const newProgress: LessonProgress = {
              lessonId,
              userId: user.id,
              currentStep: 0,
              completedSteps: [],
              isCompleted: false,
              score: 0,
              timeSpent: 0,
              startedAt: new Date().toISOString()
            };

            // Try to save to Firestore in background (non-blocking)
            createLessonProgress(newProgress).catch(() => {
              // Silent fail for production
            });

            setProgress(newProgress);
          }
        } catch {
          // Create local-only progress
          const localProgress: LessonProgress = {
            lessonId,
            userId: user.id,
            currentStep: 0,
            completedSteps: [],
            isCompleted: false,
            score: 0,
            timeSpent: 0,
            startedAt: new Date().toISOString()
          };
          setProgress(localProgress);
        }
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [user, lessonId, router]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadLesson();
  }, [user, lessonId, router, loadLesson]);

  const handleStepAnswer = async (isCorrect: boolean) => {
    if (!lesson || !progress || !user) return;

    // Monitor step completion
    monitorStepCompletion(currentStepIndex, isCorrect);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Update progress locally first
    const updatedCompletedSteps = [...progress.completedSteps];
    const currentStep = lesson.steps[currentStepIndex];

    if (!updatedCompletedSteps.includes(currentStep.id)) {
      updatedCompletedSteps.push(currentStep.id);
    }

    // Update local state immediately
    setProgress(prev => prev ? {
      ...prev,
      completedSteps: updatedCompletedSteps,
      currentStep: currentStepIndex + 1
    } : null);

    // Try to update Firestore in background (non-blocking)
    updateLessonProgress(user.id, lessonId, {
      completedSteps: updatedCompletedSteps,
      currentStep: currentStepIndex + 1
    }).catch((error) => {
      monitorError(error, 'step_progress_update');
    });
  };

  const handleNextStep = async () => {
    if (!lesson || !user) return;

    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Lesson completed
      await completeLesson();
    }
  };

  const completeLesson = async () => {
    if (!lesson || !user || completing) return;

    console.log('Starting lesson completion...', { lessonId, user: user.id });
    setCompleting(true);

    // Monitor timeout setup
    monitorTimeout('lesson_completion', 5000);

    // Set a maximum timeout for the entire completion process
    const completionTimeout = setTimeout(() => {
      console.error('Lesson completion timed out, forcing navigation');
      monitorTimeoutTriggered('lesson_completion');
      setCompleting(false);
      const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);
      const xpGained = lesson.xpReward;
      router.push(`/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${user.streak + 1}`);
    }, 5000); // 5 second timeout

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);

      // Calculate XP locally (offline-friendly)
      let xpGained = lesson.xpReward;
      if (finalScore === 100) {
        xpGained += 50; // Perfect score bonus
      }

      console.log('Calculated completion values:', { finalScore, xpGained, timeSpent });

      // Update user's completed lessons locally first
      const updatedUser = {
        ...user,
        lessonsCompleted: user.lessonsCompleted.includes(lessonId)
          ? user.lessonsCompleted
          : [...user.lessonsCompleted, lessonId],
        xp: user.xp + xpGained,
        level: Math.floor((user.xp + xpGained) / 100) + 1,
        streak: user.streak + 1,
        lastActiveDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Updating user profile...', { updatedUser });

      // Monitor profile update
      monitorProfileUpdate('lesson_completion');

      // Update auth context with timeout protection
      const updateProfilePromise = updateProfile(updatedUser);
      const updateTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile update timeout')), 2000)
      );

      try {
        await Promise.race([updateProfilePromise, updateTimeout]);
        console.log('Profile updated successfully');
        monitorProfileUpdateComplete('lesson_completion', true);
      } catch (error) {
        console.warn('Profile update failed or timed out:', error);
        monitorProfileUpdateComplete('lesson_completion', false);
        monitorError(error, 'profile_update');
        // Continue anyway - we'll navigate to completion page
      }

      // Clear the completion timeout since we're proceeding
      clearTimeout(completionTimeout);

      // Try to update Firestore in background (non-blocking)
      completeLessonAndUpdateUser(user.id, lessonId, finalScore, timeSpent)
        .then(() => {
          console.log('Background Firestore update completed');
        })
        .catch((error) => {
          console.warn('Background Firestore update failed:', error);
        });

      console.log('Navigating to completion page...');

      // Navigate immediately - don't wait for anything else
      const navigationUrl = `/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${updatedUser.streak}`;
      console.log('Navigation URL:', navigationUrl);

      // Monitor navigation
      monitorNavigation(navigationUrl);

      // Use replace instead of push to prevent back button issues
      router.replace(navigationUrl);

      // Monitor successful navigation
      monitorNavigationComplete(navigationUrl);

    } catch (error) {
      console.error('Error in lesson completion:', error);
      monitorError(error, 'lesson_completion');

      // Clear timeout on error
      clearTimeout(completionTimeout);

      // Even if there's an error, show completion with basic values
      const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);
      const xpGained = lesson.xpReward;

      console.log('Fallback navigation due to error');
      const fallbackUrl = `/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${user.streak + 1}`;
      monitorNavigation(fallbackUrl);
      router.replace(fallbackUrl);
      monitorNavigationComplete(fallbackUrl);
    } finally {
      // Always reset completing state
      console.log('Resetting completing state');
      setCompleting(false);

      // Log completion report in development
      logCompletionReport();
    }
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  if (loading || !lesson || !user) {
    return <PageLoading text="Loading quest..." />;
  }

  const currentStep = lesson.steps[currentStepIndex];
  // const progressPercentage = ((currentStepIndex + 1) / lesson.steps.length) * 100; // Unused for now

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Quests</span>
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {lesson.title}
            </h1>
            <p className="text-[var(--text-secondary)]">
              Step {currentStepIndex + 1} of {lesson.steps.length}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-[var(--text-muted)]">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{lesson.estimatedTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={16} />
              <span>{lesson.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            current={currentStepIndex + 1}
            max={lesson.steps.length}
            label="Quest Progress"
            showPercentage={true}
          />
        </div>

        {/* Current Step */}
        <div className="card-medieval p-8 mb-8">
          {completing ? (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--secondary)] mx-auto"></div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Completing Quest...
              </h3>
              <p className="text-[var(--text-secondary)]">
                Calculating your rewards and updating your progress.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    console.log('Manual completion override triggered');
                    setCompleting(false);
                    const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);
                    const xpGained = lesson.xpReward;
                    router.replace(`/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${user.streak + 1}`);
                  }}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--secondary)] underline"
                >
                  Taking too long? Click here to continue
                </button>
              </div>
            </div>
          ) : (
            <StepRenderer
              step={currentStep}
              onAnswer={handleStepAnswer}
              onNext={handleNextStep}
            />
          )}
        </div>

        {/* Quest Info */}
        <div className="card-medieval p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                Quest: {lesson.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {lesson.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-[var(--secondary)] font-bold">
                  {correctAnswers}/{lesson.steps.length}
                </div>
                <div className="text-[var(--text-muted)]">Correct</div>
              </div>

              <div className="text-center">
                <div className="text-[var(--warning)] font-bold">
                  {Math.round((correctAnswers / Math.max(currentStepIndex, 1)) * 100)}%
                </div>
                <div className="text-[var(--text-muted)]">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
