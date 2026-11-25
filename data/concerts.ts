export type Concert = {
  id: string;
  title: string;
  date: string;
  venue: string;
  priceFrom: string;
  posterUrl: string;
  ticketUrl: string;
};

export const concerts: Concert[] = [
  {
    id: "la-grand-finale",
    title: "La Grand Finale + Скриптонит",
    date: "27 ноября 2026",
    venue: "Colossus Space, Алматы",
    priceFrom: "От 20 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/LaGrandFinaleSKRIPTONITspecialguest/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11780",
  },
  {
    id: "komancheros-kish",
    title: "Komancheros — трибьют «Король и Шут»",
    date: "28 ноября 2026",
    venue: "Рок-клуб «Жесть», Алматы",
    priceFrom: "От 10 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/KomancherosBolshoyosennytribyutKoroliShut/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11699",
  },
  {
    id: "aro-almaty",
    title: "ARO",
    date: "29 ноября 2026",
    venue: "Almaty Arena",
    priceFrom: "От 5 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/Aro/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11590",
  },
  {
    id: "berkut-aisha",
    title: "Беркут және Аиша",
    date: "5 декабря 2026",
    venue: "Дворец Республики, Алматы",
    priceFrom: "От 5 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/BerkutzhneAisha/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11124",
  },
  {
    id: "akimmmich-bimo",
    title: "AKIMMMICH & BIMO",
    date: "9 декабря 2026",
    venue: "Дворец Республики, Алматы",
    priceFrom: "От 5 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/AKIMMMICHBIMO/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11711",
  },
  {
    id: "zhyl-ani",
    title: "«Жыл әні»",
    date: "14 декабря 2026",
    venue: "Дворец Республики, Алматы",
    priceFrom: "От 7 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/Zhyln/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11676",
  },
  {
    id: "quest-pistols",
    title: "Quest Pistols",
    date: "18 декабря 2026",
    venue: "Bla Bla Bar, Алматы",
    priceFrom: "От 15 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/QuestPistolsvBlaBlaBarAlmaty/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11781",
  },
  {
    id: "nutcracker-jazz",
    title: "Джаз-сюита «Щелкунчик»",
    date: "19 декабря 2026",
    venue: "Almaty Theatre",
    priceFrom: "От 18 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/ShchelkunchikdzhazsyuitavispolneniiBolshogodzhazovogoorkestra/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11351",
  },
  {
    id: "serik-ibragimov",
    title: "Serik Ibragimov",
    date: "20 декабря 2026",
    venue: "Almaty Arena",
    priceFrom: "От 5 000 ₸",
    posterUrl: "https://cdn.kino.kz/partners-events/SerikIbragimov/p168x242.webp",
    ticketUrl: "https://kino.kz/ru/concert/event/11777",
  },
];
