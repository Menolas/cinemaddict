import AbstractView from './abstract-view.js';

const createNoFilmTemplate = (filterType) => (
  `<h2 class="films-list__title">${filterType}
  </h2>`
);

export default class NoFilmView extends AbstractView {
  #noMovieMessage = null;

  constructor(filterType) {
    super();
    this.#noMovieMessage = filterType;
  }

  get template() {
    return createNoFilmTemplate(this.#noMovieMessage);
  }
}
