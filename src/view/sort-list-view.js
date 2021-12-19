import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const createSortListTemplate = () => `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.RATE}">Sort by rating</a></li>
          </ul>`;

//Array.from(this.element.querySelectorAll('.sort__button'));

export default class SortListView extends AbstractView {
  #sortTypes = null;

  constructor(sortTypes) {
    super();
    this.#sortTypes = sortTypes;
  }

  get template() {
    return createSortListTemplate(this.#sortTypes);
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.element.querySelectorAll('.sort__button').forEach(item => {
      item.addEventListener('click', this.#filterClickHandler);
    });
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterClick();
  }
}
