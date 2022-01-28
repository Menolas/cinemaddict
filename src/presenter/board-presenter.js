import {sortFilmByDate, sortFilmByRate} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilmBoardView from '../view/film-board-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import UserRankView from '../view/user-rank-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film-presenter.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {SortType, FilterType, UpdateType, CommentAction, FILM_COUNT_PER_STEP} from '../const.js';
import {filter} from '../utils/filter.js';

const siteHeaderElement = document.querySelector('.header');

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmBoardComponent = new FilmBoardView();
  #filmListContainerComponent = new FilmListContainerView();
  #loadingComponent = new LoadingView();
  #filmContainerComponent = null;
  #showMoreButtonComponent = null;
  #sortListComponent = null;
  #filterMenuComponent = null;
  #noFilmComponent = null;
  #userProfileComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.DEFAULT;

  #filmPresenterPopupOn = null;
  #filmPopupOnId = null;
  #isLoading = true;

  constructor(boardContainer, filmsModel, filterModel, commentsModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get films() {
    this.#currentFilterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#currentFilterType](films);

    switch (this.#currentSortType) {

      case SortType.DATE:
        return [...filteredFilms].sort(sortFilmByDate);
      case SortType.RATE:
        return [...filteredFilms].sort(sortFilmByRate);
    }

    return filteredFilms;
  }

  init = () => {
    this.#filmContainerComponent = new FilmContainerView();
    render(this.#boardContainer, this.#filmBoardComponent, RenderPosition.BEFOREEND);
    render(this.#filmBoardComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    remove(this.#filmContainerComponent);
    remove(this.#filmBoardComponent);
    remove(this.#sortListComponent);
    remove(this.#showMoreButtonComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleModelEvent);
  }

  #handleCardClick = (filmPresenter, id) => {
    this.#filmPopupOnId = id;

    if (this.#filmPresenterPopupOn) {
      this.#filmPresenterPopupOn.closePopup();
    }

    filmPresenter.showPopup();
    this.#filmPresenterPopupOn = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPresenterPopupOn = null;
    this.#filmPopupOnId = null;
  }

  #handleFilmChange = (updateType, update) => {
    this.#filmsModel.updateFilm(updateType, update);
  }

  #handleModelEvent = (updateType, data) => {

    switch (updateType) {
      case UpdateType.COMMENTS:
        this.#handleLoadedComment();
        break;
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #handleCommentEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.COMMENTS:
        this.#handleModelEvent(UpdateType.COMMENTS, this.#filmsModel.getFilmById(data.filmId));
        break;
      case UpdateType.MINOR:
        this.#filmsModel.reloadComments(data.filmId);
        this.#handleModelEvent(UpdateType);
        break;
    }
  }

  #handleCommentChange = async (actionType, updateType, update) => {
    console.log(update);
    switch (actionType) {
      case CommentAction.DELETE:
        this.#filmPresenterPopupOn.setViewState(FilmPresenterViewState.DELETING, update.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#filmPresenterPopupOn.setAbortingDeleteComment(update.comment.id);
        }
        break;
      case CommentAction.ADD:
        this.#filmPresenterPopupOn.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch (err) {
          this.#filmPresenterPopupOn.setAbortingNewComment();
        }
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedFilmCount: true});
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortListComponent = new SortListView(this.#currentSortType);
    this.#sortListComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#filmBoardComponent, this.#sortListComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(
      this.#filmListContainerComponent, this.#handleFilmChange, this.#commentsModel, this.#handleCommentChange
    );

    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter, film.id));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderLoading = () => {
    render(this.#filmBoardComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
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
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#filmListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);
  }

  #handleLoadedComment = () => {
    this.#filmPresenterPopupOn.handleLoadedComment();
    const filmOnPopup = this.#filmsModel.getFilmById(this.#filmPopupOnId);
    this.#filmPresenterPopupOn.init(filmOnPopup);
    this.#filmPresenterPopupOn.showPopup();
  }

  #renderUserProfile = () => {
    this.#userProfileComponent = new UserRankView(this.#filmsModel.watchedFilms.length);
    render(siteHeaderElement, this.#userProfileComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#userProfileComponent);
    remove(this.#sortListComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (this.#filmPresenterPopupOn) {
      this.#filmPresenterPopupOn.destroy();
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {

      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

  }

  #renderNoFilm = () => {
    this.#noFilmComponent = new NoFilmView(this.#currentFilterType);
    render(this.#filmContainerComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const filmCount = this.films.length;

    this.#renderUserProfile();

    if (filmCount === 0) {
      this.#renderNoFilm();
      return;
    }

    if (this.#filmPresenterPopupOn && this.#filmPopupOnId) {
      const filmPopup = this.#filmsModel.getFilmById(this.#filmPopupOnId);
      this.#filmPresenterPopupOn.init(filmPopup);
      this.#filmPresenterPopupOn.showPopup();
    }

    this.#renderSort();

    render(this.#filmContainerComponent, this.#filmListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }
}
