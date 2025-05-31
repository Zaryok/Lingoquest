// Language Interface
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export interface LanguagePair {
  sourceLanguage: Language;
  targetLanguage: Language;
}

// User Profile Interface
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  lessonsCompleted: string[];
  characterType: 'mage' | 'warrior' | 'rogue';
  level: number;
  sourceLanguage?: string; // Language code they speak
  targetLanguage?: string; // Language code they're learning
  createdAt: string;
  updatedAt: string;
}

// Lesson Step Types
export interface FlashcardStep {
  type: 'flashcard';
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
  example?: string;
}

export interface MCQStep {
  type: 'mcq';
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface InputStep {
  type: 'input';
  id: string;
  question: string;
  correctAnswer: string;
  hint?: string;
  caseSensitive?: boolean;
}

export type LessonStep = FlashcardStep | MCQStep | InputStep;

// Lesson Interface
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  steps: LessonStep[];
  prerequisites?: string[];
  estimatedTime: number; // in minutes
  category: string;
  isLocked: boolean;
  order: number;
  targetLanguage: string; // Language code this lesson teaches
  sourceLanguage: string; // Language code for instructions
  createdAt: string;
  updatedAt: string;
}

// Lesson Progress Interface
export interface LessonProgress {
  lessonId: string;
  userId: string;
  currentStep: number;
  completedSteps: string[];
  isCompleted: boolean;
  score: number;
  timeSpent: number; // in seconds
  startedAt: string;
  completedAt?: string;
}

// Character Types
export interface CharacterType {
  id: 'mage' | 'warrior' | 'rogue';
  name: string;
  description: string;
  avatar: string;
  bonuses: {
    xpMultiplier: number;
    specialAbility: string;
  };
}

// Achievement Interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'xp' | 'streak' | 'lessons' | 'perfect_score';
    value: number;
  };
  reward: {
    xp: number;
    title?: string;
  };
}

// User Achievement Interface
export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

// Auth Context Types
export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, characterType?: 'mage' | 'warrior' | 'rogue') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

// Lesson Context Types
export interface LessonContextType {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  lessonProgress: LessonProgress | null;
  loading: boolean;
  startLesson: (lessonId: string) => Promise<void>;
  completeStep: (stepId: string, isCorrect: boolean) => Promise<void>;
  completeLesson: () => Promise<void>;
  getLessonProgress: (lessonId: string) => Promise<LessonProgress | null>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  characterType: 'mage' | 'warrior' | 'rogue';
}

// Component Props Types
export interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export interface LessonCardProps {
  lesson: Lesson;
  isLocked: boolean;
  progress?: LessonProgress;
  onClick: () => void;
}

export interface StepRendererProps {
  step: LessonStep;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

export interface CharacterAvatarProps {
  characterType: 'mage' | 'warrior' | 'rogue';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLevel?: boolean;
  level?: number;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Constants
export const CHARACTER_TYPES: CharacterType[] = [
  {
    id: 'mage',
    name: 'Mage',
    description: 'Masters of arcane knowledge, gaining bonus XP from vocabulary lessons',
    avatar: '🧙‍♂️',
    bonuses: {
      xpMultiplier: 1.2,
      specialAbility: 'Vocabulary Mastery'
    }
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Brave fighters who excel in grammar battles',
    avatar: '⚔️',
    bonuses: {
      xpMultiplier: 1.1,
      specialAbility: 'Grammar Shield'
    }
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Cunning linguists who gain streaks faster',
    avatar: '🗡️',
    bonuses: {
      xpMultiplier: 1.0,
      specialAbility: 'Streak Stealth'
    }
  }
];

export const DIFFICULTY_COLORS = {
  beginner: '#228B22',
  intermediate: '#FF8C00',
  advanced: '#DC143C'
} as const;

export const XP_PER_LEVEL = 100;
export const STREAK_BONUS_MULTIPLIER = 0.1;
export const PERFECT_SCORE_BONUS = 50;

// Language Constants
export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'Americas'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Europe'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'Europe'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Europe'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    region: 'Europe'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    region: 'Europe'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'Asia'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'Asia'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    region: 'Asia'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    region: 'Middle East'
  }
];
