import FilmBoardView from '../view/film-board-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmView from '../view/no-film-view.js';
import UserRankView from '../view/user-rank-view.js';
import FilmListExtraView from '../view/film-list-extra-view.js';
import LoadingView from '../view/loading-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import {SortType, FilterType, UpdateType, CommentAction, FILM_COUNT_PER_STEP, FILM_TOP_RATED_COUNT, FILM_MOST_COMMENTED_COUNT, ExtraTitle} from '../const.js';
import {sortFilmByDate, sortFilmByRate, sortFilmByComments} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film-presenter.js';

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
  #topRatedFilmsComponent = null;
  #mostCommentedFilmsComponent = null;
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

    // return {
    //   films: films,
    //   filteredFilms: filteredFilms,
    // };
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

  #topRatedFilms = (films) => films.filter((film) => film.rating > 0).sort(sortFilmByRate).slice(0, FILM_TOP_RATED_COUNT);

  #mostCommentedFilms = (films) => films.filter((film) => film.comments.length > 0).sort(sortFilmByComments).slice(0, FILM_MOST_COMMENTED_COUNT);

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
    switch (actionType) {
      case CommentAction.DELETE:
        this.#filmPresenterPopupOn.setViewState(FilmPresenterViewState.DELETING, update.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
          if (this.#mostCommentedFilmsComponent) {
            remove(this.#mostCommentedFilmsComponent);
            this.#renderTopCommentedSection(this.#filmsModel.films);
          }
 
        } catch (err) {
          this.#filmPresenterPopupOn.setAbortingDeleteComment(update.comment.id);
        }
        break;
      case CommentAction.ADD:
        this.#filmPresenterPopupOn.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);

          if (this.#mostCommentedFilmsComponent) {
            remove(this.#mostCommentedFilmsComponent);
            this.#renderTopCommentedSection(this.#filmsModel.films);
          }

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

  #renderFilm = (film, container) => {
    const filmPresenter = new FilmPresenter(
      container, this.#handleFilmChange, this.#commentsModel, this.#handleCommentChange
    );

    filmPresenter.setCardClick(() => this.#handleCardClick(filmPresenter, film.id));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films, container) => {
    films.forEach((film) => this.#renderFilm(film, container));
  }

  #renderTopCommentedSection = (films) => {

    const mostCommentedFilms = this.#mostCommentedFilms(films);

    if (mostCommentedFilms.length) {
      this.#mostCommentedFilmsComponent = new FilmListExtraView(ExtraTitle.MOST_COMMENTED);
      render(this.#filmBoardComponent, this.#mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
      this.#renderFilms(mostCommentedFilms, this.#mostCommentedFilmsComponent.element.querySelector('.films-list__container'));
    }
  }

  #renderTopRatedSection = (films) => {
    const topRatedFilms = this.#topRatedFilms(films);

    if (topRatedFilms.length) {
      this.#topRatedFilmsComponent = new FilmListExtraView(ExtraTitle.TOP_RATED);
      render(this.#filmBoardComponent, this.#topRatedFilmsComponent, RenderPosition.BEFOREEND);
      this.#renderFilms(topRatedFilms, this.#topRatedFilmsComponent.element.querySelector('.films-list__container'));
    }
  }

  #renderLoading = () => {
    render(this.#filmBoardComponent, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#filmListContainerComponent);
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

    if (this.#topRatedFilmsComponent) {
      remove(this.#topRatedFilmsComponent);
    }

    if (this.#mostCommentedFilmsComponent) {
      remove(this.#mostCommentedFilmsComponent);
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

    this.#renderTopRatedSection(this.films);

    this.#renderTopCommentedSection(this.films);

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

    this.#renderFilms(this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount)), this.#filmListContainerComponent);

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  }
}
