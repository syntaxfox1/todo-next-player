import type { Track } from "@/types/music";

type LyricsPanelProps = {
  track: Track;
  currentTime: number;
  isPlaying: boolean;
};

function getActiveLineIndex(track: Track, currentTime: number) {
  if (!track.lyrics?.length) return -1;

  for (let index = track.lyrics.length - 1; index >= 0; index -= 1) {
    if (currentTime >= track.lyrics[index].time) return index;
  }

  return -1;
}

export function LyricsPanel({
  track,
  currentTime,
  isPlaying,
}: LyricsPanelProps) {
  const activeLineIndex = getActiveLineIndex(track, currentTime);

  return (
    <section aria-label={`Текст песни ${track.title}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            {track.artist}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {track.title}
          </h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">
          Текст
        </span>
      </div>

      {track.lyrics?.length ? (
        <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-2 text-lg leading-8">
          {track.lyrics.map((line, index) => {
            const isActive = isPlaying && index === activeLineIndex;

            return (
              <p
                key={`${line.time}-${index}`}
                aria-current={isActive ? "true" : undefined}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "font-semibold text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                    : "text-white/40"
                }`}
              >
                {line.text}
              </p>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 text-center">
          <p className="text-base font-medium text-white/80">
            Синхронный текст пока недоступен
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
            Для показа и подсветки строк требуется подключение лицензированных
            текстов Musixmatch.
          </p>
          <a
            href={`https://www.musixmatch.com/search/${encodeURIComponent(`${track.artist} ${track.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            Найти текст в Musixmatch
          </a>
        </div>
      )}
    </section>
  );
}
