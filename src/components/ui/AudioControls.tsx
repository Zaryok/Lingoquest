'use client';

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export default function AudioControls() {
  const { isPlaying, isMuted, volume, togglePlay, toggleMute, setVolume, isLoaded } = useAudio();
  const [showControls, setShowControls] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Don't render on server side
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Controls */}
      {showControls && (
        <div
          id="audio-controls-panel"
          className="mb-4 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-lg"
          role="region"
          aria-label="Audio controls panel"
        >
          <div className="flex items-center gap-2 mb-3">
            <Music size={16} aria-hidden="true" />
            <span className="font-medium">Wizard Music</span>
          </div>

          {/* Status */}
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-center text-sm" role="status" aria-live="polite">
            {!isLoaded ? (
              <span className="text-gray-600">🎵 Loading...</span>
            ) : isPlaying ? (
              <span className="text-green-600">🎵 Playing Automatically</span>
            ) : (
              <span className="text-orange-600">⏸️ Click Play to Start</span>
            )}
          </div>

          <div className="space-y-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 w-full p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="flex items-center gap-2 w-full p-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {isMuted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Volume Slider */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label htmlFor="volume-slider" className="font-medium">Volume</label>
                <span aria-live="polite">{Math.round(volume * 100)}%</span>
              </div>
              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={`Volume control, currently at ${Math.round(volume * 100)} percent`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Control Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        title="Music Controls"
        aria-label={`Music controls. Current status: ${isMuted ? 'Muted' : isPlaying ? 'Playing' : 'Stopped'}`}
        aria-expanded={showControls}
        aria-controls="audio-controls-panel"
      >
        {isMuted ? (
          <VolumeX size={20} aria-hidden="true" />
        ) : isPlaying ? (
          <Volume2 size={20} aria-hidden="true" />
        ) : (
          <Music size={20} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
