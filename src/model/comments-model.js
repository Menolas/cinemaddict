import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from 'nanoid';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService = null;
  #film = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

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

  getCommentsByFilmId = (filmId) => this.#comments.get(filmId);

  getCommentsIdsByFilmId = (filmId) => [...this.getCommentsByFilmId(filmId)].map((comment) => comment.id);

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

  #adaptCommentDataToClient = (comment) => {
    const adaptedComment = {...comment,
      emoji: `${comment.emotion}`,
      text: comment.comment,
      date: comment.date,
      author: comment.author,
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];
    delete adaptedComment['date'];

    return adaptedComment;
  }
}
