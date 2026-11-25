"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { concerts } from "@/data/concerts";
import { moviePremieres, type MoviePremiere } from "@/data/movie-premieres";
import { tracks } from "@/data/tracks";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import type { Track } from "@/types/music";
import { PlayerControls } from "./player-controls";
import { TrackArt } from "./track-art";
import { TrackList } from "./track-list";

type Page = "music" | "cinema" | "favorites" | "concerts";
type CinemaTab = "premieres" | "booking" | "payment";
const favoritesChangedEvent = "nocturne-favorites-changed";
const noFavorites: string[] = [];
let cachedFavoriteIds = noFavorites;
let cachedFavoritesJson: string | null | undefined;

function subscribeToFavorites(onChange: () => void) {
  const invalidateAndNotify = () => {
    cachedFavoritesJson = undefined;
    onChange();
  };
  window.addEventListener(favoritesChangedEvent, onChange);
  window.addEventListener("storage", invalidateAndNotify);
  return () => {
    window.removeEventListener(favoritesChangedEvent, onChange);
    window.removeEventListener("storage", invalidateAndNotify);
  };
}

function getFavorites() {
  const saved = window.localStorage.getItem("nocturne-favorites");
  if (saved === cachedFavoritesJson) return cachedFavoriteIds;
  if (!saved) {
    cachedFavoritesJson = null;
    cachedFavoriteIds = noFavorites;
    return cachedFavoriteIds;
  }

  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      const ids = parsed.filter((id): id is string => typeof id === "string");
      cachedFavoriteIds = ids.length === parsed.length ? ids : noFavorites;
    } else {
      cachedFavoriteIds = noFavorites;
    }
  } catch {
    window.localStorage.removeItem("nocturne-favorites");
    cachedFavoritesJson = null;
    cachedFavoriteIds = noFavorites;
    return cachedFavoriteIds;
  }

  cachedFavoritesJson = saved;
  return cachedFavoriteIds;
}

function getServerFavorites() {
  return noFavorites;
}

function MoviePoster({ movie }: { movie: MoviePremiere }) {
  const [failed, setFailed] = useState(false);

  if (!movie.posterUrl || failed) {
    return (
      <div className="flex aspect-[2/3] items-end border border-white/15 bg-black p-5">
        <span className="text-2xl font-light leading-tight">{movie.title}</span>
      </div>
    );
  }

  return (
    <Image
      src={movie.posterUrl}
      alt={`Постер фильма ${movie.title}`}
      loading="lazy"
      onError={() => setFailed(true)}
      width={600}
      height={900}
      unoptimized
      className="aspect-[2/3] w-full bg-black object-cover saturate-125"
    />
  );
}

