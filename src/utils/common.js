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
}

export const removeElementActiveLook = (array, cl) => {
  array.forEach(item => {
    item.classList.remove(cl);
  });
}
