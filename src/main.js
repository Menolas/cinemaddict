import {FILM_COUNT} from './const.js';
import UserRankView from './view/user-rank-view.js';
import {generateFilmCard} from './mock/film.js';
import {render, RenderPosition} from './utils/render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmsModel from './model/films-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const films = Array.from({length: FILM_COUNT}, generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

filmListPresenter.init();

siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT;
