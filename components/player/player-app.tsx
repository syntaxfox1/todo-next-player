"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { tracks } from "@/data/tracks";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { StaticTrackService } from "@/services/track-service";
import { DotsIcon, HeartIcon, SearchIcon, SettingsIcon } from "../ui/icons";
import { PlayerControls } from "./player-controls";
import { TrackArt } from "./track-art";
import { TrackList } from "./track-list";

const trackService = new StaticTrackService(tracks);

const concerts = [
  { city: "Алматы", day: "12", month: "ДЕК", artist: "Frédéric Chopin Ensemble", venue: "Republic Hall", priceKzt: "12 000 ₸", priceUsd: "$24", priceRub: "2 200 ₽", tone: "from-[#d88b57] to-[#6c3429]" },
  { city: "Астана", day: "18", month: "ДЕК", artist: "NOCTURNE Orchestra", venue: "Crystal Hall", priceKzt: "15 000 ₸", priceUsd: "$30", priceRub: "2 700 ₽", tone: "from-[#6c83a8] to-[#263451]" },
  { city: "Шымкент", day: "24", month: "ДЕК", artist: "Moonlight Trio", venue: "Dostyk Arena", priceKzt: "8 500 ₸", priceUsd: "$17", priceRub: "1 550 ₽", tone: "from-[#ad8b6e] to-[#503f50]" },
  { city: "Караганды", day: "09", month: "ЯНВ", artist: "Golden Keys Quartet", venue: "Жастар Арена", priceKzt: "9 800 ₸", priceUsd: "$20", priceRub: "1 800 ₽", tone: "from-[#bc6f50] to-[#3e3647]" },
];

