import AbstractObservable from '../utils/abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #films = [];
  #commentsModel = null;

  constructor(commentsModel) {
    super();
    this.#commentsModel = commentsModel;
  }

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  getFilmById = (filmId) => {
    const index = this.#films.findIndex((film) => film.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t get unexisting film');
    }

    return this.films[index];
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  reloadComments = (filmId) => {
    const index = this.#films.findIndex((item) => item.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t reload comment unexisting film');
    }

    const film = this.#films[index];

    this.#films[index] = {...film, comments: this.#commentsModel.getCommentsIdsByFilmId(film.id)};
  }
}
