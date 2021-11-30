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
  const allTitles = {
    'The Dance of Life': 'The Old Man and the Sea',
    'Holly Molly': 'Apple sider and Giovanny',
    'Developer in Wonderland': 'Moby Dick',
    'Death on the beach': 'My Biography',
    'Dexter on vacation': 'Sweet mango',
    'Timosha the Ripper': 'The Ideal Crime',
    'Helloween night': 'Vitamins or dopamines',
    'Apple sider and Giovanny': 'Butcher in the bushes',
    'Hello bitches': 'Developer in Wonderland',
    'Prison for tailors': 'The Dance of Life',
    'Vitamins or dopamines': 'First kill is the sweetest one',
    'Sweet mango': 'Timosha the Ripper',
    'My Biography': 'Moby Dick',
    'Moby Dick': 'Helloween night',
    'The Old Man and the Sea': 'Lion is not a Panther',
    'The Jungle Book': 'Prison for tailors',
    'Lion is not a Panther': 'Holly Molly',
    'The Ideal Crime': 'Apple sider and Giovanny',
    'Butcher in the bushes': 'Vitamins or dopamines',
    'First kill is the sweetest one': 'Death on the beach',
  };

  const keys = Object.keys(allTitles);
  const randomIndex = getRandomInteger(0, keys.length - 1);
  const title = [];
  title.push(keys[randomIndex]);
  title.push(allTitles[keys[randomIndex]]);

  return title;
};

const generateDescription = () => {
  const descriptionFish = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
  const descriptionArray = descriptionFish.split('.');
  const sentanseNumber = getRandomInteger(1, descriptionArray.length);
  const description = descriptionArray.slice(0, sentanseNumber);
  
  return description.join(' ');
};

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

const writers = [
  'Marcel Proust',
  'James Joyce',
  'Miguel de Cervantes',
  'Gabriel Garcia Marquez',
  'F. Scott Fitzgerald',
  'Herman Melville',
  'William Shakespeare',
  'Homer',
  'Gustave Flaubert',
  'Dante Alighieri',
  'Vladimir Nabokov',
  'Emily Brontë',
  'J. D. Salinger',
];

const actors = [
  'Marlon Brando',
  'Robert De Niro',
  'Meryl Streep',
  'Dustin Lee Hoffman',
  'Thomas Jeffrey Hanks',
  'Jodie Foster',
  'Anthony Hopkins',
  'Michael Caine',
  'Elizabeth Rosemond Taylor',
  'Charlie Chaplin',
  'Ben Kingsley',
  'Susan Sarandon',
  'Scarlett Ingrid Johansson',
];

const generateFewNonRepeatableValues = (a, b, array) => {
  const numberOfValues = getRandomInteger(a, b);
  let result = [];

  while (result.length != numberOfValues) {
    let index = getRandomInteger(0, array.length - 1);
    result.push(array[index]);    
    result = result.filter((v, i, arr) =>  arr.indexOf(v) == i);
  }

  return result.join(', ');
};

const posters = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
  'allien-2.jpg',
  'allien.jpg',
  'elm-strit.jpg',
  'mahakali.jpg',
  'matrix.jpg',
  'mission.jpg',
  'mummy.jpg',
  'nice-guy.jpg',
  'park.jpg',
  'sister.jpg',
  'x-men.jpg',
  'deadly.jpg',
  'rushmore.jpg',
];

const countries = [
  'USA',
  'USSR',
  'Narnia',
  'Wonderland',
  'Far Far Away',
  'Afganistan',
];

const directors = [
  'Roman Polansky',
  'Tarantinych',
  'Sandul V.V.',
  'A. Tarkovskii',
  'Linata Retvinova',
  'Volodymyr Zagoruyko',
  'Giovanny Limonchello',
];

const ageRatings = ['18+', '13+', '91+', '387+',];

const generateRandomValue = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

export const generateFilmCard = () => ({
  _filmTitle: generateTitle(),
  get title() {
    return this._filmTitle[0];
  },
  get titleOriginal() {
    return this._filmTitle[1];
  },
  poster: generateRandomValue(posters),
  rating: getRandomRating(),
  relised: getRandomInteger(1950, 2021),
  watchingTime: generateWatchingTime(),
  genres: generateFewNonRepeatableValues(1, 3, genres),
  description: generateDescription(),
  commentsNumber: getRandomInteger(0, 5),
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isInFavourites: Boolean(getRandomInteger(0, 1)),
  director: generateRandomValue(directors),
  writers: generateFewNonRepeatableValues(1, 3, writers),
  actors: generateFewNonRepeatableValues(3, 6, actors),
  country: generateRandomValue(countries),
  ageRating: generateRandomValue(ageRatings),
});
