'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/types';
import { Eye, EyeOff, Sword, Shield } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(form.email, form.password);
      router.push('/dashboard');
    } catch (error: unknown) {
      setError((error as Error)?.message || 'Failed to sign in');
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sword className="text-[var(--secondary)] mr-2" size={32} />
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              LingoQuest
            </h1>
            <Shield className="text-[var(--secondary)] ml-2" size={32} />
          </div>
          <p className="text-[var(--text-secondary)]">
            Enter the realm of language mastery
          </p>
        </div>

        {/* Login Form */}
        <div className="card-medieval p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[var(--text-primary)]">
            Return to Your Quest
          </h2>

          {error && (
            <div className="bg-[var(--error)]/20 border border-[var(--error)] text-[var(--error)] px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-medieval disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entering Realm...' : 'Begin Quest'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-muted)]">
              New to the realm?{' '}
              <Link
                href="/signup"
                className="text-[var(--secondary)] hover:text-[var(--secondary-dark)] font-medium transition-colors"
              >
                Create Your Character
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-[var(--surface)]/50 rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            Demo: Use any email and password to explore the realm
          </p>
        </div>
      </div>
    </div>
  );
}
