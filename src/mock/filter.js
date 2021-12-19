const filmToFilterMap = {
	favourites: (films) => films.filter((film) => film.isFavorite).length,
	history: (films) => films.filter((film) => film.isWatched).length,
	watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
}

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
	([filterName, countFilms]) => ({
		name: filterName,
		count: countFilms(films),
	}),
);
