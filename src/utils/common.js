import dayjs from 'dayjs';

export const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

export const humanizeFilmReleaseDetailedDate = (date) => dayjs(date).format('DD MMMM YYYY');

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('YYYY');

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const sortFilmByDate = (filmA, filmB) => dayjs(filmB.released).diff(dayjs(filmA.released));

export const sortFilmByRate = (filmA, filmB) => filmB.rating - filmA.rating;

export const isCtrlEnterEvent = (evt) => evt.key === 'Enter' && evt.ctrlKey;

export const cutText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;
