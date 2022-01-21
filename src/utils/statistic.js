import dayjs from 'dayjs';
import {StatisticType} from '../const';

export const countFilmsByGenre = (films, genre) =>
  films.filter((film) => film.genres.some((filmGenre) => filmGenre === genre)).length;

export const getGenresWithCountFromFilms = (films) => {
  const genres = new Set();
  films.forEach((film) => {
    film.genres.forEach((genre) => genres.add(genre));
  });

  return Array.from(genres, (genre) => ({
    genre: genre,
    count: countFilmsByGenre(films, genre)
  }));
};

export const sortGenreCountDown = (genre1, genre2) => genre1.count < genre2.count ? 1 : -1;

export const getTotalDuration = (films) => {
  const initialValue = 0;
  return films.reduce((totalDuration, film) => totalDuration + film.runtime, initialValue);
};

export const getDateStartFromStatisticType = (statisticType) => {
  switch (statisticsType) {
    case StatisticType.ALL:
      return null;
    case StatisticType.TODAY:
      return dayjs().startOf('day').toDate();
    case StatisticType.WEEK:
      return dayjs().subtract(1, 'week').toDate();
    case StatisticType.MONTH:
      return dayjs().subtract(1, 'month').toDate();
    case StatisticType.YEAR:
      return dayjs().subtract(1, 'year').toDate();
  }
  return null;
};

export const getFilmsFilteredByTime = (statisticsType, films) => {
  const startDate = getDateStartFromStatisticType(statisticType);

  return startDate
    ? films.filter((film) => dayjs(film.watchingDate).isAfter(startDate))
    : films;
};