export function PlayerApp() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"music" | "2026" | "favorites" | "charts" | "concerts" | "subscription">("music");
  const [supportOpen, setSupportOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentPrice, setPaymentPrice] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [supportCategory, setSupportCategory] = useState("Оплата");
  const [supportText, setSupportText] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportError, setSupportError] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"appearance" | "audio" | "interface" | "account">("appearance");
  const [theme, setTheme] = useState<"midnight" | "carbon" | "aurora" | "sunset" | "wine" | "silver">("carbon");
  const [accent, setAccent] = useState<"orange" | "blue" | "violet" | "rose" | "white">("orange");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [audioQuality, setAudioQuality] = useState<"standard" | "high" | "lossless">("high");

  const themeColors = {
    midnight: ["#050b18", "#0d2041", "#1d4f88"],
    carbon: ["#050505", "#0b0b0c", "#242424"],
    aurora: ["#071b18", "#14322d", "#2d7569"],
    sunset: ["#170b08", "#482016", "#a95b3d"],
    wine: ["#13070d", "#351126", "#814158"],
    silver: ["#0d0f12", "#252a31", "#73808d"],
  };

  const accentColors = {
    orange: "#ff9a5b",
    blue: "#78a9ff",
    violet: "#b49cff",
    rose: "#ff8298",
    white: "#ffffff",
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("nocturne-favorites");
    if (saved) {
      setFavoriteIds(JSON.parse(saved) as string[]);
    }

    const savedTheme = window.localStorage.getItem("nocturne-theme");
    const savedAccent = window.localStorage.getItem("nocturne-accent");
    const savedDensity = window.localStorage.getItem("nocturne-density");
    const savedAudio = window.localStorage.getItem("nocturne-audio");

    if (savedTheme === "midnight" || savedTheme === "carbon" || savedTheme === "aurora" || savedTheme === "sunset" || savedTheme === "wine" || savedTheme === "silver") {
      setTheme(savedTheme);
    }
    if (savedAccent === "orange" || savedAccent === "blue" || savedAccent === "violet" || savedAccent === "rose" || savedAccent === "white") {
      setAccent(savedAccent);
    }
    if (savedDensity === "compact" || savedDensity === "comfortable" || savedDensity === "spacious") {
      setDensity(savedDensity);
    }
    if (savedAudio === "standard" || savedAudio === "high" || savedAudio === "lossless") {
      setAudioQuality(savedAudio);
    }
  }, []);

  useEffect(() => {
    const [start, middle, end] = themeColors[theme];
    document.documentElement.style.setProperty("--app-background-start", start);
    document.documentElement.style.setProperty("--app-background-middle", middle);
    document.documentElement.style.setProperty("--app-background-end", end);
    document.documentElement.style.setProperty("--app-accent", accentColors[accent]);
  }, [theme, accent]);

  function toggleFavorite(trackId: string) {
    setFavoriteIds((previous) => {
      const next = previous.includes(trackId)
        ? previous.filter((id) => id !== trackId)
        : [...previous, trackId];
      window.localStorage.setItem("nocturne-favorites", JSON.stringify(next));
      return next;
    });
  }
  const filteredTracks = useMemo(
    () => trackService.search(query),
    [query],
  );
  const player = useAudioPlayer(tracks[0]);

  function moveToTrack(offset: number) {
    const currentIndex = tracks.findIndex(
      (track) => track.id === player.track.id,
    );
    const nextIndex =
      (currentIndex + offset + tracks.length) % tracks.length;
    void player.selectTrack(tracks[nextIndex]);
  }

  function openPayment(title: string, price: string) {
    setPaymentTitle(title);
    setPaymentPrice(price);
    setCardNumber("");
    setCardHolder("");
    setCardExpiry("");
    setCardCvc("");
    setPaymentError("");
    setPaymentSuccess(false);
    setPaymentOpen(true);
  }

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2
      ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
      : digits;
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setPaymentError("Введите номер карты из 16 цифр");
      return;
    }
    if (!cardHolder.trim()) {
      setPaymentError("Введите имя держателя карты");
      return;
    }
    if (!/^\d{2}\s\/\s\d{2}$/.test(cardExpiry)) {
      setPaymentError("Введите срок в формате ММ / ГГ");
      return;
    }
    if (!/^\d{3}$/.test(cardCvc)) {
      setPaymentError("Введите CVC из 3 цифр");
      return;
    }

    setPaymentError("");
    setPaymentSuccess(true);
  }

  function openSupport() {
    setSupportCategory("Оплата");
    setSupportText("");
    setSupportEmail("");
    setSupportError("");
    setSupportSent(false);
    setSupportOpen(true);
  }

  function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supportEmail.trim() || !supportEmail.includes("@")) {
      setSupportError("Введите корректный email");
      return;
    }
    if (supportText.trim().length < 10) {
      setSupportError("Опишите проблему минимум в 10 символах");
      return;
    }

    setSupportError("");
    setSupportSent(true);
  }

  return (
    <main
      data-density={density}
      data-theme={theme}
      className={`relative min-h-screen overflow-hidden px-5 py-6 sm:px-8 lg:px-12 ${
        player.isPlaying ? "music-playing" : ""
      }`}
    >
      <div className="ambient-moon" aria-hidden="true" />
      <div className="ambient-waves" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="ambient-tiles" aria-hidden="true">
        <div className="ambient-tiles-grid" />
      </div>
      <div className="pointer-events-none absolute -left-28 top-[-7rem] h-[28rem] w-[28rem] rounded-full bg-[#a94d27]/[0.10] blur-[100px]" />
      <div className="pointer-events-none absolute right-[-10rem] top-[15%] h-[32rem] w-[32rem] rounded-full bg-[#18365e]/[0.12] blur-[110px]" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[32%] h-[30rem] w-[30rem] rounded-full bg-[#7e3924]/[0.08] blur-[120px]" />

      <aside className="fixed bottom-6 left-6 top-6 z-40 hidden w-[72px] flex-col items-center rounded-[26px] border border-white/[0.08] bg-black/55 py-5 backdrop-blur-xl md:flex">
        <button
          type="button"
          onClick={() => setActiveSection("music")}
          className="icon-button h-11 w-11 rounded-2xl bg-white text-sm font-bold text-[#111]"
          aria-label="NOCTURNE"
        >
          N
        </button>

        <nav className="mt-8 flex flex-1 flex-col items-center gap-3" aria-label="Боковая навигация">
          {([
            ["music", "Музыка", "M"],
            ["favorites", "Любимое", "♡"],
            ["charts", "Топ-чарт", "▲"],
            ["concerts", "Концерты", "◆"],
          ] as const).map(([id, label, symbol]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id === "favorites") {
                  setFavoritesOpen(true);
                } else {
                  setActiveSection(id);
                }
              }}
              className={`icon-button relative h-11 w-11 rounded-2xl text-sm ${
                activeSection === id && id !== "favorites"
                  ? "bg-white text-[#111]"
                  : "text-white/50 hover:bg-white/[0.08] hover:text-white"
              }`}
              aria-label={label}
              title={label}
            >
              {symbol}
              {id === "favorites" && favoriteIds.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff7d55] px-1 text-[9px] font-bold text-white">
                  {favoriteIds.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setFavoritesOpen(true)}
          className={`icon-button mb-2 h-11 w-11 rounded-2xl ${
            favoritesOpen
              ? "bg-[#ff815d] text-white"
              : "text-white/55 hover:bg-white/[0.08] hover:text-white"
          }`}
          aria-label="Любимые треки"
          title="Любимые треки"
        >
          <HeartIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="icon-button h-11 w-11 rounded-2xl text-white/55 hover:bg-white/[0.08] hover:text-white"
          aria-label="Настройки"
          title="Настройки"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="mt-3 h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-[#ffad72] via-[#9b6d71] to-[#4e638a]"
          aria-label="Аккаунт пользователя"
          title="Аккаунт"
        >
          <span className="flex h-full items-center justify-center text-xs font-bold">A</span>
        </button>
      </aside>

      {settingsOpen && (
        <section
          className="settings-fullscreen fixed inset-0 z-[80] overflow-y-auto bg-[#080808]"
          role="dialog"
          aria-modal="true"
          aria-label="Настройки NOCTURNE"
        >
          <div className="mx-auto min-h-screen max-w-[1180px] px-5 py-6 sm:px-8 lg:px-12">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--app-accent)]">NOCTURNE</p>
                <h1 className="mt-2 text-3xl font-semibold">Настройки</h1>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="icon-button h-11 w-11 rounded-full border border-white/10 bg-white/[0.06] text-xl text-white/70"
                aria-label="Закрыть настройки"
              >
                ×
              </button>
            </header>

            <div className="mt-8 grid gap-5 lg:grid-cols-[210px_1fr]">
              <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Разделы настроек">
                {([
                  ["appearance", "Оформление"],
                  ["audio", "Звук"],
                  ["interface", "Интерфейс"],
                  ["account", "Аккаунт"],
                ] as const).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSettingsTab(id)}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm transition ${
                      settingsTab === id
                        ? "bg-white text-[#111]"
                        : "border border-white/[0.08] text-white/55 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="min-h-[520px] rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7">
                {settingsTab === "appearance" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--app-accent)]">Внешний вид</p>
                    <h2 className="mt-2 text-2xl font-semibold">Тема приложения</h2>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        ["midnight", "Полночь", "#08172f", "#1d4f88"],
                        ["carbon", "Карбон", "#050505", "#353535"],
                        ["aurora", "Аврора", "#071b18", "#2d7569"],
                        ["sunset", "Закат", "#170b08", "#a95b3d"],
                        ["wine", "Бордовый", "#13070d", "#814158"],
                        ["silver", "Серебро", "#0d0f12", "#73808d"],
                      ].map(([id, label, start, end]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setTheme(id as typeof theme);
                            window.localStorage.setItem("nocturne-theme", id);
                          }}
                          className={`group rounded-2xl border p-3 text-left transition ${
                            theme === id
                              ? "border-[var(--app-accent)] bg-white/[0.08]"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <span
                            className="block h-20 rounded-xl"
                            style={{ background: `linear-gradient(135deg, ${start}, ${end})` }}
                          />
                          <span className="mt-3 block text-sm">{label}</span>
                        </button>
                      ))}
                    </div>

                    <h3 className="mt-7 text-sm font-semibold">Цвет акцента</h3>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {[
                        ["orange", "#ff9a5b"],
                        ["blue", "#78a9ff"],
                        ["violet", "#b49cff"],
                        ["rose", "#ff8298"],
                        ["white", "#ffffff"],
                      ].map(([id, color]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setAccent(id as typeof accent);
                            window.localStorage.setItem("nocturne-accent", id);
                          }}
                          className={`h-10 w-10 rounded-full border-2 transition hover:scale-110 ${
                            accent === id ? "border-white" : "border-white/10"
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Цвет акцента ${id}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "audio" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--app-accent)]">Воспроизведение</p>
                    <h2 className="mt-2 text-2xl font-semibold">Качество звука</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {([
                        ["standard", "Стандартное", "Экономия данных"],
                        ["high", "Высокое", "Рекомендуется"],
                        ["lossless", "Lossless", "Максимальное качество"],
                      ] as const).map(([id, label, description]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setAudioQuality(id);
                            window.localStorage.setItem("nocturne-audio", id);
                          }}
                          className={`rounded-2xl border p-4 text-left transition ${
                            audioQuality === id
                              ? "border-[var(--app-accent)] bg-[var(--app-accent)]/10"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <span className="block text-sm font-semibold">{label}</span>
                          <span className="mt-2 block text-xs text-white/40">{description}</span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/[0.08] px-4 py-4 text-sm">
                      Нормализация громкости
                      <span className="rounded-full bg-[var(--app-accent)] px-3 py-1 text-xs text-black">Вкл</span>
                    </button>
                  </div>
                )}

                {settingsTab === "interface" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--app-accent)]">Разметка</p>
                    <h2 className="mt-2 text-2xl font-semibold">Плотность интерфейса</h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {([
                        ["compact", "Компактно", "Больше треков"],
                        ["comfortable", "Стандартно", "Баланс"],
                        ["spacious", "Просторно", "Больше воздуха"],
                      ] as const).map(([id, label, description]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setDensity(id);
                            window.localStorage.setItem("nocturne-density", id);
                          }}
                          className={`rounded-2xl border p-4 text-left transition ${
                            density === id
                              ? "border-[var(--app-accent)] bg-[var(--app-accent)]/10"
                              : "border-white/[0.08] hover:border-white/20"
                          }`}
                        >
                          <div className={`mb-4 grid gap-1 ${id === "compact" ? "grid-rows-4" : id === "comfortable" ? "grid-rows-3" : "grid-rows-2"}`}>
                            {[1, 2, 3, 4].slice(id === "compact" ? 0 : id === "comfortable" ? 0 : 0, id === "spacious" ? 2 : 4).map((item) => (
                              <span key={item} className="h-2 rounded-full bg-white/15" />
                            ))}
                          </div>
                          <span className="block text-sm font-semibold">{label}</span>
                          <span className="mt-1 block text-xs text-white/40">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === "account" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--app-accent)]">Профиль</p>
                    <h2 className="mt-2 text-2xl font-semibold">Аккаунт NOCTURNE</h2>
                    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/[0.08] p-4">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ffad72] via-[#9b6d71] to-[#4e638a] text-xl font-bold">A</span>
                      <div>
                        <p className="font-semibold">Личный аккаунт</p>
                        <p className="mt-1 text-xs text-white/40">user@nocturne.local</p>
                      </div>
                    </div>
                    <button type="button" className="mt-4 rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
                      Управление подпиской
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative mx-auto max-w-[1180px] md:pl-[88px]">
        <header className="flex items-center justify-between gap-4">
          <div className="text-lg font-bold tracking-[0.32em] text-white">NOCTURNE</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSupport}
              className="icon-button h-10 rounded-full border border-white/15 bg-white/[0.08] px-4 text-xs text-white/75"
            >
              Поддержка
            </button>
            <div className="relative hidden sm:block">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/65" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск"
                className="w-36 rounded-full border border-white/15 bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] outline-none backdrop-blur-md transition placeholder:text-white/45 focus:w-52 focus:border-white/30 sm:w-52"
              />
            </div>
          </div>
        </header>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Главное меню">
          {([
            ["music", "Музыка"],
            ["2026", "2026"],
            ["charts", "Топ-чарт"],
            ["concerts", "Концерты"],
            ["subscription", "Подписка"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`icon-button whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                activeSection === id
                  ? "bg-white text-[#0a1a34]"
                  : "border border-white/10 bg-white/[0.06] text-white/65"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8 grid items-center gap-8 lg:min-h-[calc(100vh-110px)] lg:grid-cols-[minmax(320px,0.9fr)_1.1fr] lg:gap-14">
          <section className="mx-auto w-full max-w-[440px]">
            <div key={player.track.id} className="fade-track rounded-[36px] border border-white/15 bg-white/[0.07] p-3 shadow-[0_28px_70px_rgba(0,8,28,0.38)] backdrop-blur-sm">
              <TrackArt track={player.track} className="aspect-square w-full rounded-[28px]" />
            </div>
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">{player.track.title}</h1>
              <p className="mt-2 text-sm text-white/55">
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
          </section>

          <section className="mb-8 rounded-[32px] border border-white/[0.10] bg-black/35 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-7 lg:mb-0">
            {activeSection === "music" && (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Коллекция</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Моя музыка</h2>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/60">{filteredTracks.length}</span>
                </div>
                {filteredTracks.length > 0 ? (
                  <TrackList
                    tracks={filteredTracks}
                    activeTrackId={player.track.id}
                    favoriteIds={favoriteIds}
                    onSelect={(track) => void player.selectTrack(track)}
                    onToggleFavorite={toggleFavorite}
                  />
                ) : (
                  <p className="mt-10 text-center text-sm text-white/45">Ничего не найдено</p>
                )}
              </>
            )}

            {activeSection === "2026" && (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffad73]">Новые релизы</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Треки 2026 года</h2>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55">2026</span>
                </div>
                <TrackList
                  tracks={tracks.filter((track) => track.year === 2026)}
                  activeTrackId={player.track.id}
                  favoriteIds={favoriteIds}
                  onSelect={(track) => void player.selectTrack(track)}
                  onToggleFavorite={toggleFavorite}
                />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {tracks.filter((track) => track.year === 2026).map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => void player.selectTrack(track)}
                      className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      {track.artworkUrl ? (
                        <img src={track.artworkUrl} alt={track.artist} className="aspect-square w-full rounded-xl object-cover" />
                      ) : (
                        <TrackArt track={track} className="aspect-square w-full rounded-xl" />
                      )}
                      <p className="mt-2 truncate text-xs font-semibold">{track.artist}</p>
                      <p className="mt-0.5 truncate text-[10px] text-white/40">{track.title}</p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeSection === "favorites" && (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffad73]">Ваше коллекция</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Любимые треки</h2>
                  </div>
                  <span className="rounded-full bg-[#ff7d55]/15 px-3 py-1.5 text-xs text-[#ffad73]">{favoriteIds.length}</span>
                </div>
                {favoriteIds.length > 0 ? (
                  <TrackList
                    tracks={tracks.filter((track) => favoriteIds.includes(track.id))}
                    activeTrackId={player.track.id}
                    favoriteIds={favoriteIds}
                    onSelect={(track) => void player.selectTrack(track)}
                    onToggleFavorite={toggleFavorite}
                  />
                ) : (
                  <div className="mt-10 flex min-h-52 flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 text-center">
                    <HeartIcon className="h-8 w-8 text-white/25" />
                    <p className="mt-4 text-sm font-semibold">Здесь пока пусто</p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-white/40">
                      Нажмите на сердечко рядом с треком, чтобы добавить его сюда
                    </p>
                  </div>
                )}
              </>
            )}

            {activeSection === "charts" && (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffd05a]">Топ-чарт</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Песни недели</h2>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffb26b]" />
                    обновлено сегодня
                  </div>
                </div>
                <div className="mt-5 grid gap-2.5">
                  {tracks.map((track, index) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => void player.selectTrack(track)}
                      className={`group grid w-full grid-cols-[44px_52px_minmax(0,1fr)_48px] items-center gap-3 rounded-[18px] px-3 py-2.5 text-left transition duration-300 ${
                        player.track.id === track.id
                          ? "bg-gradient-to-r from-[#ff9a5b]/20 to-white/[0.07]"
                          : "bg-white/[0.025] hover:-translate-y-0.5 hover:bg-white/[0.09]"
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-sm font-bold text-[#ffc06f]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <TrackArt track={track} className="h-[52px] w-[52px] rounded-[14px]" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{track.title}</span>
                        <span className="mt-1 block truncate text-xs text-white/45">{track.artist}</span>
                      </span>
                      <span className="text-right">
                        <span className="block text-xs font-semibold text-[#ffb26b]">▲ {12 - index * 2}</span>
                        <span className="mt-1 block text-[10px] text-white/35">позиций</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {activeSection === "concerts" && (
              <>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffad73]">Live</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Концерты исполнителей</h2>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">{concerts.length} события</span>
                </div>
                <div className="mt-5 grid gap-3">
                  {concerts.map((concert, index) => (
                    <article
                      key={`${concert.city}-${concert.artist}`}
                      className="concert-card group grid grid-cols-[74px_minmax(0,1fr)_auto] items-center gap-4 overflow-hidden rounded-[22px] border border-white/[0.08] bg-gradient-to-r from-white/[0.07] to-white/[0.025] p-3"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <div className={`relative flex h-[74px] w-[74px] flex-col items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br ${concert.tone}`}>
                        <div className="absolute -right-5 -top-5 h-12 w-12 rounded-full border border-white/15" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">{concert.month}</span>
                        <span className="mt-0.5 text-2xl font-bold">{concert.day}</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">{concert.artist}</h3>
                        <p className="mt-1 text-xs text-white/45">{concert.venue} · {concert.city}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] text-white/70">{concert.priceKzt}</span>
                          <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] text-white/55">{concert.priceUsd}</span>
                          <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[10px] text-white/55">{concert.priceRub}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openPayment(concert.artist, concert.priceKzt)}
                        className="icon-button h-11 rounded-full bg-white px-4 text-xs font-semibold text-[#111111]"
                      >
                        Билеты
                      </button>
                    </article>
                  ))}
                </div>
              </>
            )}

            {activeSection === "subscription" && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffd05a]">NOCTURNE Premium</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Выберите подписку</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Месяц", "2 490 ₸", "Безлимитная музыка"],
                    ["Год", "19 900 ₸", "Экономия 33%"],
                  ].map(([name, price, description]) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => openPayment(`NOCTURNE Premium · ${name}`, price)}
                      className="subscription-card rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-left"
                    >
                      <span className="text-xs text-white/50">{name}</span>
                      <span className="subscription-price mt-2 block text-2xl font-bold transition">{price}</span>
                      <span className="mt-2 block text-xs text-white/55">{description}</span>
                      <span className="subscription-arrow mt-4 block text-sm font-semibold text-white/75">Выбрать →</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        <audio
          ref={player.audioRef}
          src={player.track.audioUrl}
          preload="metadata"
        />
      </div>

      {favoritesOpen && (
        <section
          className="favorites-fullscreen fixed inset-0 z-[70] overflow-y-auto bg-[#080808]"
          role="dialog"
          aria-modal="true"
          aria-label="Любимые треки"
        >
          <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#d95f38]/10 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[#315b8c]/12 blur-[120px]" />

          <div className="relative mx-auto min-h-screen max-w-[1320px] px-5 py-6 sm:px-8 lg:px-12">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff815d]">
                  <HeartIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">NOCTURNE</p>
                  <h1 className="mt-1 text-xl font-semibold">Любимые треки</h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFavoritesOpen(false)}
                className="icon-button h-11 w-11 rounded-full border border-white/10 bg-white/[0.06] text-xl text-white/70"
                aria-label="Закрыть избранное"
              >
                ×
              </button>
            </header>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(320px,0.75fr)_1.25fr]">
              <aside className="lg:sticky lg:top-6 lg:h-fit">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-4">
                  <TrackArt track={player.track} className="fade-track aspect-square w-full rounded-[24px]" />
                  <div className="mt-5 text-center">
                    <h2 className="truncate text-xl font-semibold">{player.track.title}</h2>
                    <p className="mt-1 text-sm text-white/45">{player.track.artist}</p>
                  </div>
                  <div className="px-1">
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
                  </div>
                </div>
              </aside>

              <section>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff9a72]">Моя коллекция</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">Избранное</h2>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">
                    {favoriteIds.length} треков
                  </span>
                </div>

                {favoriteIds.length > 0 ? (
                  <div className="mt-6">
                    <TrackList
                      tracks={tracks.filter((track) => favoriteIds.includes(track.id))}
                      activeTrackId={player.track.id}
                      favoriteIds={favoriteIds}
                      onSelect={(track) => void player.selectTrack(track)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </div>
                ) : (
                  <div className="mt-6 flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.025] text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
                      <HeartIcon className="h-7 w-7 text-white/25" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">Добавьте первый трек</h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
                      Нажмите на сердечко в каталоге, и трек появится в этой вкладке
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      )}

      {paymentOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setPaymentOpen(false);
          }}
        >
          <div className="payment-modal w-full max-w-[520px] rounded-[30px] border border-white/[0.12] bg-[#111111]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-7">
            {paymentSuccess ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-black">
                  ✓
                </div>
                <h2 className="mt-5 text-2xl font-semibold">Оплата оформлена</h2>
                <p className="mt-2 text-sm text-white/45">
                  Покупка «{paymentTitle}» успешно подтверждена.
                </p>
                <button
                  type="button"
                  onClick={() => setPaymentOpen(false)}
                  className="icon-button mt-7 h-12 rounded-full bg-white px-7 text-sm font-semibold text-black"
                >
                  Готово
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--app-accent)]">Безопасная оплата</p>
                    <h2 id="payment-title" className="mt-2 text-2xl font-semibold">Реквизиты карты</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentOpen(false)}
                    className="icon-button h-10 w-10 rounded-full border border-white/10 text-xl text-white/60"
                    aria-label="Закрыть оплату"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3">
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-sm font-semibold">{paymentTitle}</p>
                    <p className="mt-1 text-xs text-white/40">Единоразовый платеж</p>
                  </div>
                  <span className="whitespace-nowrap text-lg font-bold">{paymentPrice}</span>
                </div>

                <form className="mt-5" onSubmit={submitPayment}>
                  <label className="block">
                    <span className="text-xs text-white/55">Номер карты</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                      placeholder="0000 0000 0000 0000"
                      className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-xs text-white/55">Имя держателя</span>
                    <input
                      type="text"
                      autoComplete="cc-name"
                      value={cardHolder}
                      onChange={(event) => setCardHolder(event.target.value.toUpperCase())}
                      placeholder="IVAN IVANOV"
                      className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                    />
                  </label>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label>
                      <span className="text-xs text-white/55">Срок</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        value={cardExpiry}
                        onChange={(event) => setCardExpiry(formatExpiry(event.target.value))}
                        placeholder="ММ / ГГ"
                        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                      />
                    </label>
                    <label>
                      <span className="text-xs text-white/55">CVC</span>
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={cardCvc}
                        onChange={(event) => setCardCvc(event.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="•••"
                        className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                      />
                    </label>
                  </div>

                  {paymentError && (
                    <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-3 py-2 text-xs text-red-200">
                      {paymentError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-5 h-12 w-full rounded-xl bg-white text-sm font-semibold text-black transition hover:brightness-90 active:scale-[0.98]"
                  >
                    Оплатить {paymentPrice}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {supportOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSupportOpen(false);
          }}
        >
          <div className="support-modal w-full max-w-[620px] rounded-[30px] border border-white/[0.12] bg-[#111111]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-7">
            {supportSent ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-black">
                  ✓
                </div>
                <h2 className="mt-5 text-2xl font-semibold">Обращение отправлено</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/45">
                  Мы получили описание проблемы «{supportCategory}» и ответим на {supportEmail}.
                </p>
                <button
                  type="button"
                  onClick={() => setSupportOpen(false)}
                  className="icon-button mt-7 h-12 rounded-full bg-white px-7 text-sm font-semibold text-black"
                >
                  Готово
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--app-accent)]">Помощь NOCTURNE</p>
                    <h2 id="support-title" className="mt-2 text-2xl font-semibold">Что случилось?</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupportOpen(false)}
                    className="icon-button h-10 w-10 rounded-full border border-white/10 text-xl text-white/60"
                    aria-label="Закрыть поддержку"
                  >
                    ×
                  </button>
                </div>

                <form className="mt-6" onSubmit={submitSupport}>
                  <span className="text-xs text-white/55">Выберите категорию</span>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {["Оплата", "Подписка", "Воспроизведение", "Аккаунт", "Концерты", "Другое"].map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSupportCategory(category)}
                        className={`support-category h-11 rounded-xl border text-xs ${
                          supportCategory === category
                            ? "support-category-active border-[#ff7a32] bg-[#ff7a32]/15 text-[#fff1e8]"
                            : "border-white/[0.08] text-white/50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <label className="mt-5 block">
                    <span className="text-xs text-white/55">Email для ответа</span>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(event) => setSupportEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-xs text-white/55">Опишите проблему</span>
                    <textarea
                      value={supportText}
                      onChange={(event) => setSupportText(event.target.value)}
                      placeholder="Расскажите, что произошло и какие действия привели к проблеме..."
                      rows={5}
                      className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[var(--app-accent)]"
                    />
                  </label>

                  {supportError && (
                    <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-3 py-2 text-xs text-red-200">
                      {supportError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-5 h-12 w-full rounded-xl bg-white text-sm font-semibold text-black transition hover:brightness-90 active:scale-[0.98]"
                  >
                    Отправить обращение
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
