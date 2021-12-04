import {humanizeCommentDate} from '../utils.js';
import {createElement} from '../render.js';

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

export default class CommentView {
  #element = null;
  #comment = null;

  constructor(comment) {
    this.#comment = comment;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  removeElement() {
    this.#element = null;
  }
}