function BookingDialog({
  movie,
  onClose,
}: {
  movie: MoviePremiere;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"seats" | "payment">("seats");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const unavailableSeats = ["A3", "B6", "C2", "D7"];

  function toggleSeat(seat: string) {
    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat],
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <section className="my-auto w-full max-w-xl rounded-3xl border border-white/15 bg-black p-5 sm:p-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">
              {step === "seats" ? "Бронирование" : "Оплата"}
            </p>
            <h2 id="booking-title" className="mt-2 text-2xl font-semibold">
              {movie.title}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {movie.releaseDate} · прокат США
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-2xl text-white/70 hover:bg-white/10"
            aria-label="Закрыть окно"
          >
            ×
          </button>
        </header>

        {step === "seats" ? (
          <>
            <div className="mt-7 rounded-2xl border border-white/10 bg-black p-4 sm:p-6">
              <div className="mb-7 rounded-full border-t-2 border-white/50 pb-2 pt-3 text-center text-xs uppercase tracking-[0.2em] text-white/45">
                Экран
              </div>
              <div className="mx-auto grid max-w-sm grid-cols-8 gap-2">
                {["A", "B", "C", "D"].flatMap((row) =>
                  Array.from({ length: 8 }, (_, index) => {
                    const seat = `${row}${index + 1}`;
                    const unavailable = unavailableSeats.includes(seat);
                    const selected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        type="button"
                        disabled={unavailable}
                        onClick={() => toggleSeat(seat)}
                        aria-label={`Ряд ${row}, место ${index + 1}${unavailable ? ", недоступно" : ""}`}
                        aria-pressed={selected}
                        className={`aspect-square rounded-md border text-[10px] transition ${
                          unavailable
                            ? "cursor-not-allowed border-white/5 bg-white/5 text-white/20"
                            : selected
                              ? "border-white bg-white text-black"
                              : "border-white/15 text-white/60 hover:border-white/60"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  }),
                )}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-white/50">
                <span>○ Свободно</span>
                <span className="text-white">● Выбрано</span>
                <span className="text-white/25">● Недоступно</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/45">
              Схема зала демонстрационная: наличие мест и сеансы не подключены
            </p>
            <button
              type="button"
              onClick={() => setStep("payment")}
              disabled={selectedSeats.length === 0}
              className="mt-5 w-full rounded-full bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
            >
              Перейти к оплате{selectedSeats.length ? ` · ${selectedSeats.length} места` : ""}
            </button>
          </>
        ) : (
          <div className="mt-7 rounded-2xl border border-white/10 bg-black p-5 sm:p-7">
            <p className="text-lg font-medium">Места выбраны</p>
            <p className="mt-2 text-sm text-white/55">
              {selectedSeats.join(", ")}
            </p>
            <div className="mt-6 rounded-xl border border-white/10 p-4 text-sm leading-6 text-white/60">
              Оплата не подключена в этой версии. Данные банковской карты здесь
              не собираются
            </div>
            <button
              type="button"
              onClick={() => setStep("seats")}
              className="mt-5 rounded-full border border-white/20 px-5 py-3 text-sm text-white/80 hover:bg-white/10"
            >
              Изменить места
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function PlayerApp() {
  const [page, setPage] = useState<Page>("music");
  const [cinemaTab, setCinemaTab] = useState<CinemaTab>("premieres");
  const [search, setSearch] = useState("");
  const favoriteIds = useSyncExternalStore(
    subscribeToFavorites,
    getFavorites,
    getServerFavorites,
  );
  const [bookingMovie, setBookingMovie] = useState<MoviePremiere | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState(moviePremieres[0].id);
  const player = useAudioPlayer(tracks[0]);

  const visibleTracks = useMemo(() => {
    const source = page === "favorites"
      ? tracks.filter((track) => favoriteIds.includes(track.id))
      : tracks;
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) return source;
    return source.filter((track) =>
      `${track.title} ${track.artist} ${track.album}`
        .toLocaleLowerCase()
        .includes(normalizedSearch),
    );
  }, [favoriteIds, page, search]);

  function toggleFavorite(trackId: string) {
    const next = favoriteIds.includes(trackId)
      ? favoriteIds.filter((id) => id !== trackId)
      : [...favoriteIds, trackId];
    const serialized = JSON.stringify(next);
    window.localStorage.setItem("nocturne-favorites", serialized);
    cachedFavoriteIds = next;
    cachedFavoritesJson = serialized;
    window.dispatchEvent(new Event(favoritesChangedEvent));
  }

  function selectTrack(track: Track) {
    void player.selectTrack(track);
  }

  function moveToTrack(offset: number) {
    const currentIndex = tracks.findIndex((track) => track.id === player.track.id);
    const nextIndex = (currentIndex + offset + tracks.length) % tracks.length;
    selectTrack(tracks[nextIndex]);
  }

  function openBooking(movie: MoviePremiere) {
    setBookingMovie(movie);
  }

  const selectedMovie =
    moviePremieres.find((movie) => movie.id === selectedMovieId) ??
    moviePremieres[0];

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setPage("music")}
            className="text-sm font-semibold tracking-[0.24em]"
          >
            NOCTURNE
          </button>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Главная навигация">
            {([
              ["music", "Музыка"],
              ["concerts", "Афиша"],
              ["cinema", "Кино"],
              ["favorites", "Избранное"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPage(id);
                  setSearch("");
                }}
                aria-current={page === id ? "page" : undefined}
                className={`border-b px-2 py-2 text-xs transition sm:px-3 sm:text-sm ${
                  page === id
                    ? "border-white text-white"
                    : "border-transparent text-white/55 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        {page === "cinema" ? (
          <CinemaPage
            activeTab={cinemaTab}
            onTabChange={setCinemaTab}
            selectedMovie={selectedMovie}
            selectedMovieId={selectedMovieId}
            onMovieChange={setSelectedMovieId}
            onBook={openBooking}
          />
        ) : page === "concerts" ? (
          <ConcertsPage />
        ) : (
          <>
            {page === "music" && (
              <>
                <section className="relative mt-8 overflow-hidden border-y border-white/15 py-10 sm:mt-12 sm:py-16">
                  <div className="relative z-10 max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/50">
                      Алматы · ноябрь — декабрь 2026
                    </p>
                    <h1 className="mt-5 text-5xl font-light leading-[0.98] tracking-tight sm:text-7xl">
                      Афиша
                    </h1>
                    <p className="mt-5 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
                      Реальные концерты, даты и цены на билеты
                    </p>
                    <button
                      type="button"
                      onClick={() => setPage("concerts")}
                      className="mt-7 border border-white/35 px-5 py-3 text-sm text-white transition hover:border-white hover:bg-white hover:text-black"
                    >
                      Посмотреть афишу
                    </button>
                  </div>
                  <div className="absolute -right-8 bottom-0 top-0 hidden w-[34%] items-center justify-end gap-3 sm:flex">
                    {concerts.slice(0, 3).map((concert, index) => (
                      <Image
                        key={concert.id}
                        src={concert.posterUrl}
                        alt=""
                        width={168}
                        height={242}
                        unoptimized
                        className={`h-48 w-32 object-cover saturate-125 ${
                          index === 1 ? "mt-14" : index === 2 ? "-mt-12" : ""
                        }`}
                      />
                    ))}
                  </div>
                </section>

                <section id="concerts" className="mt-16 scroll-mt-24">
                  <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
                    <div>
                      <h2 className="mt-2 text-3xl font-medium sm:text-4xl">
                        Ближайшие концерты
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage("concerts")}
                      className="text-sm text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white"
                    >
                      Посмотреть афишу
                    </button>
                  </div>
                  <div className="mt-5">
                    {concerts.slice(0, 3).map((concert) => (
                      <a
                        key={concert.id}
                        href={concert.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 py-4 transition hover:border-white/30 sm:grid-cols-[80px_minmax(0,1fr)_auto]"
                      >
                        <Image
                          src={concert.posterUrl}
                          alt=""
                          width={168}
                          height={242}
                          unoptimized
                          className="h-20 w-14 object-cover saturate-125 sm:h-24 sm:w-16"
                        />
                        <span className="min-w-0">
                          <span className="block text-xs text-white/45">{concert.date}</span>
                          <span className="mt-1 block truncate text-sm font-medium sm:text-base">
                            {concert.title}
                          </span>
                          <span className="mt-1 block truncate text-xs text-white/40">
                            {concert.venue}
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="block whitespace-nowrap text-xs sm:text-sm">
                            {concert.priceFrom}
                          </span>
                          <span className="mt-1 block text-[10px] text-white/40">
                            Билеты ↗
                          </span>
                        </span>
                      </a>
                    ))}
                  </div>
                </section>
              </>
            )}

            <section className="mt-16" aria-labelledby="music-heading">
              <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {page === "favorites" ? "Твоя коллекция" : "Слушай и открывай"}
                  </p>
                  <h1 id="music-heading" className="mt-2 text-3xl font-medium sm:text-4xl">
                    {page === "favorites" ? "Избранное" : "Музыка"}
                  </h1>
                </div>
                <label className="relative w-full sm:max-w-xs">
                  <span className="sr-only">Поиск музыки</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Поиск по музыке"
                    className="h-11 w-full rounded-full border border-white/15 bg-black px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/45"
                  />
                </label>
              </div>

              {page === "music" && (
                <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                  <article className="rounded-3xl border border-white/10 bg-black p-5 sm:p-7">
                    <TrackArt
                      track={player.track}
                      className="mx-auto aspect-square w-full max-w-[330px] rounded-2xl grayscale"
                    />
                    <div className="mt-5 text-center">
                      <h2 className="text-xl font-medium">{player.track.title}</h2>
                      <p className="mt-1 text-sm text-white/50">
                        {player.track.artist} · {player.track.album}
                      </p>
                    </div>
                    <PlayerControls
                      track={player.track}
                      isPlaying={player.isPlaying}
                      currentTime={player.currentTime}
                      volume={player.volume}
                      onToggle={() => void player.toggle()}
                      onSeek={player.seek}
                      onVolumeChange={player.setVolume}
                      onPrevious={() => moveToTrack(-1)}
                      onNext={() => moveToTrack(1)}
                    />
                    {player.playbackError && (
                      <p role="alert" className="mt-4 text-center text-xs text-white/55">
                        {player.playbackError}
                      </p>
                    )}
                    {player.track.isPreview && player.track.storeUrl && (
                      <a
                        href={player.track.storeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 block text-center text-xs text-white/45 underline decoration-white/20 underline-offset-4 hover:text-white"
                      >
                        Полная версия в Apple Music
                      </a>
                    )}
                  </article>
                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                          Каталог
                        </p>
                        <h2 className="mt-2 text-2xl font-medium">Треки</h2>
                      </div>
                      <span className="text-xs text-white/40">
                        {visibleTracks.length} треков
                      </span>
                    </div>
                    <TrackList
                      tracks={visibleTracks}
                      activeTrackId={player.track.id}
                      favoriteIds={favoriteIds}
                      onSelect={selectTrack}
                      onToggleFavorite={toggleFavorite}
                    />
                    {visibleTracks.length === 0 && (
                      <p className="mt-8 text-sm text-white/45">Ничего не найдено</p>
                    )}
                    <p className="mt-5 text-xs leading-5 text-white/40">
                      Коммерческие записи доступны в виде официальных превью
                      Apple Music
                    </p>
                  </div>
                </div>
              )}

              {page === "favorites" && (
                <div className="mt-7 max-w-4xl">
                  <TrackList
                    tracks={visibleTracks}
                    activeTrackId={player.track.id}
                    favoriteIds={favoriteIds}
                    onSelect={selectTrack}
                    onToggleFavorite={toggleFavorite}
                  />
                  {visibleTracks.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-black p-8 text-center">
                      <p className="text-white/65">Здесь пока пусто</p>
                      <button
                        type="button"
                        onClick={() => setPage("music")}
                        className="mt-4 rounded-full border border-white/20 px-5 py-2.5 text-sm hover:bg-white hover:text-black"
                      >
                        Перейти к музыке
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {bookingMovie && (
        <BookingDialog
          movie={bookingMovie}
          onClose={() => setBookingMovie(null)}
        />
      )}
    </main>
  );
}

function ConcertsPage() {
  return (
    <section className="pt-10 sm:pt-16">
      <header className="border-b border-white/15 pb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Алматы / 2026
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <h1 className="text-6xl font-light tracking-tight sm:text-8xl">Афиша</h1>
          <p className="pb-2 text-sm text-white/50">
            {concerts.length} событий до конца года
          </p>
        </div>
      </header>

      <div className="mt-3">
        {concerts.map((concert, index) => (
          <article
            key={concert.id}
            className="grid grid-cols-[22px_76px_minmax(0,1fr)] items-center gap-3 border-b border-white/10 py-5 sm:grid-cols-[40px_112px_minmax(0,1fr)_200px] sm:gap-6 sm:py-7"
          >
            <span className="self-start pt-1 text-[10px] text-white/35 sm:text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Image
              src={concert.posterUrl}
              alt={`Постер концерта ${concert.title}`}
              width={168}
              height={242}
              unoptimized
              className="h-28 w-[76px] object-cover saturate-125 sm:h-40 sm:w-28"
            />
            <div className="min-w-0">
              <p className="text-xs text-white/45">{concert.date}</p>
              <h2 className="mt-2 text-base font-medium leading-5 sm:text-xl sm:leading-7">
                {concert.title}
              </h2>
              <p className="mt-2 truncate text-xs text-white/40 sm:text-sm">
                {concert.venue}
              </p>
            </div>
            <div className="col-start-3 mt-1 flex items-center justify-between gap-3 sm:col-start-auto sm:block sm:text-right">
              <p className="text-sm font-medium">{concert.priceFrom}</p>
              <a
                href={concert.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-white/35 pb-1 text-xs text-white/70 hover:border-white hover:text-white sm:mt-3 sm:inline-block"
              >
                Купить билет ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-5 text-white/40">
        Цены указаны от минимальной стоимости на странице события и могут
        измениться у организатора
      </p>
    </section>
  );
}

function CinemaPage({
  activeTab,
  onTabChange,
  selectedMovie,
  selectedMovieId,
  onMovieChange,
  onBook,
}: {
  activeTab: CinemaTab;
  onTabChange: (tab: CinemaTab) => void;
  selectedMovie: MoviePremiere;
  selectedMovieId: string;
  onMovieChange: (id: string) => void;
  onBook: (movie: MoviePremiere) => void;
}) {
  const tabs: { id: CinemaTab; label: string }[] = [
    { id: "premieres", label: "Премьеры" },
    { id: "booking", label: "Бронь" },
    { id: "payment", label: "Оплата" },
  ];
  const featuredMovie = moviePremieres[0];
  const otherMovies = moviePremieres.slice(1);

  return (
    <section className="pt-10 sm:pt-16">
      <header className="border-b border-white/15 pb-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          NOCTURNE / экран 02
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <h1 className="text-6xl font-light tracking-tight sm:text-8xl">Кино</h1>
          <p className="max-w-sm pb-2 text-sm leading-6 text-white/45">
            Премьеры 2026–2027 · даты и билеты для Алматы
          </p>
        </div>
      </header>

      <nav
        className="mt-6 flex gap-7 border-b border-white/10"
        aria-label="Разделы кино"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`border-b py-3 text-sm transition ${
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-white/45 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "premieres" && (
        <>
          <article className="mt-10 grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,1.25fr)] lg:gap-12">
            <div className="w-full max-w-[360px]">
              <MoviePoster movie={featuredMovie} />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap justify-between gap-3 text-xs uppercase tracking-[0.15em] text-white/40">
                <span>Ближайшая премьера</span>
                <span>{featuredMovie.releaseDate}</span>
              </div>
              <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight sm:text-6xl">
                {featuredMovie.title}
              </h2>
              <p className="mt-4 text-sm text-white/45">
                {featuredMovie.kind} · {featuredMovie.studio} · {featuredMovie.region}
              </p>
              <div className="mt-8 border-y border-white/15 py-5">
                <p className="text-xs uppercase tracking-[0.16em] text-white/40">
                  Билеты в Алматы
                </p>
                <p className="mt-2 text-2xl font-light">{featuredMovie.ticketPrice}</p>
                {featuredMovie.ticketDetails && (
                  <p className="mt-1 text-xs text-white/45">
                    {featuredMovie.ticketDetails}
                  </p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-5">
                {featuredMovie.ticketUrl ? (
                  <a
                    href={featuredMovie.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-white pb-1 text-sm hover:text-white/65"
                  >
                    Сеансы и билеты ↗
                  </a>
                ) : (
                  <span className="text-sm text-white/40">Билеты скоро</span>
                )}
                <button
                  type="button"
                  onClick={() => onBook(featuredMovie)}
                  className="border-b border-white/35 pb-1 text-sm text-white/65 hover:border-white hover:text-white"
                >
                  Схема мест
                </button>
                <a
                  href={featuredMovie.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-white/20 pb-1 text-sm text-white/40 hover:text-white/75"
                >
                  Студия ↗
                </a>
              </div>
            </div>
          </article>

          <section className="mt-12" aria-labelledby="release-calendar-title">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
              <h2 id="release-calendar-title" className="text-2xl font-light sm:text-3xl">
                Календарь премьер
              </h2>
              <p className="text-xs text-white/40">
                Официальные даты проката студий
              </p>
            </div>
            {otherMovies.map((movie, index) => (
              <article
                key={movie.id}
                className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 border-b border-white/10 py-5 sm:grid-cols-[64px_74px_minmax(0,1fr)_220px] sm:items-center sm:gap-6"
              >
                <span className="self-start pt-1 text-xs text-white/35">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <div className="hidden w-[74px] sm:block">
                  <MoviePoster movie={movie} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/45">{movie.releaseDate}</p>
                  <h3 className="mt-1 text-lg font-medium">{movie.title}</h3>
                  <p className="mt-1 text-xs text-white/40">
                    {movie.kind} · {movie.region}
                  </p>
                </div>
                <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:block sm:text-right">
                  <p className="text-xs text-white/55">{movie.ticketPrice}</p>
                  <div className="mt-0 flex gap-4 sm:mt-2 sm:justify-end">
                    {movie.ticketUrl ? (
                      <a
                        href={movie.ticketUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-white underline underline-offset-4"
                      >
                        Сеансы ↗
                      </a>
                    ) : (
                      <span className="text-xs text-white/35">Продажи позже</span>
                    )}
                    <a
                      href={movie.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-white/40 hover:text-white"
                    >
                      Источник ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
          <p className="mt-5 text-xs leading-5 text-white/35">
            Даты указаны для кинотеатрального проката в США. Цены Алматы
            показываются только для опубликованных сеансов; по остальным
            премьерам продажа ещё не открыта
          </p>
        </>
      )}

      {activeTab === "booking" && (
        <section className="mt-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Бронирование
          </p>
          <h2 className="mt-3 text-3xl font-light">Выбери фильм</h2>
          <div className="mt-7 flex flex-wrap items-end gap-4">
            <label className="min-w-[220px] flex-1 text-xs text-white/45" htmlFor="movie-choice">
              Премьера
              <select
                id="movie-choice"
                value={selectedMovieId}
                onChange={(event) => onMovieChange(event.target.value)}
                className="mt-2 h-12 w-full border-b border-white/25 bg-black px-1 text-sm text-white outline-none focus:border-white"
              >
                {moviePremieres.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title} · {movie.releaseDate}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => onBook(selectedMovie)}
              className="border border-white/35 px-5 py-3 text-sm hover:border-white"
            >
              Схема мест
            </button>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-5 text-white/40">
            Схема мест демонстрационная. Реальные сеансы, свободные места и
            покупка доступны на странице кинотеатра
          </p>
          {selectedMovie.ticketUrl && (
            <a
              href={selectedMovie.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block border-b border-white/50 pb-1 text-sm"
            >
              Открыть реальные сеансы ↗
            </a>
          )}
        </section>
      )}

      {activeTab === "payment" && (
        <section className="mt-10 max-w-2xl border-y border-white/15 py-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Оплата билетов
          </p>
          <h2 className="mt-3 text-3xl font-light">{selectedMovie.title}</h2>
          <p className="mt-4 text-2xl font-light">{selectedMovie.ticketPrice}</p>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Оплата проходит на странице кинотеатра. NOCTURNE не принимает и не
            хранит данные банковских карт
          </p>
          {selectedMovie.ticketUrl ? (
            <a
              href={selectedMovie.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block border-b border-white pb-1 text-sm"
            >
              Перейти к билетам ↗
            </a>
          ) : (
            <p className="mt-6 text-sm text-white/40">
              Продажа билетов ещё не открыта
            </p>
          )}
        </section>
      )}
    </section>
  );
}
