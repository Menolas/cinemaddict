import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from 'nanoid';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  getCommentsByFilmId = (filmId) => this.comments.filter((comment) => comment.filmId === filmId);

  getCommentsIdsByFilmId = (filmId) => Array.from(this.getCommentsByFilmId(filmId), (comment) => comment.id);

  addComment = (updateType, comment) => {
    const newComment = {id: nanoid(), author: 'User Name', ...comment};
    this.#comments = [
      newComment,
      ...this.#comments,
    ];

    this._notify(updateType, newComment);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);
    const deleteComment = {...this.#comments[index]};

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
    this._notify(updateType, deleteComment);
  }
}
