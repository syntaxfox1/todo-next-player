"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/types/music";

export function useAudioPlayer(initialTrack: Track) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("ended", syncEnd);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("ended", syncEnd);
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  async function selectTrack(nextTrack: Track) {
    const wasPlaying = isPlaying;
    setTrack(nextTrack);
    setCurrentTime(0);
    setIsPlaying(false);

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = nextTrack.audioUrl;
    audio.load();

    if (wasPlaying) {
      await audio.play();
      setIsPlaying(true);
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
    currentTime,
    volume,
    setVolume,
    toggle,
    selectTrack,
    seek,
  };
}
