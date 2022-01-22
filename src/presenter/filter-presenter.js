import FilterView from '../view/filter-menu-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, MenuItem, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;
  #changeMenuType = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FilterType.DEFAULT,
        name: 'All movies',
        count: filter[FilterType.DEFAULT](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.WATCHED,
        name: 'History',
        count: filter[FilterType.WATCHED](films).length,
      },
      {
        type: FilterType.FAVOURITES,
        name: 'Favourites',
        count: filter[FilterType.FAVOURITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;
    //const currentFilter = this.#filterModel.menuType === MenuItem.FILMS ? this.#filterModel.filter : null;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter, this.#filterModel.menuType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    this.#filterComponent.setMenuClickHandler(this.#handleChangeMenu);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
  }

  setMenuClickHandler = (callback) => {
    this.#changeMenuType = callback;
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if(this.#filterModel.menuType === MenuItem.STATISTIC) {
      this.#handleChangeMenu(MenuItem.FILMS);
    }

    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  #handleChangeMenu = (menuType) => {
    if (this.#filterModel.menuType === menuType) {
      return;
    }

    this.#filterModel.filter = FilterType.DEFAULT;
    this.#filterModel.setMenuType(menuType);
    this.#changeMenuType(this.#filterModel.menuType);

    this.init();
  }
}
