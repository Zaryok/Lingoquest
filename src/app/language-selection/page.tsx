'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Language, SUPPORTED_LANGUAGES } from '@/types';
import { ArrowLeft, ArrowRight, Globe, Check } from 'lucide-react';

export default function LanguageSelectionPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSourceLanguageSelect = (language: Language) => {
    setSourceLanguage(language);
    // Clear target language if it's the same as source
    if (targetLanguage?.code === language.code) {
      setTargetLanguage(null);
    }
  };

  const handleTargetLanguageSelect = (language: Language) => {
    setTargetLanguage(language);
  };

  const handleContinue = async () => {
    if (!sourceLanguage || !targetLanguage) return;

    setLoading(true);
    try {
      if (user) {
        // Update existing user's language preferences
        await updateProfile({
          sourceLanguage: sourceLanguage.code,
          targetLanguage: targetLanguage.code
        });
        router.push('/dashboard');
      } else {
        // Store language selection for new user signup
        localStorage.setItem('selectedLanguages', JSON.stringify({
          sourceLanguage: sourceLanguage.code,
          targetLanguage: targetLanguage.code
        }));
        router.push('/signup');
      }
    } catch {
      // Silent fail for production
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const availableTargetLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== sourceLanguage?.code
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <Globe className="text-[var(--secondary)]" size={24} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Choose Your Languages</h1>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-[var(--text-primary)] font-medium">Languages</span>
            </div>
            <div className="w-12 h-0.5 bg-[var(--border)]"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center text-sm">
                2
              </div>
              <span className="text-[var(--text-muted)]">Character</span>
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

        {/* Language Selection */}
        <div className="space-y-12">
          {/* Source Language */}
          <div className="card-medieval p-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 text-center">
              What language do you speak?
            </h2>
            <p className="text-[var(--text-secondary)] text-center mb-8">
              Select your native language or the language you&apos;re most comfortable with
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleSourceLanguageSelect(language)}
                  className={`language-button p-4 sm:p-5 rounded-lg border-2 transition-all text-center hover:shadow-md min-h-[80px] sm:min-h-[90px] touch-manipulation ${
                    sourceLanguage?.code === language.code
                      ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
                      : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
                  }`}
                  aria-label={`Select ${language.name} as your source language`}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{language.flag}</div>
                  <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base">
                    {language.name}
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)]">
                    {language.nativeName}
                  </div>
                  {sourceLanguage?.code === language.code && (
                    <Check className="text-[var(--secondary)] mx-auto mt-2" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Target Language */}
          <div className="card-medieval p-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 text-center">
              What language do you want to learn?
            </h2>
            <p className="text-[var(--text-secondary)] text-center mb-8">
              Choose the language you&apos;d like to master on your LingoQuest adventure
            </p>

            {sourceLanguage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {availableTargetLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleTargetLanguageSelect(language)}
                    className={`language-button p-4 sm:p-5 rounded-lg border-2 transition-all text-center hover:shadow-md min-h-[80px] sm:min-h-[90px] touch-manipulation ${
                      targetLanguage?.code === language.code
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
                        : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
                    }`}
                    aria-label={`Select ${language.name} as your target language`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{language.flag}</div>
                    <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base">
                      {language.name}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--text-muted)]">
                      {language.nativeName}
                    </div>
                    {targetLanguage?.code === language.code && (
                      <Check className="text-[var(--secondary)] mx-auto mt-2" size={16} />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="text-[var(--text-muted)] mx-auto mb-4" size={48} />
                <p className="text-[var(--text-muted)]">
                  Please select your native language first
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-8 sm:mt-12 px-4">
          <button
            onClick={handleContinue}
            disabled={!sourceLanguage || !targetLanguage || loading}
            className="btn-medieval text-base sm:text-lg px-6 sm:px-8 py-4 min-w-[240px] sm:min-w-[250px] min-h-[56px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            aria-label="Continue to character creation"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Continue Adventure</span>
                <ArrowRight size={20} className="flex-shrink-0" />
              </>
            )}
          </button>
        </div>

        {/* Selected Languages Summary */}
        {sourceLanguage && targetLanguage && (
          <div className="card-medieval p-4 sm:p-6 mt-6 sm:mt-8 mx-4 bg-gradient-to-r from-[var(--secondary)]/10 to-[var(--accent)]/10">
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-4 text-center">
              Your Language Journey
            </h3>
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-2">{sourceLanguage.flag}</div>
                <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base">{sourceLanguage.name}</div>
                <div className="text-xs sm:text-sm text-[var(--text-muted)]">You speak</div>
              </div>
              <ArrowRight className="text-[var(--secondary)] flex-shrink-0" size={20} />
              <div className="text-center">
                <div className="text-xl sm:text-2xl mb-2">{targetLanguage.flag}</div>
                <div className="font-medium text-[var(--text-primary)] text-sm sm:text-base">{targetLanguage.name}</div>
                <div className="text-xs sm:text-sm text-[var(--text-muted)]">You&apos;ll learn</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
