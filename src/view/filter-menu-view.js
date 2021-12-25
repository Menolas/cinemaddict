import AbstractView from './abstract-view.js';
import {filmToFilterMap, FilterType} from '../const.js';

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(films),
  }),
);

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item" data-filter-type="${name}">${name} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterMenuTemplate = (filterItems) => {
  const createFilterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="default">All movies</a>
              ${createFilterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #filters = null;
  #filterTypes = null;

  constructor(filters, filterTypes) {
    super();
    this.#filters = filters;
    this.#filterTypes = filterTypes;
  }

  get template() {
    return createFilterMenuTemplate(this.#filters);
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
