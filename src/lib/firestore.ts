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
  } catch (error) {
    throw error;
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
  try {
    // Get lesson details for XP reward
    const lesson = await getLesson(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Calculate XP with bonuses
    let xpGained = lesson.xpReward;
    if (score === 100) {
      xpGained += 50; // Perfect score bonus
    }

    // Update lesson progress
    await updateLessonProgress(userId, lessonId, {
      isCompleted: true,
      score,
      timeSpent,
      currentStep: lesson.steps.length,
      completedSteps: lesson.steps.map(step => step.id)
    });

    // Update user XP and level
    const xpResult = await updateUserXP(userId, xpGained);

    // Update user streak
    const newStreak = await updateUserStreak(userId);

    // Add lesson to completed lessons
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const completedLessons = userData.lessonsCompleted || [];
      if (!completedLessons.includes(lessonId)) {
        await updateDoc(doc(db, 'users', userId), {
          lessonsCompleted: [...completedLessons, lessonId],
          updatedAt: serverTimestamp()
        });
      }
    }

    return {
      xpGained,
      newXP: xpResult?.newXP,
      newLevel: xpResult?.newLevel,
      newStreak
    };
  } catch (error) {
    throw error;
  }
};
