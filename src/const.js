export const FILM_COUNT_PER_STEP = 5;
export const TEXT_LENGTH_ON_FILM_CARD = 140;
export const FILM_TOP_RATED_COUNT = 2;
export const FILM_MOST_COMMENTED_COUNT = 2;
export const MINUTES_IN_HOURS = 60;
export const STATISTIC_BAR_HEIGHT = 50;

export const StatisticDiagramColors = {
  STATISTIC_BAR_COLOR: '#ffe800',
  HOVER_STATISTIC_BAR_COLOR: '#ffe800',
  STATISTIC_DIAGRAM_LABELS_COLOR: '#ffffff',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATE: 'rate',
};

export const FilterType = {
  DEFAULT: 'All movies',
  FAVOURITES: 'Favourites',
  WATCHED: 'History',
  WATCHLIST: 'Watchlist',
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

export const ExtraTitle = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};
