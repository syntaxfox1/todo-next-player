export type MoviePremiere = {
  id: string;
  title: string;
  releaseDate: string;
  region: string;
  kind: string;
  studio: string;
  posterUrl?: string;
  ticketPrice: string;
  ticketDetails?: string;
  ticketUrl?: string;
  officialUrl: string;
};

export const moviePremieres: MoviePremiere[] = [
  {
    id: "dune-part-three",
    title: "Дюна: Часть третья",
    releaseDate: "18 декабря 2026",
    region: "США",
    kind: "Фантастика",
    studio: "Warner Bros.",
    posterUrl: "https://cdn.kino.kz/movies/Dune__Part_Three/p344x489.webp",
    ticketPrice: "4 500 ₸",
    ticketDetails: "Взрослый IMAX · Алматы · 16 декабря",
    ticketUrl: "https://kino.kz/ru/movie/12214?date=2026-12-16",
    officialUrl: "https://www.warnerbros.com/movies/dune-part-three",
  },
  {
    id: "avengers-doomsday",
    title: "Мстители: Доктор Дум",
    releaseDate: "18 декабря 2026",
    region: "США",
    kind: "Боевик · фантастика",
    studio: "Marvel Studios",
    posterUrl: "https://cdn.kino.kz/movies/Avengers__Doomsday/p344x489.webp",
    ticketPrice: "От 2 000 ₸",
    ticketDetails: "Взрослый · Алматы · сеансы с 7 января 2027",
    ticketUrl: "https://kino.kz/ru/movie/12344?date=2027-01-07",
    officialUrl: "https://www.marvel.com/movies/avengers-doomsday",
  },
  {
    id: "angry-birds-3",
    title: "Angry Birds 3",
    releaseDate: "23 декабря 2026",
    region: "США",
    kind: "Анимация",
    studio: "Paramount Pictures",
    posterUrl: "https://public-website-assets.paramountpictures.com/paramount2025/styles/poster_medium/s3/2026-06/angrybirds_onesheet.jpg?itok=v4XWnYOv",
    ticketPrice: "Продажи в Алматы ещё не открыты",
    officialUrl: "https://www.paramount.com/movies/the-angry-birds-movie-3",
  },
  {
    id: "children-of-blood-and-bone",
    title: "Children of Blood and Bone",
    releaseDate: "15 января 2027",
    region: "США",
    kind: "Фэнтези",
    studio: "Paramount Pictures",
    posterUrl: "https://public-website-assets.paramountpictures.com/paramount2025/styles/poster_medium/s3/2026-11/children_2.jpg?itok=h387n5UH",
    ticketPrice: "Продажи ещё не открыты",
    officialUrl: "https://www.paramount.com/movies/children-blood-and-bone",
  },
  {
    id: "the-rescue",
    title: "The Rescue",
    releaseDate: "29 января 2027",
    region: "США",
    kind: "Приключения",
    studio: "Paramount Pictures",
    posterUrl: "https://public-website-assets.paramountpictures.com/paramount2025/styles/poster_medium/s3/2026-09/rescue_onesheet.jpg?itok=OnNRKZng",
    ticketPrice: "Продажи ещё не открыты",
    officialUrl: "https://www.paramount.com/movies/the-rescue",
  },
  {
    id: "k-pop-the-debut",
    title: "K-POP: The Debut",
    releaseDate: "26 февраля 2027",
    region: "США",
    kind: "Музыкальная драма",
    studio: "Paramount Pictures",
    posterUrl: "https://public-website-assets.paramountpictures.com/paramount2025/styles/poster_medium/s3/2026-11/kpopp.jpg?itok=W8Bn_cm6",
    ticketPrice: "Продажи ещё не открыты",
    officialUrl: "https://www.paramount.com/movies/k-pop-debut",
  },
  {
    id: "sonic-4",
    title: "Соник 4",
    releaseDate: "19 марта 2027",
    region: "США",
    kind: "Приключения",
    studio: "Paramount Pictures",
    posterUrl: "https://public-website-assets.paramountpictures.com/paramount2025/styles/poster_medium/s3/2026-03/sonic4_onesheet.jpg?itok=Y8_KXgUR",
    ticketPrice: "Продажи ещё не открыты",
    officialUrl: "https://www.paramount.com/movies/sonic-the-hedgehog-4",
  },
  {
    id: "shrek-5",
    title: "Шрек 5",
    releaseDate: "30 июня 2027",
    region: "США",
    kind: "Анимация",
    studio: "DreamWorks Animation",
    ticketPrice: "Продажи ещё не открыты",
    officialUrl: "https://www.universalpictures.com/movies/shrek-5",
  },
];
