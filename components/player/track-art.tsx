import type { CSSProperties } from "react";
import type { Track } from "@/types/music";

type TrackArtProps = {
  track: Track;
  className?: string;
};

export function TrackArt({ track, className = "" }: TrackArtProps) {
  const style = {
    "--art-start": track.artStart,
    "--art-end": track.artEnd,
  } as CSSProperties;

  return (
    <div
      className={`album-art rounded-[28px] ${className}`}
      style={style}
      aria-label={`Обложка альбома ${track.album}`}
    >
      {track.artworkUrl ? (
        <img
          src={track.artworkUrl}
          alt={track.album}
          className="h-full w-full rounded-[inherit] object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="h-[31%] w-[31%] rounded-full border-[12px] border-white/55 bg-black/10" />
        </div>
      )}
    </div>
  );
}
