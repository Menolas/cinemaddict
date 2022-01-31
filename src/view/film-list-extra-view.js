import AbstractView from './abstract-view';

const createFilmsListTemplate = (title) => (
  `<section class="films-list  films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmListExtraView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmsListTemplate(this.#title);
  }
}
