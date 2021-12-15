import {makeElementLookActive, removeElementActiveLook, updateItem} from '../utils/common.js';
import FilmBoardView from '../view/film-board-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListView from '../view/film-list-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {FILM_COUNT_PER_STEP} from '../const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

export default class FilmListPresenter {
  #boardContainer = null;

  #filmBoardComponent = new FilmBoardView();
  #sortListComponent = new SortListView();
  #filmContainerComponent = new FilmContainerView();
  #filmListComponent = new FilmListView();
  #noFilmComponent = new NoFilmView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #films = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#boardContainer, this.#filmBoardComponent, RenderPosition.BEFOREEND);
    render(this.#filmBoardComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);
    render(this.#filmContainerComponent, this.#filmListComponent, RenderPosition.BEFOREEND);
    this.#sortListComponent.setFilterClickHandler(() => {
      removeElementActiveLook(this.#sortListComponent.element.querySelectorAll('.sort__button'), 'sort__button--active');
      makeElementLookActive(event.target, 'sort__button--active');
    });

    this.#renderFilmBoard();
  }

  #handleFilmCardChange = (updatedFilmCard) => {
    this.#films = updateItem(this.#films, updatedFilmCard);
    this.#filmPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
  }

  #renderSort = () => {
    render(this.#filmBoardComponent, this.#sortListComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmListComponent, this.#handleFilmCardChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  }

  #renderNoFilm = () => {
    render(this.#filmBoardComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;
    
    if (this.#renderedFilmCount >= this.#films.length) {
    	remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
  	render(this.#filmListComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

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
    if (!this.#films.length) {
      this.#renderNoFilm();
      return;
    }

    this.#renderSort();
    this.#renderFilmList();
  }
}
