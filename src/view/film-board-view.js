import AbstractView from './abstract-view.js';

const createFilmBoardTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmBoardView extends AbstractView {

  get template() {
    return createFilmBoardTemplate();
  }
}
