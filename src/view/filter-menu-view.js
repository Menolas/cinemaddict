import AbstractView from './abstract-view.js';
import {MenuItem} from '../const';

const activeClass = 'main-navigation__item--active';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${name.toLowerCase()}" 
        class="main-navigation__item ${type === currentFilter ? activeClass : ''}" 
        data-filter-type="${type}">
        ${name} ${name !== 'All movies' ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`
  );
};

const createFilterMenuTemplate = (filterItems, currentFilterType, menuType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
               ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional ${menuType === MenuItem.STATISTIC ?' main-navigation__additional--active' : ''}">Stats</a>
          </nav>`;
};

export default class FilterMenuView extends AbstractView {
  #currentFilter = null;
  #filters = null;
  #menuType = null;


  constructor(filters, currentFilter, menuType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#menuType = menuType;
  }

  get template() {
    return createFilterMenuTemplate(this.#filters, this.#currentFilter, this.#menuType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((item) => {
      item.addEventListener('click', (evt) => {
        this.#filterTypeChangeHandler(evt);
      });
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  #menuStatisticClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATISTIC);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#menuStatisticClickHandler);
  }
}
