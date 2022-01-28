import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService = null;
  #film = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  getComments = (filmId) => this.#comments.get(filmId);

  loadComments = async (filmId) => {
    let comments;
    try {
      comments = await this.#apiService.getFilmComments(filmId);
      this.#comments.set(filmId, comments.map(this.#adaptCommentDataToClient));
    } catch (err) {
      comments = [];
    }

    this._notify(UpdateType.COMMENTS, {filmId: filmId});
    return comments.map(this.#adaptCommentDataToClient);
  }

  addComment = async (updateType, update) => {
    const {comment, filmId} = update;

    try {
      const response = await this.#apiService.addComment(comment, filmId);
      const {comments} = response;
      const newComments = comments.map(this.#adaptCommentDataToClient);
      this.#comments.set(filmId, newComments);

      this._notify(updateType, {filmId: filmId});

    } catch (err) {

      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const {comment, filmId} = update;
    const comments = this.getComments(filmId);

    if (!comments) {
      throw new Error('Can\'t delete comments');
    }

    const index = comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(comment);
      const newComments = [
        ...comments.slice(0, index),
        ...comments.slice(index + 1),
      ];
      this.#comments.set(filmId, newComments);
      this._notify(updateType, {filmId: filmId});
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptCommentDataToClient = (comment) => {
    const adaptedComment = {...comment,
      emoji: `${comment.emotion}`,
      text: comment.comment,
      date: comment.date,
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];
    delete adaptedComment['date'];

    return adaptedComment;
  }
}
