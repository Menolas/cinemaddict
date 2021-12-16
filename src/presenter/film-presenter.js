import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {toggleClass} from '../utils/common.js';
import {generateComment} from '../mock/comment.js';
import CommentView from '../view/comment-view.js';
const body = document.querySelector('body');
const siteFooterElement = document.querySelector('.footer');

export default class FilmPresenter {
  #filmBox = null;
  #changeData = null;
  #filmComponent = null;
  #detailedFilmComponent = null;
  #film = null;
  #comments = null;
  #commentsNumber = null;

  constructor(filmBox, changeData) {
  	this.#filmBox = filmBox;
    this.#changeData = changeData;
  }

  init = (film) => {
  	this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevDetailedFilmComponent = this.#detailedFilmComponent;

  	this.#filmComponent = new FilmCardView(film);
  	this.#detailedFilmComponent = new DetailedInfoView(film);
  	this.#commentsNumber = this.#film.commentsNumber;
    this.#comments = Array.from({length: this.#commentsNumber}, generateComment);

  	this.#filmComponent.setPopupClickHandler(() => {
  		this.#showPopup(this.#commentsNumber);
      document.addEventListener('keydown', this.#onEscKeyDown);
  	});

  	this.#detailedFilmComponent.setClosePopupClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });
    
    this.#filmComponent.setControlButtonsClickHandler(this.#controlButtonClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    //this.#filmComponent.setWatchedClickHandler(this.#handleArchiveClick);
    //this.#filmComponent.setAddToWatchListClickHandler(this.#handleArchiveClick);

    if (prevFilmComponent === null || prevDetailedFilmComponent === null) {
      render(this.#filmBox, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#filmBox.element.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#filmBox.element.contains(prevDetailedFilmComponent.element)) {
      replace(this.#detailedFilmComponent, prevDetailedFilmComponent);
    }

    remove(prevFilmComponent);
    remove(prevDetailedFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#detailedFilmComponent);
  }
    
  #closePopup = (evt) => {
    siteFooterElement.removeChild(this.#detailedFilmComponent.element);
    body.classList.remove('hide-overflow');
  }

  #renderComments = (comments) => {
    const commentsContainer = document.querySelector('.film-details__comments-list');

    if (comments.length) {
      for (const comment of comments) {
        render(commentsContainer, new CommentView(comment), RenderPosition.AFTERBEGIN);
      }
    }
  }

  #showPopup = (evt) => {
    siteFooterElement.appendChild(this.#detailedFilmComponent.element);
    body.classList.add('hide-overflow');

    this.#renderComments(this.#comments);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #controlButtonClick = (evt) => {
    toggleClass(event.target, 'film-card__controls-item--active');
  }

  #handleFavoriteClick = (evt) => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }
}
