import FilmBoardView from '../view/film-board-view.js';
import SortListView from '../view/sort-list-view.js';
import FilmContainerView from '../view/film-container-view.js';
import FilmListView from '../view/film-list-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import CommentView from '../view/comment-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {FILM_COUNT, FILM_COUNT_PER_STEP} from '../const.js';
const body = document.querySelector('body');
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


  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (films) => {
    this.#films = [...films];

    render(this.#boardContainer, this.#filmBoardComponent, RenderPosition.BEFOREEND);
    render(this.#filmBoardComponent, this.#filmContainerComponent, RenderPosition.BEFOREEND);
    render(this.#filmContainerComponent, this.#filmListComponent, RenderPosition.BEFOREEND);

    this.#renderFilmBoard();
  }

  #renderSort = () => {
    render(this.#filmBoardComponent, this.#sortListComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);
    const detailedFilmComponent = new DetailedInfoView(film);
    
    const closePopup = () => {
	    siteFooterElement.removeChild(detailedFilmComponent.element);
	    body.classList.remove('hide-overflow');
	  };

	  const showPopup = () => {
	    siteFooterElement.appendChild(detailedFilmComponent.element);
	    body.classList.add('hide-overflow');

	    const commentsContainer = document.querySelector('.film-details__comments-list');

	    if (commentsContainer && film.commentsNumber) {
	      const comments = Array.from({length: film.commentsNumber}, generateComment);
	      for (const comment of comments) {
	        render(commentsContainer, new CommentView(comment), RenderPosition.AFTERBEGIN);
	      }
	    }
	  };

	  const onEscKeyDown = (evt) => {
	    if (evt.key === 'Escape' || evt.key === 'Esc') {
	      evt.preventDefault();
	      closePopup();
	      document.removeEventListener('keydown', onEscKeyDown);
	    }
	  };

	  detailedFilmComponent.setClosePopupClickHandler(() => {
	    closePopup();
	    document.removeEventListener('keydown', onEscKeyDown);
	  });

	  filmComponent.setPopupClickHandler(() => {
	    showPopup();
	    document.addEventListener('keydown', onEscKeyDown);
	  });

	  render(this.#filmListComponent, filmComponent, RenderPosition.BEFOREEND); 
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
