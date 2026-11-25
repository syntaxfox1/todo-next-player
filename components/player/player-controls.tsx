"use client";

import type { Track } from "@/types/music";
import { PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from "../ui/icons";

type PlayerControlsProps = {
  track: Track;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

function formatTime(time: number) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function PlayerControls({
  track,
  isPlaying,
  currentTime,
  volume,
  onToggle,
  onSeek,
  onVolumeChange,
  onPrevious,
  onNext,
}: PlayerControlsProps) {
  return (
    <div className="mt-5">
      <input
        className="range h-1 w-full"
        type="range"
        min="0"
        max={track.duration}
        value={Math.min(currentTime, track.duration)}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Позиция трека"
      />
      <div className="mt-2 flex justify-between text-[11px] text-white/45">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(track.duration)}</span>
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={onPrevious} className="icon-button h-10 w-10 rounded-full text-white/75" aria-label="Предыдущий трек">
            <SkipBackIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="play-button flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb16f] to-[#ed783f] text-white shadow-[0_12px_35px_rgba(255,125,64,0.28)]"
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="ml-1 h-6 w-6" />
            )}
          </button>
          <button type="button" onClick={onNext} className="icon-button h-10 w-10 rounded-full text-white/75" aria-label="Следующий трек">
            <SkipForwardIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex w-full items-center justify-center gap-2 text-white/45">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          </svg>
          <input
            className="range h-1 w-24"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            aria-label="Громкость"
          />
        </div>
      </div>
    </div>
  );
}
