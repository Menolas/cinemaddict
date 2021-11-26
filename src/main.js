import {createUserRankTemplate} from './view/user-rank-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
import {createMovieCardTemplate} from './view/movie-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createDetailedInfoTemplate} from './view/detailed-info-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteContentElement = document.querySelector('.films');
const allMoviesContainer = siteContentElement.querySelector('.films-list__container');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createUserRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN);

for (let step = 0; step < 5; step++) {
  renderTemplate(allMoviesContainer, createMovieCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(allMoviesContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

renderTemplate(siteFooterElement, createDetailedInfoTemplate(), RenderPosition.AFTEREND);
