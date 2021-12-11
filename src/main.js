import {FILM_COUNT} from './const.js';
import UserRankView from './view/user-rank-view.js';
import SiteMenuView from './view/site-menu-view.js';
import {render, RenderPosition} from './utils/render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
// import FilmBoardView from './view/film-board-view.js';
// import FilmContainerView from './view/film-container-view.js';
// import SortListView from './view/sort-list-view.js';
// import ShowMoreButtonView from './view/show-more-button-view.js';
// import FilmCardView from './view/film-card-view.js';
// import DetailedInfoView from './view/detailed-info-view.js';
// import CommentView from './view/comment-view.js';
// import NoFilmView from './view/no-film-view.js';

import {generateFilmCard} from './mock/film.js';
import {generateComment} from './mock/comment.js';
const body = document.querySelector('body');
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
//console.log(filmListPresenter.boardContainer);

filmListPresenter.init(movies);
