import {humanizeFilmReleaseDetailedDate} from '../utils/common.js';
import SmartView from './smart-view.js';
import {render, RenderPosition} from '../utils/render.js';
import {FilterType} from '../const';

const createEmojiImgTemplate = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="70" height="70" alt="emoji-${emoji}">` : '';

const createDetailedInfoTemplate = (film) => {

  const {
    title,
    titleOriginal,
    poster,
    rating,
    released,
    watchingTime,
    genres,
    description,
    comments,
    isInWatchlist,
    isWatched,
    isFavourite,
    director,
    writers,
    actors,
    country,
    ageRating,
    newCommentEmoji,
    newCommentText,
  } = film;

  const detailedReleaseDate = humanizeFilmReleaseDetailedDate(released);
  const activeClass = 'film-details__control-button--active';
  const favouriteClassName = isFavourite ? activeClass : '';
  const watchedClassName = isWatched ? activeClass : '';
  const watchListClassName = isInWatchlist ? activeClass : '';
  const newEmojiImg = createEmojiImgTemplate(newCommentEmoji);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${detailedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${watchingTime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${genres}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button ${watchListClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist" data-filter-type="${FilterType.WATCHLIST}">Add to watchlist</button>
          <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched" data-filter-type="${FilterType.WATCHED}">Already watched</button>
          <button type="button" class="film-details__control-button ${favouriteClassName} film-details__control-button--favorite" id="favorite" name="favorite" data-filter-type="${FilterType.FAVOURITES}">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${newEmojiImg}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class DetailedInfoView extends SmartView {

  constructor(film) {
    super();
    this._data = DetailedInfoView.parseFilmToData(film);
    this.#setInnerHandlers();
  }

  get template() {
    return createDetailedInfoTemplate(this._data);
  }

  setClosePopupClickHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseHandler);
  }

  setAddToFilterClickHandler = (callback) => {
    this._callback.addToFilter = callback;
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#cardControlBlockClickHandler);
  }

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  }

  #cardControlBlockClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this._callback.addToFilter(evt.target.dataset.filterType);
  }

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    const scrollHeight = this.element.scrollTop;
    this.updateData({newCommentEmoji: evt.target.value,});
    this.element.scrollTo(0, scrollHeight);
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      newCommentText: evt.target.value,
    }, true);
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  restoreHandlers = () => {
    this.setClosePopupClickHandler(this._callback.closePopup);
    this.setAddToFilterClickHandler(this._callback.addToFilter);
    this.#setInnerHandlers();
  }

  static parseFilmToData = (film) => ({...film,
    newCommentText: '',
    newCommentEmoji: null,
  });

  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.newCommentText;
    delete film.newCommentEmoji;

    return film;
  }

  reset = (film) => {
    this.updateData(
      DetailedInfoView.parseFilmToData(film),
    );
  }
}
