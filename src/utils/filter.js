import {FilterType} from '../const';

export const filter = {
  [FilterType.DEFAULT]: (films) => films,
  [FilterType.FAVOURITES]: (films) => films.filter((film) => film.isFavourite),
  [FilterType.WATCHED]: (films) => films.filter((film) => film.isWatched),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchlist),
};
