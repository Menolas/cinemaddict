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

  // init = async (film) => {
  //   this.#film = film;
  //   try {
  //     const comments = await this.#apiService.getFilmComments(film.id);
  //     this.#comments = comments.map(this.#adaptCommentDataToClient);

  //   } catch(err) {
  //     this.#comments = [];
  //   }

  //   console.log(this.#comments);

  //   this._notify(UpdateType.COMMENTS, film);
  // }

  loadComments = async (filmId) => {
    let comments;
    try {
      comments = await this.#apiService.getComments(filmId);
      this.#comments.set(filmId, comments.map(this.#adaptCommentDataToClient));
    } catch (err) {
      comments = [];
    }

    this._notify(UpdateType.LOADED_COMMENT, {filmId});
    return comments.map(this.#adaptCommentDataToClient);
  }

  getCommentsByFilmId = (filmId) => this.#comments.get(filmId);

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

  #adaptCommentDataToClient = (comment) => {
    const adaptedComment = {...comment,
      emoji: `${comment.emotion}`,
      text: comment.comment,
      date: comment.date,
      author: comment.author,
    };

    return adaptedComment;
  }
}
