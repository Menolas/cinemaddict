import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';
const activeClass = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name, count} = filter;

  return (
    `<a href="#" class="main-navigation__item ${type === currentFilter ? activeClass : ''}" data-filter-type="${FilterType.DEFAULT}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`
  );
}

const createFilterMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
               ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #currentFilter = null;
  #filters = null;


  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterMenuTemplate(this.#filters, this.#currentFilter);
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
