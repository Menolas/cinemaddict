const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getFilmComments = (filmId) => this.#load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  addComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.filmId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    //console.log(response);
    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  #adaptToServer = (film) => {
    const filmInfo = {
      'title': film.title,
      'age_rating': film.ageRating,
      'alternative_title': film.titleOriginal,
      'description': film.description,
      'poster': film.poster,
      'genre': film.genre,
      'runtime': film.runtime,
      'total_rating': film.rating,
      'director': film.director,
      'actors': film.actors,
      'writers': film.writers,
      'release': {
        'date': film.released,
        'release_country': film.country,
      },
    };
    const userDetails = {
      'watchlist': film.isInWatchlist,
      'already_watched': film.isWatched,
      'favorite': film.isFavourite,
      'watching_date': film.watchingDate,
    };
    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    return adaptedFilm;
  }

  #adaptCommentToServer = (comment) => {

    const adaptedComment = {
      ...comment,
      comment: comment.text,
      emotion: comment.emoji,
    };

    delete adaptedComment.text;
    delete adaptedComment.emoji;
    //console.log(adaptedComment);

    return adaptedComment;
  };
}
