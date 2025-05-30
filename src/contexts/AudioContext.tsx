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
    audioRef.current = audio;

    // Try to play immediately
    const tryPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoaded(true);
        })
        .catch(() => {
          setIsLoaded(true);

          // Start on any user interaction
          const startMusic = () => {
            audio.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {
                // Silent fail for production
              });
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
            document.removeEventListener('keydown', startMusic);
          };

          document.addEventListener('click', startMusic);
          document.addEventListener('touchstart', startMusic);
          document.addEventListener('keydown', startMusic);
        });
    };

    // Try immediately and also when loaded
    tryPlay();
    audio.addEventListener('canplaythrough', tryPlay);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isClient]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Silent fail for production
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
