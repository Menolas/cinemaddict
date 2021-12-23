import AbstractView from './abstract-view.js';
import {SortType} from '../const.js';

const createSortListTemplate = () => `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
            <li><a href="#" class="sort__button" data-sort-type="${SortType.RATE}">Sort by rating</a></li>
          </ul>`;

export default class SortListView extends AbstractView {
  #sortTypes = null;

  constructor(sortTypes) {
    super();
    this.#sortTypes = sortTypes;
  }

  get template() {
    return createSortListTemplate(this.#sortTypes);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
