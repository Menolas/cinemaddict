import {FILM_COUNT} from './const.js';
import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import {render, RenderPosition} from './utils/render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import {generateFilmCard} from './mock/film.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const movies = Array.from({length: FILM_COUNT}, generateFilmCard);

export const filteredData = {
  watchList: movies.filter((el) => el.isInWatchlist).length,
  watchedList: movies.filter((el) => el.isWatched).length,
  favourites: movies.filter((el) => el.isInFavourites).length,
};

const filmListPresenter = new FilmListPresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
render(siteMainElement, new SiteMenuView(), RenderPosition.AFTERBEGIN);

filmListPresenter.init(movies);

siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;
