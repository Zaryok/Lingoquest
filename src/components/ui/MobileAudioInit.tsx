'use client';

import { useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX } from 'lucide-react';

export default function MobileAudioInit() {
  const { isPlaying, isLoaded, togglePlay } = useAudio();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      return isMobileDevice || isTouchDevice;
    };

    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    // Show prompt on mobile if audio is loaded but not playing
    if (isMobile && isLoaded && !isPlaying) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [isMobile, isLoaded, isPlaying]);

  const handleStartAudio = () => {
    togglePlay();
    setShowPrompt(false);
  };

  if (!showPrompt || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 shadow-lg max-w-xs">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Volume2 className="text-[var(--secondary)]" size={24} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
            Enable Background Music
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Tap to start the medieval soundtrack
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleStartAudio}
          className="flex-1 bg-[var(--secondary)] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[var(--secondary-dark)] transition-colors"
        >
          Enable
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="px-3 py-2 text-[var(--text-muted)] text-sm hover:text-[var(--text-secondary)] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
