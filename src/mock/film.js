// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomRating = () => {
  const randomNumber = 1 + Math.random() *9;

  return (Math.round(randomNumber * 10) / 10).toFixed(1);
};

const generateWatchingTime = () => {
  const hours = getRandomInteger(1, 2);
  const minutes = getRandomInteger(0, 59);

  return `${hours}h ${minutes}m`;
};

const generateTitle = () => {

  const titles = [
    'The Dance of Life',
    'Holly Molly',
    'Developer in Wonderland',
    'Death on the beach',
    'Dexter on vacation',
    'Timosha the Ripper',
    'Helloween night',
    'Apple sider and Giovanny',
    'Hello bitches',
    'Prison for tailors',
    'Vitamins or dopamines',
    'Sweet mango',
    'My Biography',
    'Moby Dick',
    'The Old Man and the Sea',
    'The Jungle Book',
    'Lion is not a Panther',
    'The Ideal Crime',
    'Butcher in the bushes',
    'First kill is the sweetest one',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generatePoster = () => {

  const posters = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndexForPoster = getRandomInteger(0, posters.length - 1);

  return posters[randomIndexForPoster];
};

const generateDescription = () => {
  const descriptionFish = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptionArray = descriptionFish.split('.');
  const sentanseNumber = getRandomInteger(1, descriptionArray.length);
  const description = descriptionArray.slice(0, sentanseNumber);
  
  return description.join(' ');
};

const generateGenres = () => {

  const genres = [
    'Musical',
    'Cartoon',
    'Drama',
    'Comedy',
    'Western',
    'Mystery',
    'Thriller',
    'Arthouse',
  ];

  const numberOfGenres = getRandomInteger(1, 3);
  let result = [];

  while (result.length != numberOfGenres) {
    let index = getRandomInteger(0, genres.length - 1);    
    result.push(genres[index]);    
    result = result.filter((v, i, arr) =>  arr.indexOf(v) == i);
  }

  return result.join(', ');

};

export const generateFilmCard = () => ({
  title: generateTitle(),
  poster: generatePoster(),
  rating: getRandomRating(),
  relised: getRandomInteger(1950, 2021),
  watchingTime: generateWatchingTime(),
  genres: generateGenres(),
  description: generateDescription(),
  commentsNumber: getRandomInteger(0, 5),
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isInFavourites: Boolean(getRandomInteger(0, 1)),
});

// export const generatePopUP = () => ({
//   title,
//   fullSizePoster,
//   titleOriginal,
//   rating,
//   director,
//   writers,
//   actors,
//   relise,
//   watchingTime,
//   country,
//   genres: {
//     musical: false,
//     cartoon: false,
//     drama: true,
//     comedy: false,
//     western: true,
//     mystery: true,
//     thriller: false,
//   },
//   description,
//   ageRating,
//   commentsNumber,
//   controlblock: {
//     'Add to watchlist': true,
//     'Already watched': false,
//     'Add to favourites': false,    
//   },
// });
