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
      {tracks.map((track, index) => {
        const artistImageUrl = track.artistImageUrl ?? track.artworkUrl;

        return (
          <div
            key={track.id}
            className={`group grid w-full grid-cols-[28px_48px_1fr_auto_auto] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-white transition ${
              activeTrackId === track.id
                ? "border-white/20"
                : "border-transparent hover:border-white/10"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(track)}
              className="text-center text-sm text-white/40"
              aria-label={`Выбрать ${track.title}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
            <button
              type="button"
              onClick={() => onSelect(track)}
              className="relative h-12 w-12"
              aria-label={`Прослушать ${track.title}`}
            >
              <TrackArt track={track} className="h-12 w-12 rounded-xl grayscale" />
              {artistImageUrl ? (
                <img
                  src={artistImageUrl}
                  alt={track.artistImageUrl ? track.artist : `${track.album} artwork`}
                  loading="lazy"
                  className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-[#111] object-cover grayscale brightness-75"
                />
              ) : (
                <span
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#111] bg-[#1a1a1a] text-[8px] font-medium text-white/55"
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
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(track)}
                className="block w-full truncate text-left text-sm font-semibold"
              >
                {track.title}
              </button>
              <span className="block truncate text-xs text-white/45">
                {track.artist} · {track.year}
                {track.isPreview ? " · превью" : ""}
              </span>
              {track.isPreview && track.storeUrl && (
                <a
                  href={track.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-[10px] text-white/55 underline decoration-white/25 underline-offset-2 hover:text-white"
                >
                  Полная версия в Apple Music
                </a>
              )}
            </div>
            <span className="text-sm text-white/45">
              {formatDuration(track.duration)}
            </span>
            <button
              type="button"
              onClick={() => onToggleFavorite(track.id)}
              className={`icon-button h-8 w-8 rounded-full ${
                favoriteIds.includes(track.id)
                ? "text-white"
                  : "text-white/35 hover:text-white"
              }`}
              aria-label={
                favoriteIds.includes(track.id)
                  ? "Удалить из избранного"
                  : "Добавить в избранное"
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill={favoriteIds.includes(track.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
