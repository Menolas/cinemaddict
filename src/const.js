export const FILM_COUNT = 31;
export const FILM_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATE: 'rate',
};

export const FilterType = {
  DEFAULT: 'All movies',
  FAVOURITES: 'Favourites',
  WATCHED: 'History',
  WATCHLIST: 'Whatchlist',
};

export const NoFilmInfo = {
  DEFAULT: 'There are no movies in our database',
  FAVOURITES: 'There are no favorite movies now',
  WATCHED: 'There are no watched movies now',
  WATCHLIST: 'There are no movies to watch now',
}

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_FILM: 'ADD_COMMENT',
  DELETE_FILM: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
