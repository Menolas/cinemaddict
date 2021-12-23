import AbstractView from './abstract-view.js';

const createFilmListTemplate = () => (
  `<div class="films-list__container">
  </div>`
);

export default class FilmListView extends AbstractView {

  get template() {
    return createFilmListTemplate();
  }
}
