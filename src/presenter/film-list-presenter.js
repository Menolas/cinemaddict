import {makeElementLookActive, removeElementActiveLook, sortFilmByDate, sortFilmByRate} from '../utils/common.js';
//import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilmBoardView from '../view/film-board-view.js';
import FilterMenuView from '../view/filter-menu-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';

import {FILM_COUNT_PER_STEP} from '../const.js';

const siteMainElement = document.querySelector('.main');

export default class FilmListPresenter {
  #boardContainer = null;
  #filmsModel = null;

  #filmBoardComponent = new FilmBoardView();
  #sortListComponent = new SortListView();
  #filmContainerComponent = new FilmContainerView();
  #filmListContainerComponent = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filterMenuComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.DEFAULT;
  #nofilmComponent = new NoFilmView(this.#currentFilterType);

  constructor(boardContainer, filmsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {

    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmByDate);
      case SortType.RATE:
        return [...this.#filmsModel.films].sort(sortFilmByRate);
    }

    switch (this.#currentFilterType) {
      case FilterType.FAVOURITES:
      return [...this.#filmsModel.films].filter((film) => film.isFavourite);
      case FilterType.WATCHED:
      return [...this.#filmsModel.films].filter((film) => film.isWatched);
      case FilterType.WATCHLIST:
      return [...this.#filmsModel.films].filter((film) => film.isInWatchlist);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    render(this.#boardContainer, this.#filmBoardComponent, RenderPosition.BEFOREEND);
    this.#renderFilter();
    render(this.#filmBoardComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);

    if (!this.films.length) {
      render(this.#filmContainerComponent, this.#nofilmComponent, RenderPosition.BEFOREEND);

      return;
    }

    this.#renderFilmBoard();
  }

  #handleModeChange = () => {

    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }
  
  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_FILM:
        this.#filmsModel.addFilm(updateType, update);
        break;
      case UserAction.DELETE_FILM:
        this.#filmsModel.deleteFilm(updateType, update);
        break;
    }
  }

  #handleFilmCardChange = (updatedFilmCard) => {
    // Здесь будем вызывать обновление модели

    this.#filmPresenter.get(updatedFilmCard.id).init(updatedFilmCard);

    remove(this.#filterMenuComponent);
    this.#renderFilter();

    // if (this.#currentFilterType !== FilterType.DEFAULT) {
    //   this.#filterFilms(this.#currentFilterType);
    //   this.#clearFilmList();
    //   this.#renderFilmBoard();
    //   this.#films = [...this.#sourcedFilms];
    // }
  }



//need to rewrite!!!!!!

  // #filterFilms = (filterType) => {

  //   switch (filterType) {
  //     case FilterType.FAVOURITES:
  //       this.films = this.films.filter((film) => film.isFavourite);
  //       break;
  //     case FilterType.WATCHED:
  //       this.films = this.films.filter((film) => film.isWatched);
  //       break;
  //     case FilterType.WATCHLIST:
  //       this.films = this.films.filter((film) => film.isInWatchlist);
  //       break;
  //     case FilterType.DEFAULT:
  //       //this.#films = [...this.#sourcedFilms];
  //       return;
  //   }
  // }

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }

    //this.films = [...this.#sourcedFilms];
    //this.#filterFilms(filterType);
    this.#renderFilms(this.#filmsModel.films);
    removeElementActiveLook(this.#filterMenuComponent.element.querySelectorAll('.main-navigation__item'), 'main-navigation__item--active');
    makeElementLookActive(event.target, 'main-navigation__item--active');
    this.#currentFilterType = filterType;

    this.#clearFilmList();

    if (!this.#filmsModel.films.length) {
      remove(this.#nofilmComponent);
      remove(this.#filmListContainerComponent);
      remove(this.#sortListComponent);
      this.#nofilmComponent = new NoFilmView(this.#currentFilterType);
      render(this.#filmContainerComponent, this.#nofilmComponent, RenderPosition.BEFOREEND);

      return;
    }

    remove(this.#nofilmComponent);
    this.#renderFilmBoard();
    //this.films = [...this.#sourcedFilms];
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    removeElementActiveLook(this.#sortListComponent.element.querySelectorAll('.sort__button'), 'sort__button--active');
    makeElementLookActive(event.target, 'sort__button--active');
    this.#clearFilmList();
    this.#renderFilmList();
  }

  #renderFilter = () => {
    this.#filterMenuComponent = new FilterMenuView(this.films);
    render(siteMainElement, this.#filterMenuComponent, RenderPosition.AFTERBEGIN);
    this.#filterMenuComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }

  #renderSort = () => {
    render(this.#filmBoardComponent, this.#sortListComponent, RenderPosition.BEFOREBEGIN);
    this.#sortListComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListContainerComponent, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
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
    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, FILM_COUNT_PER_STEP));
    
    this.#renderFilms(films);

    if (filmCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmBoard = () => {

    this.#renderSort();

    render(this.#filmContainerComponent, this.#filmListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderFilmList();
  }
}
