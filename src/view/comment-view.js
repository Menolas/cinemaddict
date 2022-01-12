import {humanizeCommentDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';

const createCommentTemplate = (comment) => {

  const {
    text,
    emoji,
    author,
    date,
  } = comment;

  const commentDate = humanizeCommentDate(date);

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  setDeleteCommentClickHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteCommentClickHandler);
  }

  #deleteCommentClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteComment();
  }
}
