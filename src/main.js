import {createUserRankTemplate} from './view/user-rank-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createMovieCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createDetailedInfoTemplate} from './view/detailed-info-view.js';
import {renderTemplate, RenderPosition} from './render.js';
import {generateFilmCard} from './mock/film.js';
import {createCommentTemplate} from './view/comment-view.js';
import {generateComment} from './mock/comment.js';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const filmCollection = Array.from({length: FILM_COUNT}, generateFilmCard);
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteContentElement = document.querySelector('.films');
const allMoviesContainer = siteContentElement.querySelector('.films-list__container');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);

for (let i = 0; i < FILM_COUNT_PER_STEP; i++) {
  renderTemplate(allMoviesContainer, createMovieCardTemplate(filmCollection[i]), RenderPosition.BEFOREEND);
}

renderTemplate(allMoviesContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);
siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;

//renderTemplate(siteFooterElement, createDetailedInfoTemplate(filmCollection[0]), RenderPosition.AFTEREND);
const commentsContainer = document.querySelector('.film-details__comments-list');

if (commentsContainer && filmCollection[0].commentsNumber > 0) {
  const commentCollection = Array.from({length: filmCollection[0].commentsNumber}, generateComment);
  for (let i = 0; i < commentCollection.length; i++) {
    renderTemplate(commentsContainer, createCommentTemplate(commentCollection[i]), RenderPosition.AFTERBEGIN);
  }
}
