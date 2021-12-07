import AbstractView from './abstract-view.js';
import {filteredData} from '../main.js';

const createSiteMenuTemplate = () => `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
              <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${filteredData.watchList}</span></a>
              <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${filteredData.watchedList}</span></a>
              <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${filteredData.favourites}</span></a>
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;

export default class SiteMenuView extends AbstractView {

  get template() {
    return createSiteMenuTemplate();
  }
}
