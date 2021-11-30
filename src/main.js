import {createUserRankTemplate} from './view/user-rank-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createMovieCardTemplate} from './view/movie-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createDetailedInfoTemplate} from './view/detailed-info-view.js';
import {createCommentTemplate} from './view/comment-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/film.js';


const FILM_COUNT = 20;
const filmCollection = Array.from({length: FILM_COUNT}, generateFilmCard);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteContentElement = document.querySelector('.films');
const allMoviesContainer = siteContentElement.querySelector('.films-list__container');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < 5; i++) {
  renderTemplate(allMoviesContainer, createMovieCardTemplate(filmCollection[i]), RenderPosition.BEFOREEND);
}

renderTemplate(allMoviesContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);
siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;

renderTemplate(siteFooterElement, createDetailedInfoTemplate(filmCollection[0]), RenderPosition.AFTEREND);
const commentsContainer = document.querySelector('.film-details__comments-list');

if (commentsContainer) {
	renderTemplate(commentsContainer, createCommentTemplate(), RenderPosition.AFTERBEGIN);
}
