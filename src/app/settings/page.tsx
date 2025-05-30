'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Language, SUPPORTED_LANGUAGES } from '@/types';
import { ArrowLeft, Globe, User, LogOut, Save, Edit3 } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [tempSourceLanguage, setTempSourceLanguage] = useState<string>(user?.sourceLanguage || '');
  const [tempTargetLanguage, setTempTargetLanguage] = useState<string>(user?.targetLanguage || '');

  const handleBack = () => {
    router.push('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch {
      // Silent fail for production, still redirect
      router.push('/');
    }
  };

  const handleSaveLanguages = async () => {
    if (!user || !tempSourceLanguage || !tempTargetLanguage) return;

    setLoading(true);
    try {
      await updateProfile({
        sourceLanguage: tempSourceLanguage,
        targetLanguage: tempTargetLanguage
      });
      setEditingLanguages(false);
    } catch {
      // Silent fail for production
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTempSourceLanguage(user?.sourceLanguage || '');
    setTempTargetLanguage(user?.targetLanguage || '');
    setEditingLanguages(false);
  };

  const getLanguageByCode = (code: string): Language | undefined => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  };

  const sourceLanguage = getLanguageByCode(user?.sourceLanguage || '');
  const targetLanguage = getLanguageByCode(user?.targetLanguage || '');
  // const tempSource = getLanguageByCode(tempSourceLanguage); // Unused for now
  // const tempTarget = getLanguageByCode(tempTargetLanguage); // Unused for now

  const availableTargetLanguages = SUPPORTED_LANGUAGES.filter(
    lang => lang.code !== tempSourceLanguage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--background)] to-[var(--background-secondary)] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        </div>

        {user ? (
          <div className="space-y-6">
            {/* User Profile */}
            <div className="card-medieval p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-[var(--secondary)]" size={24} />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Character Name
                  </label>
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                    <span className="text-[var(--text-primary)]">{user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Email
                  </label>
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                    <span className="text-[var(--text-primary)]">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                    Character Class
                  </label>
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                    <span className="text-[var(--text-primary)] capitalize">{user.characterType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="card-medieval p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="text-[var(--secondary)]" size={24} />
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Languages</h2>
                </div>
                {!editingLanguages && (
                  <button
                    onClick={() => setEditingLanguages(true)}
                    className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--secondary-dark)] transition-colors"
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {!editingLanguages ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      You speak
                    </label>
                    {sourceLanguage ? (
                      <div className="flex items-center gap-3 p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                        <span className="text-2xl">{sourceLanguage.flag}</span>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{sourceLanguage.name}</div>
                          <div className="text-sm text-[var(--text-muted)]">{sourceLanguage.nativeName}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                        <span className="text-[var(--text-muted)]">Not set</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      You&apos;re learning
                    </label>
                    {targetLanguage ? (
                      <div className="flex items-center gap-3 p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                        <span className="text-2xl">{targetLanguage.flag}</span>
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{targetLanguage.name}</div>
                          <div className="text-sm text-[var(--text-muted)]">{targetLanguage.nativeName}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                        <span className="text-[var(--text-muted)]">Not set</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Edit Source Language */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                      You speak
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {SUPPORTED_LANGUAGES.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            setTempSourceLanguage(language.code);
                            if (tempTargetLanguage === language.code) {
                              setTempTargetLanguage('');
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            tempSourceLanguage === language.code
                              ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
                              : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
                          }`}
                        >
                          <div className="text-xl mb-1">{language.flag}</div>
                          <div className="text-xs font-medium text-[var(--text-primary)]">
                            {language.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Edit Target Language */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                      You&apos;re learning
                    </label>
                    {tempSourceLanguage ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableTargetLanguages.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => setTempTargetLanguage(language.code)}
                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                              tempTargetLanguage === language.code
                                ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
                                : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
                            }`}
                          >
                            <div className="text-xl mb-1">{language.flag}</div>
                            <div className="text-xs font-medium text-[var(--text-primary)]">
                              {language.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-[var(--text-muted)]">
                          Please select your native language first
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveLanguages}
                      disabled={!tempSourceLanguage || !tempTargetLanguage || loading}
                      className="btn-medieval flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-medieval-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out */}
            <div className="card-medieval p-6">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-3 p-4 text-[var(--error)] border-2 border-[var(--error)] rounded-lg hover:bg-[var(--error)]/10 transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="card-medieval p-8 text-center">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Not Signed In
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              You need to be signed in to access settings.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="btn-medieval"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
