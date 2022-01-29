import dayjs from 'dayjs';

export const humanizeFilmReleaseDetailedDate = (date) => dayjs(date).format('DD MMMM YYYY');

export const humanizeFilmReleaseDate = (date) => dayjs(date).format('YYYY');

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const sortFilmByDate = (filmA, filmB) => dayjs(filmB.released).diff(dayjs(filmA.released));

export const sortFilmByRate = (filmA, filmB) => filmB.rating - filmA.rating;

export const sortFilmByComments = (film1, film2) => film1.comments.length < film2.comments.length ? 1 : -1;

export const isCtrlEnterEvent = (evt) => evt.key === 'Enter' && evt.ctrlKey;

export const cutText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;

export const getUserRank = (films) => {
  let rank;

  if (films >= 1 && films < 11) {
    rank = 'Novice';
  } else if (films >= 11 && films < 21) {
    rank = 'Fan';
  } else if (films >= 21) {
    rank = 'Movie Buff';
  }

  return rank;
};

export const getCommentTime = (date) => {
  const diffYear = dayjs(new Date()).diff(dayjs(date), 'year');
  if(diffYear>1){
    return `${diffYear} years ago`;
  }

  const diffMonth = dayjs(new Date()).diff(dayjs(date), 'month');
  if(diffMonth>1) {
    return `${diffMonth} month ago`;
  }

  const diffDays = dayjs(new Date()).diff(dayjs(date), 'day');
  if(diffDays>1){
    return `${diffDays} days ago`;
  }

  const diffHours = dayjs(new Date()).diff(dayjs(date), 'hour');
  if(diffHours>1){
    return `${diffHours} hours ago`;
  }

  const diffMinutes = dayjs(new Date()).diff(dayjs(date), 'minute');
  if(diffMinutes>1){
    return `${diffMinutes} minutes ago`;
  }

  return 'now';
};