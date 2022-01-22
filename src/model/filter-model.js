import AbstractObservable from '../utils/abstract-observable.js';
import {FilterType, MenuItem} from '../const.js';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.DEFAULT;
  #menuType = MenuItem.FILMS;

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  get menuType() {
    return this.#menuType;
  }

  setMenuType = (menuType) => {
    this.#menuType = menuType;
  }
}
