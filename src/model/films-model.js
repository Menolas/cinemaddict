import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];
  #commentsModel = null;

  constructor(apiService, commentsModel) {
    super();
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  get films() {
    return this.#films;
  }

  get watchedFilms() {
    return this.#films.filter((film) => film.isWatched);
  }

  getFilmById = (filmId) => {
    const index = this.#films.findIndex((film) => film.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t get unexisting film');
    }

    return this.films[index];
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  reloadComments = (filmId) => {
    const index = this.#films.findIndex((item) => item.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t reload comment unexisting film');
    }

    const film = this.#films[index];

    this.#films[index] = {...film, comments: this.#commentsModel.loadComments(film.id)};
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      id: film.id,
      title: film.film_info.title,
      titleOriginal: film.film_info.alternative_title,
      description: film.film_info.description,
      poster: film.film_info.poster,
      genre: film.film_info.genre,
      runtime: film.film_info.runtime,
      rating: film.film_info.total_rating,
      isInWatchlist: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      isFavourite: film.user_details.favorite,
      watchingDate: film.user_details.watching_date,
      country: film.film_info.release.release_country,
      released: film.film_info.release.date,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      director: film.film_info.director,
      ageRating: film.film_info.age_rating,
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }
}
