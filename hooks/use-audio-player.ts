"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/music";

export function useAudioPlayer(initialTrack: Track) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio(initialTrack.audioUrl);
    audio.preload = "none";
    audioRef.current = audio;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncEnd = () => setIsPlaying(false);
    const syncError = () => {
      setIsPlaying(false);
      setPlaybackError("Не удалось воспроизвести превью");
    };
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("ended", syncEnd);
    audio.addEventListener("error", syncError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("ended", syncEnd);
      audio.removeEventListener("error", syncError);
      audioRef.current = null;
    };
  }, [initialTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  async function startPlayback(audio: HTMLAudioElement) {
    try {
      await audio.play();
      setIsPlaying(true);
      setPlaybackError(null);
    } catch {
      setIsPlaying(false);
      setPlaybackError("Не удалось воспроизвести превью");
    }
  }

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await startPlayback(audio);
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  async function selectTrack(nextTrack: Track) {
    const wasPlaying = isPlaying;
    setTrack(nextTrack);
    setCurrentTime(0);
    setIsPlaying(false);
    setPlaybackError(null);

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = nextTrack.audioUrl;
    audio.load();

    if (wasPlaying) {
      await startPlayback(audio);
    }
  }

  function seek(nextTime: number) {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return {
    audioRef,
    track,
    isPlaying,
    playbackError,
    currentTime,
    volume,
    setVolume,
    toggle,
    selectTrack,
    seek,
  };
}
