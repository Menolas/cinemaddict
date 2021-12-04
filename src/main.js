import {FILM_COUNT, FILM_COUNT_PER_STEP} from './const.js';
import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import FilmBoardView from './view/film-board-view.js';
import FilmContainerView from './view/film-container-view.js';
import FilterView from './view/filter-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FilmCardView from './view/film-card-view.js';
import DetailedInfoView from './view/detailed-info-view.js';
import CommentView from './view/comment-view.js';
import NoFilmView from './view/no-film-view.js';
import {render, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/film.js';
import {generateComment} from './mock/comment.js';
const body = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const filmBoardViewComponent = new FilmBoardView();
const filmContainerViewComponent = new FilmContainerView();

const films = Array.from({length: FILM_COUNT}, generateFilmCard);
export const filteredData = {
    watchList: films.filter((el) => el.isInWatchlist).length,
    watchedList: films.filter((el) => el.isWatched).length,
    favourites: films.filter((el) => el.isInFavourites).length,
};

render(siteHeaderElement, new UserRankView().element, RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView().element, RenderPosition.AFTERBEGIN);
render(siteMainElement, filmBoardViewComponent.element, RenderPosition.BEFOREEND);
console.log(films);

if (films.length === 0) {
  render(filmBoardViewComponent.element, new NoFilmView().element, RenderPosition.BEFOREEND);
} else {
  const renderFilm = (filmListElement, film) => {
    const filmComponent = new FilmCardView(film);
    const detailedFilmComponent = new DetailedInfoView(film);
    const closePopup = () => {
      siteFooterElement.removeChild(detailedFilmComponent.element);
      body.classList.remove('hide-overflow');
    };
    const showPopup = () => {
      siteFooterElement.appendChild(detailedFilmComponent.element);
      body.classList.add('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    detailedFilmComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      showPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
  };

  render(filmBoardViewComponent.element, filmContainerViewComponent.element, RenderPosition.BEFOREEND);
  render(filmBoardViewComponent.element, new FilterView().element, RenderPosition.BEFOREBEGIN);
  const allMoviesContainer = filmBoardViewComponent.element.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(FILM_COUNT, FILM_COUNT_PER_STEP); i++) {
    renderFilm(allMoviesContainer, films[i]);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;
    render(allMoviesContainer, new ShowMoreButtonView().element, RenderPosition.AFTEREND);
    const showMoreButton = filmBoardViewComponent.element.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();

      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(allMoviesContainer, film));
      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }

  const commentsContainer = document.querySelector('.film-details__comments-list');

  if (commentsContainer && films[0].commentsNumber) {
    const comments = Array.from({length: films[0].commentsNumber}, generateComment);
    for (let i = 0; i < comments.length; i++) {
      render(commentsContainer, new CommentView(comments[i]).element, RenderPosition.AFTERBEGIN);
    }
  }
}

siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;
