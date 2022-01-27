import AbstractView from './abstract-view.js';
import {getUserRank} from '../utils/common.js';

const createUserRankTemplate = (watchedFilms) => `<section class="header__profile profile">
            ${watchedFilms > 0 ? `<p class="profile__rating">${getUserRank(watchedFilms)}</p>` : '' }
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;

export default class UserRankView extends AbstractView {
  #watchedFilms = null;

  constructor (watchedFilms) {
    super();
    this.#watchedFilms = watchedFilms;
  }

  get template() {
    return createUserRankTemplate(this.#watchedFilms);
  }
}
