export const FILM_COUNT = 23;
export const FILM_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATE: 'rate',
};

export const filmToFilterMap = {
  favourites: (films) => films.filter((film) => film.isFavourite).length,
  history: (films) => films.filter((film) => film.isWatched).length,
  watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
};

export const FilterType = {
  DEFAULT: 'default',
  FAVOURITES: 'favourites',
  WATCHED: 'watched',
  WATCHLIST: 'watchlist',
};
