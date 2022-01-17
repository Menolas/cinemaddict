import {humanizeCommentDate} from '../utils/common.js';
import AbstractView from './abstract-view.js';

const createCommentItemTemplate = (comment) => {

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

const createCommentsTemplate = (comments) => {
  let filmComments = [];
  comments.forEach((comment) => filmComments.push(createCommentItemTemplate(comment)));
  filmComments = filmComments.join('');

  return `<ul class="film-details__comments-list">
            ${filmComments}
          </ul>`;
}

export default class CommentsView extends AbstractView {
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createCommentsTemplate(this.#comments);
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
