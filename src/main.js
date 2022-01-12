import {FILM_COUNT} from './const.js';
import UserRankView from './view/user-rank-view.js';
import {generateFilmCard} from './mock/film.js';
import {render, RenderPosition} from './utils/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const films = Array.from({length: FILM_COUNT}, generateFilmCard);

const filters = [
  {
    type: 'all',
    name: 'ALL',
    count: 0,
  },
];

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();

siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;
