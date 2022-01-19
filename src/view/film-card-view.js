import AbstractView from './abstract-view.js';
import {humanizeFilmReleaseDate} from '../utils/common.js';
import {FilterType} from '../const.js';

const createFilmCardTemplate = (film) => {

  const {
    title,
    poster,
    rating,
    released,
    watchingTime,
    genres,
    description,
    comments,
    isInWatchlist,
    isWatched,
    isFavourite,
  } = film;

  const releaseDate = humanizeFilmReleaseDate(released);
  const activeClass = 'film-card__controls-item--active';
  const favouriteClassName = isFavourite ? activeClass : '';
  const watchedClassName = isWatched ? activeClass : '';
  const watchListClassName = isInWatchlist ? activeClass : '';

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${watchingTime}</span>
        <span class="film-card__genre">${genres}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchListClassName}" type="button" data-filter-type="${FilterType.WATCHLIST}">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button" data-filter-type="${FilterType.WATCHED}">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favouriteClassName}" type="button" data-filter-type="${FilterType.FAVOURITES}">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setPopupClickHandler = (callback) => {
    this._callback.popupClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#popupClickHandler);
  }

  setAddToFilterClickHandler = (callback) => {
    this._callback.addToFilter = callback;
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#cardControlBlockClickHandler);
  }

  #popupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupClick();
  }

  #cardControlBlockClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this._callback.addToFilter(evt.target.dataset.filterType);
  }
}
