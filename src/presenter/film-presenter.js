import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import CommentsView from '../view/comments-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
const body = document.querySelector('body');
const siteFooterElement = document.querySelector('.footer');
import {FilterType} from '../const.js';
import {UserAction, UpdateType} from '../const.js';

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
  #commentsModel = null;
  #changeComment = null;
  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmBox, changeData, changeMode, commentsModel, changeComment) {
    this.#filmBox = filmBox;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
    this.#changeComment = changeComment;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmCardView(film);

    this.#filmComponent.setPopupClickHandler(() => {
      this.#showPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);

    if (prevFilmComponent === null || prevDetailedFilmComponent === null) {
      render(this.#filmBox, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.SHOW_POPUP) {
      replace(this.#detailedFilmComponent, prevDetailedFilmComponent);
      replace(this.#filmComponent, prevFilmComponent);
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
      this.#detailedFilmComponent.reset(this.#film);
      this.#closePopup();
    }
  }

  #closePopup = () => {
    siteFooterElement.removeChild(this.#detailedFilmComponent.element);
    body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  }

  #showPopup = () => {
    const prevDetailedFilmComponent = this.#detailedFilmComponent;
    const filmComments = this.#commentsModel.getCommentsByFilmId(this.#film.id);
    this.#detailedFilmComponent = new DetailedInfoView(this.#film, filmComments);
    const commentsContainer = this.#detailedFilmComponent.element.querySelector('.film-details__comments-title');
    const commentsComponent = new CommentsView(filmComments);
    console.log(commentsComponent.element);
    render(commentsContainer, commentsComponent, RenderPosition.AFTEREND);

    this.#detailedFilmComponent.setClosePopupClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#detailedFilmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);

    siteFooterElement.appendChild(this.#detailedFilmComponent.element);
    body.classList.add('hide-overflow');
    this.#changeMode();
    this.#mode = Mode.SHOW_POPUP;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #handleAddToFilterClick = (filterType) => {
    const scrollHeight = this.#detailedFilmComponent.element.scrollTop;

    switch (filterType) {
      case FilterType.FAVOURITES:
        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.MINOR,
          {...this.#film, isFavourite: !this.#film.isFavourite},
        );
        break;
      case FilterType.WATCHED:
        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.MINOR,
          {...this.#film, isWatched: !this.#film.isWatched},
        );
        break;
      case FilterType.WATCHLIST:
        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.MINOR,
          {...this.#film, isInWatchlist: !this.#film.isInWatchlist},
        );
        break;
    }

    this.#detailedFilmComponent.element.scrollTo(0, scrollHeight);
  }

  // #renderComments = () => {
  //   const commentsContainer = this.#detailedFilmComponent.element.querySelector('.film-details__comments-list');

  //   if (this.#comments.length) {
  //     for (const comment of this.#comments) {
  //       const commentComponent = new CommentView(comment);
  //       //commentComponent.setDeleteCommentClickHandler(this.#deleteCommentHandler);
  //       render(commentsContainer, commentComponent, RenderPosition.AFTERBEGIN);
  //     }
  //   }
  // }
}
