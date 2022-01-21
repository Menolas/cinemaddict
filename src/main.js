import {FILM_COUNT, MenuItem} from './const.js';
import UserRankView from './view/user-rank-view.js';
import {generateFilmCard} from './mock/film.js';
import {generateComments} from './mock/comments.js';
import {render, remove, RenderPosition} from './utils/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import StatisticView from './view/statistic-view';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
let statisticComponent = null;

const films = Array.from({length: FILM_COUNT}, generateFilmCard);
const comments = generateComments(films);

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filmsModel = new FilmsModel(commentsModel);
filmsModel.films = films;

const filterModel = new FilterModel();
console.log(filterModel.menuType);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

const handleSiteMenuClick = (menuItem) => {
  console.log(menuItem);
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticComponent);
      boardPresenter.init();
      break;
    case MenuItem.STATISTIC:
      boardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

filterPresenter.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
boardPresenter.init();

siteFooterElement.querySelector('.footer__statistics span').textContent = FILM_COUNT
console.log(filterModel.menuType);