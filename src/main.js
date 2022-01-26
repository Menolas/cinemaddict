import {MenuItem} from './const.js';
import UserRankView from './view/user-rank-view.js';
import {render, remove, RenderPosition} from './utils/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import CommentsModel from './model/comments-model.js';
import StatisticView from './view/statistic-view';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic gjpyrthjDHjUJOIF';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const apiService = new ApiService(END_POINT, AUTHORIZATION);

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const commentsModel = new CommentsModel(apiService);
const filmsModel = new FilmsModel(apiService, commentsModel);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const boardPresenter = new BoardPresenter(siteMainElement, filmsModel, filterModel, commentsModel);

let statisticComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticComponent);
      boardPresenter.init();
      break;
    case MenuItem.STATISTIC:
      boardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.watchedFilms);
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
      break;
  }
};

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

boardPresenter.init();
filmsModel.init().finally(() => {
  filterPresenter.init();
  filterPresenter.setMenuClickHandler(handleSiteMenuClick);
  siteFooterElement.querySelector('.footer__statistics span').textContent = filmsModel.films.length;
});
