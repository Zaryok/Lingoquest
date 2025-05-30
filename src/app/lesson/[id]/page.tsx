'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, LessonProgress } from '@/types';
import { sampleLessons } from '@/data/lessons';
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

export default function LessonPage() {
  const { user } = useAuth();
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

      // Find lesson in sample data
      const foundLesson = sampleLessons.find(l => l.id === lessonId);
      if (!foundLesson) {
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
    }).catch(() => {
      // Silent fail for production
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

    setCompleting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);

      // Calculate XP locally (offline-friendly)
      let xpGained = lesson.xpReward;
      if (finalScore === 100) {
        xpGained += 50; // Perfect score bonus
      }

      // Try to update Firestore in background, but don't wait for it
      completeLessonAndUpdateUser(user.id, lessonId, finalScore, timeSpent)
        .then(() => {
          // Silent success for production
        })
        .catch(() => {
          // Silent fail for production
        });

      // Show completion modal/page immediately with calculated values
      router.push(`/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${user.streak + 1}`);
    } catch {
      // Even if there's an error, show completion with basic values
      // const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Unused in error case
      const finalScore = Math.round((correctAnswers / lesson.steps.length) * 100);
      const xpGained = lesson.xpReward;
      router.push(`/lesson/${lessonId}/complete?xp=${xpGained}&score=${finalScore}&streak=${user.streak}`);
    } finally {
      setCompleting(false);
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
