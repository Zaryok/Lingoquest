'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  isLoaded: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Create audio element only on client side
    const audio = new Audio('/audio/wizard.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';

    // Mobile-specific settings
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');

    audioRef.current = audio;

    // Handle audio loading
    const handleCanPlay = () => {
      setIsLoaded(true);
      // Try to play immediately (works on desktop)
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setUserInteracted(true);
        })
        .catch(() => {
          // Autoplay blocked - wait for user interaction
          setIsPlaying(false);
        });
    };

    // Enhanced user interaction handler for mobile
    const startMusicOnInteraction = (event: Event) => {
      if (userInteracted) return; // Already started

      // Prevent multiple triggers
      setUserInteracted(true);

      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Still failed, reset for next attempt
          setUserInteracted(false);
        });

      // Remove listeners after first successful interaction
      document.removeEventListener('click', startMusicOnInteraction, { capture: true });
      document.removeEventListener('touchstart', startMusicOnInteraction, { capture: true });
      document.removeEventListener('touchend', startMusicOnInteraction, { capture: true });
      document.removeEventListener('keydown', startMusicOnInteraction, { capture: true });
      document.removeEventListener('scroll', startMusicOnInteraction, { capture: true });
    };

    // Add multiple event listeners for better mobile support
    document.addEventListener('click', startMusicOnInteraction, { capture: true, passive: true });
    document.addEventListener('touchstart', startMusicOnInteraction, { capture: true, passive: true });
    document.addEventListener('touchend', startMusicOnInteraction, { capture: true, passive: true });
    document.addEventListener('keydown', startMusicOnInteraction, { capture: true, passive: true });
    document.addEventListener('scroll', startMusicOnInteraction, { capture: true, passive: true });

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('loadeddata', handleCanPlay);

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('click', startMusicOnInteraction, { capture: true });
      document.removeEventListener('touchstart', startMusicOnInteraction, { capture: true });
      document.removeEventListener('touchend', startMusicOnInteraction, { capture: true });
      document.removeEventListener('keydown', startMusicOnInteraction, { capture: true });
      document.removeEventListener('scroll', startMusicOnInteraction, { capture: true });
    };
  }, [isClient, userInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Ensure user interaction is marked for mobile
      setUserInteracted(true);

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If play fails, try to reload and play again (mobile fix)
          audioRef.current?.load();
          setTimeout(() => {
            audioRef.current?.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                // Silent fail for production
              });
          }, 100);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const setVolume = (newVolume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    audioRef.current.volume = clampedVolume;
  };

  const value: AudioContextType = {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
    isLoaded
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
