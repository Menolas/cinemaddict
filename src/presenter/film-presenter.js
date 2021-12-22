import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {generateComment} from '../mock/comment.js';
import CommentView from '../view/comment-view.js';
const body = document.querySelector('body');
const siteFooterElement = document.querySelector('.footer');

const Mode = {
  DEFAULT: 'DEFAULT',
  SHOW_POPUP: 'SHOW_POPUP',
};

export default class FilmPresenter {
  #filmBox = null;
  #changeData = null;
  #changeMode = null;
  #filmComponent = null;
  #detailedFilmComponent = null;
  #film = null;
  #mode = Mode.DEFAULT;
  #comments = null;
  #commentsNumber = null;

  constructor(filmBox, changeData, changeMode) {
    this.#filmBox = filmBox;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevDetailedFilmComponent = this.#detailedFilmComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#detailedFilmComponent = new DetailedInfoView(film);
    this.#commentsNumber = this.#film.commentsNumber;
    this.#comments = Array.from({length: this.#commentsNumber}, generateComment);

    this.#detailedFilmComponent.setClosePopupClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmComponent.setPopupClickHandler(() => {
      this.#showPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListClick);
    this.#filmComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#detailedFilmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#detailedFilmComponent.setAddToWatchListClickHandler(this.#handleAddToWatchListClick);
    this.#detailedFilmComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);

    if (prevFilmComponent === null || prevDetailedFilmComponent === null) {
      render(this.#filmBox, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.SHOW_POPUP) {
      replace(this.#detailedFilmComponent, prevDetailedFilmComponent);
    }

    remove(prevFilmComponent);
    remove(prevDetailedFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#detailedFilmComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #closePopup = () => {
    siteFooterElement.removeChild(this.#detailedFilmComponent.element);
    body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  }

  #renderComments = (comments) => {
    const commentsContainer = document.querySelector('.film-details__comments-list');

    if (comments.length) {
      for (const comment of comments) {
        render(commentsContainer, new CommentView(comment), RenderPosition.AFTERBEGIN);
      }
    }
  }

  #showPopup = () => {
    siteFooterElement.appendChild(this.#detailedFilmComponent.element);
    body.classList.add('hide-overflow');
    this.#changeMode();
    this.#mode = Mode.SHOW_POPUP;

    this.#renderComments(this.#comments);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleAddToWatchListClick = () => {
    this.#changeData({...this.#film, isInWatchlist: !this.#film.isInWatchlist});
  }

  #handleMarkAsWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }
}
