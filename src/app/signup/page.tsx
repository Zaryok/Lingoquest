'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpForm, SUPPORTED_LANGUAGES } from '@/types';
import { CHARACTER_TYPES } from '@/types';
import { Eye, EyeOff, ArrowLeft, Globe } from 'lucide-react';
import CharacterAvatar from '@/components/ui/CharacterAvatar';

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    characterType: 'mage'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [languagePrefs, setLanguagePrefs] = useState<{sourceLanguage: string; targetLanguage: string} | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Get language preferences from localStorage
    const savedLanguages = localStorage.getItem('selectedLanguages');
    if (savedLanguages) {
      setLanguagePrefs(JSON.parse(savedLanguages));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signUp(form.email, form.password, form.name, form.characterType);
      // Clear language selection from localStorage after successful signup
      localStorage.removeItem('selectedLanguages');
      router.push('/dashboard');
    } catch (error: unknown) {
      setError((error as Error)?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCharacterSelect = (characterType: 'mage' | 'warrior' | 'rogue') => {
    setForm(prev => ({ ...prev, characterType }));
  };

  const getLanguageByCode = (code: string) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  };

  const sourceLanguage = languagePrefs ? getLanguageByCode(languagePrefs.sourceLanguage) : null;
  const targetLanguage = languagePrefs ? getLanguageByCode(languagePrefs.targetLanguage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/language-selection')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Languages</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe className="text-[var(--secondary)]" size={24} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create Character</h1>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <span className="text-[var(--text-primary)] font-medium">Languages</span>
            </div>
            <div className="w-12 h-0.5 bg-[var(--secondary)]"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-[var(--text-primary)] font-medium">Character</span>
            </div>
            <div className="w-12 h-0.5 bg-[var(--border)]"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-[var(--text-muted)]">Adventure</span>
            </div>
          </div>
        </div>

        {/* Language Summary */}
        {languagePrefs && sourceLanguage && targetLanguage && (
          <div className="card-medieval p-6 mb-8 bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--accent)]/10">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 text-center">
              Your Language Journey
            </h3>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl mb-2">{sourceLanguage.flag}</div>
                <div className="font-medium text-[var(--text-primary)]">{sourceLanguage.name}</div>
                <div className="text-sm text-[var(--text-muted)]">You speak</div>
              </div>
              <div className="text-[var(--secondary)]">→</div>
              <div className="text-center">
                <div className="text-2xl mb-2">{targetLanguage.flag}</div>
                <div className="font-medium text-[var(--text-primary)]">{targetLanguage.name}</div>
                <div className="text-sm text-[var(--text-muted)]">You&apos;ll learn</div>
              </div>
            </div>
          </div>
        )}

        {/* Character Creation Form */}
        <div className="card-medieval p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text-primary)]">
            Create Your Character
          </h2>

          {error && (
            <div className="bg-[var(--error)]/20 border border-[var(--error)] text-[var(--error)] px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Character Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                placeholder="Enter your character name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Character Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-4">
                Choose Your Class
              </label>
              <div className="character-selection-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CHARACTER_TYPES.map((character) => (
                  <div
                    key={character.id}
                    onClick={() => handleCharacterSelect(character.id)}
                    className={`character-card cursor-pointer p-4 sm:p-5 rounded-lg border-2 transition-all text-center min-h-[120px] sm:min-h-[140px] touch-manipulation ${
                      form.characterType === character.id
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/20'
                        : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${character.name} character class`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCharacterSelect(character.id);
                      }
                    }}
                  >
                    <CharacterAvatar characterType={character.id} size="md" />
                    <h3 className="font-semibold text-[var(--text-primary)] mt-2 text-sm sm:text-base">
                      {character.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                      {character.bonuses.specialAbility}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-medieval min-h-[56px] disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Create character and begin adventure"
            >
              {loading ? 'Creating Character...' : 'Begin Adventure'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-muted)]">
              Already have a character?{' '}
              <Link
                href="/login"
                className="text-[var(--secondary)] hover:text-[var(--secondary-dark)] font-medium transition-colors"
              >
                Return to Quest
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
