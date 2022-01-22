import dayjs from 'dayjs';
import {StatisticType} from '../const';

export const getStartDate = (statisticType) => {
  switch (statisticType) {
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

export const getFilmsFilteredByStatisticDate = (statisticType, films) => {
  const startDate = getStartDate(statisticType);

  return startDate
    ? films.filter((film) => dayjs(film.watchingDate).isAfter(startDate))
    : films;
};

export const getStatisticGenres = (films) => {
  const statisticGenres = new Set();
  films.forEach((film) => {
    film.genre.forEach((item) => statisticGenres.add(item));
  });

  console.log(statisticGenres);

  return Array.from(statisticGenres, (item) => ({
    item: item,
    count: countFilmsByGenre(films, item),
  }));
};

export const countFilmsByGenre = (films, genre) =>
  films.filter((film) => film.genre.some((filmGenre) => filmGenre === genre)).length;

export const sortGenreCountDown = (genre1, genre2) => genre1.count < genre2.count ? 1 : -1;

export const getTotalDuration = (films) => {
  const initialValue = 0;
  return films.reduce((totalDuration, film) => totalDuration + film.runtime, initialValue);
};


