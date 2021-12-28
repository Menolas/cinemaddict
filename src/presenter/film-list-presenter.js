import {makeElementLookActive, removeElementActiveLook, updateItem, sortFilmByDate, sortFilmByRate} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilmBoardView from '../view/film-board-view.js';
import FilterMenuView from '../view/filter-menu-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {SortType, FilterType} from '../const.js';

import {FILM_COUNT_PER_STEP} from '../const.js';

const siteMainElement = document.querySelector('.main');

export default class FilmListPresenter {
  #boardContainer = null;

  #filmBoardComponent = new FilmBoardView();
  #sortListComponent = new SortListView();
  #filmContainerComponent = new FilmContainerView();
  #filmListContainerComponent = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filterMenuComponent = null;

  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #sourcedFilms = [];
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.DEFAULT;

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (films) => {
    this.#films = [...films];
    this.#sourcedFilms = [...films];

    render(this.#boardContainer, this.#filmBoardComponent, RenderPosition.BEFOREEND);
    this.#renderFilter();

    this.#renderFilmBoard();
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleFilmCardChange = (updatedFilmCard) => {
    this.#films = updateItem(this.#films, updatedFilmCard);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilmCard);
    this.#filmPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
    remove(this.#filterMenuComponent);
    this.#filterMenuComponent = new FilterMenuView(this.#films);
    render(siteMainElement, this.#filterMenuComponent, RenderPosition.AFTERBEGIN);
    this.#filterMenuComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  #filterFilms = (filterType) => {

    switch (filterType) {
      case FilterType.FAVOURITES:
        this.#films = this.#films.filter((film) => film.isFavourite);
        break;
      case FilterType.WATCHED:
        this.#films = this.#films.filter((film) => film.isWatched);
        break;
      case FilterType.WATCHLIST:
        this.#films = this.#films.filter((film) => film.isInWatchlist);
        break;
      default:
      this.#films = [...this.#sourcedFilms];
    }

    this.#currentFilterType = filterType;
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    this.#filterFilms(filterType);
    removeElementActiveLook(this.#filterMenuComponent.element.querySelectorAll('.main-navigation__item'), 'main-navigation__item--active');
    makeElementLookActive(event.target, 'main-navigation__item--active');


    this.#clearFilmList();
    this.#renderFilmBoard();
    this.#films = [...this.#sourcedFilms];
  }

  #sortFilms = (sortType) => {

    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmByDate);
        break;
      case SortType.RATE:
        this.#films.sort(sortFilmByRate);
        break;
      default:

        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    removeElementActiveLook(this.#sortListComponent.element.querySelectorAll('.sort__button'), 'sort__button--active');
    makeElementLookActive(event.target, 'sort__button--active');
    this.#clearFilmList();
    this.#renderFilmList();
  }

  #renderFilter = () => {
    this.#filterMenuComponent = new FilterMenuView(this.#films);
    render(siteMainElement, this.#filterMenuComponent, RenderPosition.AFTERBEGIN);
    this.#filterMenuComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  #renderSort = () => {
    render(this.#filmBoardComponent, this.#sortListComponent, RenderPosition.BEFOREBEGIN);
    this.#sortListComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListContainerComponent, this.#handleFilmCardChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#films.length, FILM_COUNT_PER_STEP));

    if (this.#films.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmBoard = () => { 

    render(this.#filmBoardComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);

    if (!this.#films.length) {
      remove(this.#filmListContainerComponent);
      const nofilmComponent = new NoFilmView(this.#currentFilterType);
      
      render(this.#filmContainerComponent, nofilmComponent, RenderPosition.BEFOREEND);
      return;
    }

    this.#renderSort();
    
    render(this.#filmContainerComponent, this.#filmListContainerComponent, RenderPosition.BEFOREEND);
    
    this.#renderFilmList();
  }
}
