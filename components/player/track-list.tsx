"use client";

import type { Track } from "@/types/music";
import { TrackArt } from "./track-art";

type TrackListProps = {
  tracks: Track[];
  activeTrackId: string;
  favoriteIds: string[];
  onSelect: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
};

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackList({
  tracks,
  activeTrackId,
  favoriteIds,
  onSelect,
  onToggleFavorite,
}: TrackListProps) {
  return (
    <div className="mt-5 space-y-1.5">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={`group grid w-full grid-cols-[28px_48px_1fr_auto_auto] items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-white transition ${
            activeTrackId === track.id
              ? "bg-[#ff9a5b]/20 shadow-[0_10px_28px_rgba(0,8,28,0.18)]"
              : "hover:bg-white/[0.07]"
          }`}
        >
          <button type="button" onClick={() => onSelect(track)} className="text-center text-sm text-white/40" aria-label={`Выбрать ${track.title}`}>
            {String(index + 1).padStart(2, "0")}
          </button>
          <button type="button" onClick={() => onSelect(track)} className="relative h-12 w-12" aria-label={`Прослушать ${track.title}`}>
            <TrackArt track={track} className="h-12 w-12 rounded-xl" />
            {track.artworkUrl ? (
              <img
                src={track.artworkUrl}
                alt={track.artist}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-[#111] object-cover"
              />
            ) : (
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#111] bg-gradient-to-br from-[#ffad72] to-[#4f658d] text-[8px] font-bold text-white"
                title={track.artist}
              >
                {track.artist
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </button>
          <button type="button" onClick={() => onSelect(track)} className="min-w-0 text-left">
            <span className="block truncate text-sm font-semibold">
              {track.title}
            </span>
            <span className="block truncate text-xs text-white/45">
              {track.artist} · {track.year}
            </span>
          </button>
          <span className="text-sm text-white/45">
            {formatDuration(track.duration)}
          </span>
          <button
            type="button"
            onClick={() => onToggleFavorite(track.id)}
            className={`icon-button h-8 w-8 rounded-full ${
              favoriteIds.includes(track.id) ? "text-[#ff8f66]" : "text-white/35 hover:text-white"
            }`}
            aria-label={favoriteIds.includes(track.id) ? "Удалить из избранного" : "Добавить в избранное"}
          >
            <svg viewBox="0 0 24 24" fill={favoriteIds.includes(track.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
