import BoardView from '../view/film-board-view.js';
import SortView from '../view/sort-list-view.js';
import TaskListView from '../view/film-container-view.js';
import NoTaskView from '../view/no-film-view.js';
import TaskView from '../view/film-card-view.js';
import TaskEditView from '../view/task-edit-view.js';
import LoadMoreButtonView from '../view/show-more-button-view.js';
import {render, RenderPosition} from '../utils/render.js';

export default class FilmBoardPresenter {
  #boardContainer = null;

  #filmBoardComponent = new FilmBoardView();
  #sortListComponent = new SortListView();
  #filmContainerComponent = new FilmContainerView();
  #noFilmComponent = new NoFilmView();

  #boardFilms = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardFilms) => {
    this.#boardFilms = [...boardFilms];
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
  }

  #renderSort = () => {
    // Метод для рендеринга сортировки
  }

  #renderFilm = () => {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
  }

  #renderFilms = () => {
    // Метод для рендеринга N-задач за раз
  }

  #renderNoFilm = () => {
    // Метод для рендеринга заглушки
  }

  #renderLoadMoreButton = () => {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
  }

  #renderBoard = () => {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
  }
}
