"use client";

import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Track {
  name: string;
  url: string;
  hash: string;
}

const CACHE_NAME = "audio-cache-v1";

const AudioPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchTracks = useCallback(async () => {
    const cachedTracksInfo = localStorage.getItem("cachedTracksInfo");
    if (cachedTracksInfo) {
      setTracks(JSON.parse(cachedTracksInfo));
      setIsLoading(false);
    }

    try {
      const response = await fetch("/api/tracks");
      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }
      const fetchedTracks = await response.json();

      // Update cache for changed or new tracks
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        fetchedTracks.map(async (track: Track) => {
          const cachedResponse = await cache.match(track.url);
          if (
            !cachedResponse ||
            (await cachedResponse.clone().json()).hash !== track.hash
          ) {
            const audioResponse = await fetch(track.url);
            if (!audioResponse.ok) {
              throw new Error(`Failed to fetch audio file: ${track.name}`);
            }
            await cache.put(track.url, audioResponse);
          }
        })
      );

      setTracks(fetchedTracks);
      localStorage.setItem("cachedTracksInfo", JSON.stringify(fetchedTracks));
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setError("Failed to load tracks. Please try again later.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const loadAudioFromCache = useCallback(async (url: string) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }
    return url;
  }, []);

  useEffect(() => {
    if (tracks[currentTrackIndex]) {
      loadAudioFromCache(tracks[currentTrackIndex].url)
        .then((audioSrc) => {
          if (audioRef.current) {
            audioRef.current.src = audioSrc;
            if (isPlaying) {
              audioRef.current.play().catch((error) => {
                console.error("Error playing audio:", error);
                setError("Failed to play audio. Please try again.");
                setIsPlaying(false);
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error loading audio from cache:", error);
          setError("Failed to load audio. Please try again.");
        });
    }
  }, [currentTrackIndex, tracks, isPlaying, loadAudioFromCache]);

  if (isLoading) {
    return <div>Loading tracks...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
      <audio
        ref={audioRef}
        onEnded={playNextTrack}
        onError={() =>
          setError("Error playing audio. Please try another track.")
        }
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={playPreviousTrack}>
            <SkipBack className="text-white" />
          </button>
          <button onClick={togglePlay}>
            <AnimatePresence mode="wait" initial={false}>
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Pause className="text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <button onClick={playNextTrack}>
            <SkipForward className="text-white" />
          </button>
        </div>
        <div className="text-white">{tracks[currentTrackIndex]?.name}</div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="text-white" />
            ) : (
              <Volume2 className="text-white" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
