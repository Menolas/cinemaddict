import AbstractView from './abstract-view.js';
import {NoFilmInfo} from '../const.js';

const createNoFilmTemplate = (filterType) => (
  `<h2 class="films-list__title">${NoFilmInfo[filterType]}
  </h2>`
);

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
};
