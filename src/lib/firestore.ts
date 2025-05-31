import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Lesson, LessonProgress, UserProfile } from '@/types';
import { getAllLessons as getLocalLessons } from '@/data/lessons';

// User operations
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userId,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as UserProfile;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const updateUserXP = async (userId: string, xpGained: number) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const currentXP = userDoc.data().xp || 0;
      const newXP = currentXP + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1;

      await updateDoc(doc(db, 'users', userId), {
        xp: newXP,
        level: newLevel,
        updatedAt: serverTimestamp()
      });

      return { newXP, newLevel };
    }
  } catch (error) {
    throw error;
  }
};

export const updateUserStreak = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastActiveDate = userData.lastActiveDate?.toDate?.() || new Date(userData.lastActiveDate);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = userData.streak || 0;

      // Check if last active was yesterday (continue streak) or today (maintain streak)
      if (isSameDay(lastActiveDate, yesterday)) {
        newStreak += 1;
      } else if (!isSameDay(lastActiveDate, today)) {
        newStreak = 1; // Reset streak if more than a day has passed
      }

      await updateDoc(doc(db, 'users', userId), {
        streak: newStreak,
        lastActiveDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return newStreak;
    }
  } catch (error) {
    throw error;
  }
};

// Lesson operations
export const getAllLessons = async (): Promise<Lesson[]> => {
  try {
    const lessonsQuery = query(
      collection(db, 'lessons'),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(lessonsQuery);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    })) as Lesson[];
  } catch (error) {
    throw error;
  }
};

export const getLesson = async (lessonId: string): Promise<Lesson | null> => {
  try {
    // Use local lesson data for now (faster and more reliable)
    const localLessons = getLocalLessons();
    const lesson = localLessons.find(l => l.id === lessonId);
    return lesson || null;
  } catch (error) {
    // Fallback to Firestore if local data fails
    try {
      const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
      if (lessonDoc.exists()) {
        const data = lessonDoc.data();
        return {
          id: lessonId,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        } as Lesson;
      }
      return null;
    } catch {
      return null;
    }
  }
};

// Lesson Progress operations
export const getLessonProgress = async (userId: string, lessonId: string): Promise<LessonProgress | null> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );

    const progressDoc = await Promise.race([
      getDoc(doc(db, 'lessonProgress', `${userId}_${lessonId}`)),
      timeoutPromise
    ]);

    if (progressDoc.exists()) {
      const data = progressDoc.data();
      return {
        ...data,
        startedAt: data.startedAt?.toDate?.()?.toISOString() || data.startedAt,
        completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt
      } as LessonProgress;
    }
    return null;
  } catch (error) {
    // Return null instead of throwing - lesson will create new progress
    return null;
  }
};

export const createLessonProgress = async (progress: Omit<LessonProgress, 'startedAt'>) => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );

    const progressRef = doc(db, 'lessonProgress', `${progress.userId}_${progress.lessonId}`);
    await Promise.race([
      setDoc(progressRef, {
        ...progress,
        startedAt: serverTimestamp()
      }),
      timeoutPromise
    ]);
  } catch (error) {
    // Don't throw - lesson will work with local state
  }
};

export const updateLessonProgress = async (
  userId: string,
  lessonId: string,
  updates: Partial<LessonProgress>
) => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );

    const progressRef = doc(db, 'lessonProgress', `${userId}_${lessonId}`);
    await Promise.race([
      updateDoc(progressRef, {
        ...updates,
        ...(updates.isCompleted && { completedAt: serverTimestamp() })
      }),
      timeoutPromise
    ]);
  } catch (error) {
    // Don't throw - lesson will continue with local state
  }
};

export const getUserLessonProgress = async (userId: string): Promise<LessonProgress[]> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );

    const progressQuery = query(
      collection(db, 'lessonProgress'),
      where('userId', '==', userId)
    );

    const querySnapshot = await Promise.race([getDocs(progressQuery), timeoutPromise]);

    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        startedAt: data.startedAt?.toDate?.()?.toISOString() || data.startedAt,
        completedAt: data.completedAt?.toDate?.()?.toISOString() || data.completedAt
      } as LessonProgress;
    });
  } catch (error) {
    // Return empty array instead of throwing - app will work with default state
    return [];
  }
};

// Utility functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Lesson completion
export const completeLessonAndUpdateUser = async (
  userId: string,
  lessonId: string,
  score: number,
  timeSpent: number
) => {
  console.log('Starting completeLessonAndUpdateUser:', { userId, lessonId, score, timeSpent });

  try {
    // Add overall timeout for the entire operation
    const operationTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Complete lesson operation timeout')), 8000)
    );

    // Get lesson details for XP reward first
    const lesson = await getLesson(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    console.log('Found lesson for completion:', lesson.title);

    // Calculate XP with bonuses
    let xpGained = lesson.xpReward;
    if (score === 100) {
      xpGained += 50; // Perfect score bonus
    }

    console.log('Calculated XP gained:', xpGained);

    const operationPromise = async () => {
      // Update lesson progress (with timeout protection)
      await updateLessonProgress(userId, lessonId, {
        isCompleted: true,
        score,
        timeSpent,
        currentStep: lesson.steps.length,
        completedSteps: lesson.steps.map(step => step.id)
      });

      console.log('Lesson progress updated successfully');
    };

    await Promise.race([operationPromise(), operationTimeout]);

    console.log('Starting user updates...');

    // Update user XP and level (with error handling)
    let xpResult = null;
    try {
      xpResult = await updateUserXP(userId, xpGained);
      console.log('XP update completed:', xpResult);
    } catch (error) {
      console.warn('XP update failed:', error);
    }

    // Update user streak (with error handling)
    let newStreak = 0;
    try {
      newStreak = await updateUserStreak(userId);
      console.log('Streak update completed:', newStreak);
    } catch (error) {
      console.warn('Streak update failed:', error);
    }

    // Add lesson to completed lessons (with error handling)
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completedLessons = userData.lessonsCompleted || [];
        if (!completedLessons.includes(lessonId)) {
          await updateDoc(doc(db, 'users', userId), {
            lessonsCompleted: [...completedLessons, lessonId],
            updatedAt: serverTimestamp()
          });
          console.log('Completed lessons updated successfully');
        } else {
          console.log('Lesson already in completed list');
        }
      }
    } catch (error) {
      console.warn('Completed lessons update failed:', error);
    }

    console.log('Lesson completion process finished successfully');

    return {
      xpGained,
      newXP: xpResult?.newXP,
      newLevel: xpResult?.newLevel,
      newStreak
    };
  } catch (error) {
    console.error('Error in completeLessonAndUpdateUser:', error);
    throw error;
  }
};
