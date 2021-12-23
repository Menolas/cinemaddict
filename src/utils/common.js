import dayjs from 'dayjs';
export const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
export const humanizeFilmReleaseDetailedDate = (date) => dayjs(date).format('DD MMMM YYYY');
export const humanizeFilmReleaseDate = (date) => dayjs(date).format('YYYY');

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomValue = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const makeElementLookActive = (item, cl) => {
  item.classList.add(cl);
};

export const removeElementActiveLook = (array, cl) => {
  array.forEach((item) => {
    item.classList.remove(cl);
  });
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortFilmByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.released, filmB.released);

  return weight ?? dayjs(filmB.released).diff(dayjs(filmA.released));
};

export const sortFilmByRate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.rating, filmB.rating);

  return weight ?? dayjs(filmB.rating).diff(dayjs(filmA.rating));
};
