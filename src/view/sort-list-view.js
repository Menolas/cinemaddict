import AbstractView from './abstract-view.js';

const createSortListTemplate = () => `<ul class="sort">
            <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
            <li><a href="#" class="sort__button">Sort by date</a></li>
            <li><a href="#" class="sort__button">Sort by rating</a></li>
          </ul>`;

export default class SortListView extends AbstractView {
  #filters = Array.from(this.element.querySelectorAll('.sort__button'));

  get template() {
    return createSortListTemplate();
  }

  setFilterClickHandler = (callback) => {
    this._callback.filterClick = callback;
    this.#filters.forEach(function (el) {
      el.addEventListener('click', function () {
        el.classList.add('sort__button--active');
      });
    });
  }

  #FilterClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterClick();
  }
}
