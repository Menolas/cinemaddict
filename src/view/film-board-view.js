import {createElement} from '../render.js';

const createFilmBoardTemplate = () => `<section class='films'></section>`;

export default class FilmBoardView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmBoardTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
