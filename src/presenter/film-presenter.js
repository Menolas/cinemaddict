import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
const body = document.querySelector('body');
const siteFooterElement = document.querySelector('.footer');
import {FilterType, CommentAction, UpdateType} from '../const.js';
import {isCtrlEnterEvent, isEscEvent} from '../utils/common';

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

  _callback = {};

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
    this.#filmComponent.setPopupClickHandler(this.#handleCardClick);
    this.#filmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);

    if (prevFilmComponent === null) {
      render(this.#filmBox, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }
    
    replace(this.#filmComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  destroy = () => {
    if(this.#detailedFilmComponent) {
      this.#detailedFilmComponent.saveScroll();
    }

    remove(this.#filmComponent);
  }

  setCardClick = (callback) => {
    this._callback.cardClick =  callback;
  }

  setCardClose = (callback) => {
    this._callback.cardClose =  callback;
  }

  #handleCardClick = () => {
    this._callback.cardClick();
  }

  showPopup = () => {
    const prevDetailedFilmComponent = this.#detailedFilmComponent;
    const filmComments = this.#commentsModel.getCommentsByFilmId(this.#film.id);
    this.#detailedFilmComponent = new DetailedInfoView(this.#film, filmComments);
  
    this.#detailedFilmComponent.setClosePopupClickHandler(this.#handleClosePopup);

    this.#detailedFilmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);
    this.#detailedFilmComponent.setCommentActionHandler(this.#handlerCommentAction);

    render(siteFooterElement, this.#detailedFilmComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');

    if (prevDetailedFilmComponent === null) {
      render(siteFooterElement, this.#detailedFilmComponent, RenderPosition.AFTEREND);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('keydown', this.#ctrEnterDownHandler);
      return;
    }

    replace(this.#detailedFilmComponent, prevDetailedFilmComponent);
    this.#detailedFilmComponent.setScroll(prevDetailedFilmComponent.scrollOptions);

    remove(prevDetailedFilmComponent);
  }

  #handleClosePopup = () => {
    this.closePopup();
    this._callback.cardClose();
  }

  closePopup = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#ctrEnterDownHandler);
    body.classList.remove('hide-overflow');

    if (this.#detailedFilmComponent !== null) {
      remove(this.#detailedFilmComponent);
      this.#detailedFilmComponent = null;
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#detailedFilmComponent.reset(this.#film);
      this.closePopup();
    }
  }

  #handleAddToFilterClick = (filterType) => {

    switch (filterType) {
      case FilterType.FAVOURITES:
        this.#changeData(
          UpdateType.MINOR,
          {...this.#film, isFavourite: !this.#film.isFavourite},
        );
        break;
      case FilterType.WATCHED:
        this.#changeData(
          UpdateType.MINOR,
          {...this.#film, isWatched: !this.#film.isWatched},
        );
        break;
      case FilterType.WATCHLIST:
        this.#changeData(
          UpdateType.MINOR,
          {...this.#film, isInWatchlist: !this.#film.isInWatchlist},
        );
        break;
    }
  }

  #handlerCommentAction = (type, comment) => {
    this.#changeComment(type, UpdateType.MINOR, comment);
  }

  #ctrEnterDownHandler = (evt) => {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault(evt);
      this.#detailedFilmComponent.addCommentHandler();
    }
  }
}
