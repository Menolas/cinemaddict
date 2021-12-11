import FilmCardView from '../view/film-card-view.js';
import DetailedInfoView from '../view/detailed-info-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {generateComment} from '../mock/comment.js';
import CommentView from '../view/comment-view.js';
const body = document.querySelector('body');
const siteFooterElement = document.querySelector('.footer');

export default class FilmPresenter {
  #filmBox = null;
  #filmComponent = null;
  #detailedFilmComponent =null;
  #film = null;
  #commentsNumber = null;

  constructor(filmBox) {
  	this.#filmBox = filmBox;
  }

  init = (film) => {
  	this.#film = film;
  	this.#filmComponent = new FilmCardView(film);
  	this.#detailedFilmComponent = new DetailedInfoView(film);
  	this.#commentsNumber = this.#film.commentsNumber;


  	this.#filmComponent.setPopupClickHandler(() => {
  		this.#showPopup(this.#commentsNumber);
      document.addEventListener('keydown', this.#onEscKeyDown);
  	});

  	this.#detailedFilmComponent.setClosePopupClickHandler(() => {
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

  	render(this.#filmBox, this.#filmComponent, RenderPosition.BEFOREEND);
  }
    
  #closePopup = () => {
    siteFooterElement.removeChild(this.#detailedFilmComponent.element);
    body.classList.remove('hide-overflow');
  }

  #showPopup = (commentsNumber) => {
    siteFooterElement.appendChild(this.#detailedFilmComponent.element);
    body.classList.add('hide-overflow');

    const commentsContainer = document.querySelector('.film-details__comments-list');

    if (commentsContainer && commentsNumber) {
      const comments = Array.from({length: commentsNumber}, generateComment);
      for (const comment of comments) {
        render(commentsContainer, new CommentView(comment), RenderPosition.AFTERBEGIN);
      }
    }
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
