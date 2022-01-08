import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
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
  #film = null;
  #mode = Mode.DEFAULT;

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

    this.#detailedFilmComponent.setClosePopupClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmComponent.setPopupClickHandler(() => {
      this.#showPopup();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#filmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);
    this.#detailedFilmComponent.setAddToFilterClickHandler(this.#handleAddToFilterClick);

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
}
