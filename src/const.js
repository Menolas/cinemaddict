export const FILM_COUNT = 42;
export const FILM_COUNT_PER_STEP = 5;
export const MAX_TEXT_LENGTH_ON_CARD = 140;
export const MINUTES_IN_HOURS = 60;

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
  [FilterType.DEFAULT]: 'There are no movies in our database',
  [FilterType.FAVOURITES]: 'There are no favorite movies now',
  [FilterType.WATCHED]: 'There are no watched movies now',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
};

export const CommentAction = {
  ADD: 'add',
  DELETE: 'delete',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  COMMENTS: 'COMMENTS',
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATISTIC: 'STATISTIC',
};

export const StatisticType = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
