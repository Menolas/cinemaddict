import AbstractObservable from '../utils/abstract-observable.js';


export default class CommentsModel extends AbstractObservable {
  #comments = [];
  
  set comments() {
  	this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }
}
