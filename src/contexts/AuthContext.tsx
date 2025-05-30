'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthContextType, UserProfile } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Only run after hydration to prevent SSR/client mismatch
    if (!isHydrated) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile
        await fetchUserProfile(firebaseUser);
      } else {
        // User is signed out, check for demo user (only on client)
        try {
          const demoUserData = localStorage.getItem('lingoquest-demo-user');
          if (demoUserData) {
            const demoUser = JSON.parse(demoUserData);
            setUser(demoUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          // Handle localStorage errors gracefully
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isHydrated]);

  const fetchUserProfile = async (firebaseUser: User) => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );

      const userDocPromise = getDoc(doc(db, 'users', firebaseUser.uid));
      const userDoc = await Promise.race([userDocPromise, timeoutPromise]) as any;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: userData.name || firebaseUser.displayName || '',
          xp: userData.xp || 0,
          streak: userData.streak || 0,
          lastActiveDate: userData.lastActiveDate || new Date().toISOString(),
          lessonsCompleted: userData.lessonsCompleted || [],
          characterType: userData.characterType || 'mage',
          level: Math.floor((userData.xp || 0) / 100) + 1,
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString()
        });
      } else {
        // Create new user profile with timeout
        const newUserProfile: Omit<UserProfile, 'id'> = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          xp: 0,
          streak: 0,
          lastActiveDate: new Date().toISOString(),
          lessonsCompleted: [],
          characterType: 'mage',
          level: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const setDocPromise = setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUserProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        await Promise.race([setDocPromise, timeoutPromise]);

        setUser({
          id: firebaseUser.uid,
          ...newUserProfile
        });
      }
    } catch (error: any) {
      // Create a fallback user profile from Firebase user data
      const fallbackUser: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        xp: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString(),
        lessonsCompleted: [],
        characterType: 'mage',
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUser(fallbackUser);

      // Try to save to Firestore in background (non-blocking)
      setTimeout(async () => {
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...fallbackUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (bgError) {
          // Silent fail for production
        }
      }, 1000);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (firebaseError) {
        // Check if there's a demo user in localStorage
        const demoUserData = localStorage.getItem('lingoquest-demo-user');
        if (demoUserData) {
          const demoUser = JSON.parse(demoUserData);
          if (demoUser.email === email) {
            setUser(demoUser);
            setLoading(false);
            return;
          }
        }

        // If no demo user found, throw the original error
        throw firebaseError;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, characterType: 'mage' | 'warrior' | 'rogue' = 'mage') => {
    setLoading(true);
    try {
      // Create Firebase user with timeout
      const authTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Authentication timeout')), 10000)
      );

      const authPromise = createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = await Promise.race([authPromise, authTimeout]) as any;

      // Update display name (non-blocking)
      updateProfile(firebaseUser, { displayName: name }).catch(() => {
        // Silent fail for production
      });

      // Get language preferences from localStorage if available (client-side only)
      let languagePrefs = {};
      try {
        if (typeof window !== 'undefined') {
          const savedLanguages = localStorage.getItem('selectedLanguages');
          languagePrefs = savedLanguages ? JSON.parse(savedLanguages) : {};
        }
      } catch (error) {
        // Handle localStorage errors gracefully
        languagePrefs = {};
      }

      // Create user profile immediately in local state
      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        email,
        name,
        xp: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString(),
        lessonsCompleted: [],
        characterType,
        level: 1,
        sourceLanguage: (languagePrefs as any).sourceLanguage || 'en',
        targetLanguage: (languagePrefs as any).targetLanguage || 'es',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Set user immediately for fast UI response
      setUser(userProfile);
      setLoading(false);

      // Save to Firestore in background (non-blocking)
      setTimeout(async () => {
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email,
            name,
            xp: 0,
            streak: 0,
            lastActiveDate: new Date().toISOString(),
            lessonsCompleted: [],
            characterType,
            level: 1,
            sourceLanguage: (languagePrefs as any).sourceLanguage || 'en',
            targetLanguage: (languagePrefs as any).targetLanguage || 'es',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (bgError) {
          // Silent fail for production
        }
      }, 100);

    } catch (error: any) {
      // Firebase signup failed, using demo mode

      // Get language preferences from localStorage if available
      const savedLanguages = localStorage.getItem('selectedLanguages');
      const languagePrefs = savedLanguages ? JSON.parse(savedLanguages) : {};

      // Create a demo user for testing
      const demoUser: UserProfile = {
        id: 'demo-' + Date.now(),
        email,
        name,
        xp: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString(),
        lessonsCompleted: [],
        characterType,
        level: 1,
        sourceLanguage: (languagePrefs as any).sourceLanguage || 'en',
        targetLanguage: (languagePrefs as any).targetLanguage || 'es',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store in localStorage for demo
      localStorage.setItem('lingoquest-demo-user', JSON.stringify(demoUser));
      setUser(demoUser);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Also clear demo user data
      localStorage.removeItem('lingoquest-demo-user');
      setUser(null);
    } catch (error) {
      // If Firebase fails, just clear demo user and local state
      localStorage.removeItem('lingoquest-demo-user');
      setUser(null);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      // Try to update in Firebase
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      // If Firebase fails but we have a demo user, update localStorage
      if (user.id.startsWith('demo-')) {
        const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('lingoquest-demo-user', JSON.stringify(updatedUser));
          }
          setUser(updatedUser);
        } catch (storageError) {
          // Handle localStorage errors gracefully
          setUser(updatedUser);
        }
      } else {
        throw error;
      }
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile: updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
