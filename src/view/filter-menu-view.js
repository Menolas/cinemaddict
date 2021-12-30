import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const createFilterMenuTemplate = (films) => {

  const favourites = films.filter((film) => film.isFavourite).length;
  const history = films.filter((film) => film.isWatched).length;
  const watchlist = films.filter((film) => film.isInWatchlist).length;

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
               <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${FilterType.DEFAULT}">All movies</a>
               <a href="#watchlist" class="main-navigation__item" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
               <a href="#history" class="main-navigation__item" data-filter-type="${FilterType.WATCHED}">History <span class="main-navigation__item-count">${history}</span></a>
               <a href="#favourites" class="main-navigation__item" data-filter-type="${FilterType.FAVOURITES}">Favourites <span class="main-navigation__item-count">${favourites}</span></a>
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #filters = null;
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template() {
    return createFilterMenuTemplate(this.#films);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
