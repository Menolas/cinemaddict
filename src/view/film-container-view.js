import AbstractView from './abstract-view.js';

const createFilmContainerTemplate = () => `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>`;

export default class FilmContainerView extends AbstractView {

  get template() {
    return createFilmContainerTemplate();
  }
}
