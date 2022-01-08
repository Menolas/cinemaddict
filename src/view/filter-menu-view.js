import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';
const activeClass = 'main-navigation__item--active';

const createFilterMenuTemplate = (films, currentFilterType) => {

  const favourites = films.filter((film) => film.isFavourite).length;
  const history = films.filter((film) => film.isWatched).length;
  const watchlist = films.filter((film) => film.isInWatchlist).length;

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
               <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.DEFAULT ? activeClass : ''}" data-filter-type="${FilterType.DEFAULT}">All movies</a>
               <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? activeClass : ''}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
               <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.WATCHED ? activeClass : ''}" data-filter-type="${FilterType.WATCHED}">History <span class="main-navigation__item-count">${history}</span></a>
               <a href="#favourites" class="main-navigation__item ${currentFilterType === FilterType.FAVOURITES ? activeClass : ''}" data-filter-type="${FilterType.FAVOURITES}">Favourites <span class="main-navigation__item-count">${favourites}</span></a>
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #currentFilterType = null;
  #films = null;

  constructor(films, currentFilterType) {
    super();
    this.#films = films;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterMenuTemplate(this.#films, this.#currentFilterType);
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
