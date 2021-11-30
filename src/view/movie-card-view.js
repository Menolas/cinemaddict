export const createMovieCardTemplate = (film) => {

  const {
    title,
    poster,
    rating,
    relised,
    watchingTime,
    genres,
    description,
    commentsNumber,
    isInWatchlist,
    isWatched,
    isInFavourites,
  } = film;

  return `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${relised}</span>
        <span class="film-card__duration">${watchingTime}</span>
        <span class="film-card__genre">${genres}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsNumber} comments</span>
    </a>
    <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
