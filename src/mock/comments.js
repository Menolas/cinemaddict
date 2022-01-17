import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, generateRandomValue} from '../utils/common.js';

const emojis = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const authors = [
  'Petya Vasechkin',
  'Vasya Pupochkin',
  'Hmyri',
  'Baton',
  'Valet',
  'Gleb Jegloff',
  'Manyka Obligatsiyo',
  'Eleonora Mihaylovna',
];

const commentText = [
  'It’s not an easy watch, but it’s a moving one.',
  'It’s only appropriate that Encanto — fueled by eight original songs by Hamilton creator Lin-Manuel Miranda — turns into that most special thing of all: A triumph in every category: art, songs and heart.',
  'Brutal dubbing, incredible soundtrack, beautiful animation and a lot of combination of feelings ... what Disney did representing Colombia in Encanto was something that nobody can miss.',
  'Loved the film, iam colombian and seen my culture and country been represented this well on a movie it is like a dream come true.',
  'Una película inspirada en Colombia con enseñanzas hermosas y llena de detalles que por fin hablan bien de nuestro pais.',
  'Fantastic! So entertaining and fun! Lady Gaga is AHmazing and deserves an Oscar. The whole cast does a wonderful job!',
  'Absolutely amazing!! Breathtaking . Gaga is an extraordinary actress. This movie makes us feel speechless.',
  'I had no expectations about it and I went out from the cinema with a face of happiness and satisfaction in my face.',
  'Literally the best movie I have ever seen. It is so campy and it i s so much fun. Everybody in the theater were belly laughing. The movie has heart and depth and is an instant cult classic. Highly recommend to watch it in theater!!',
];

const generateDate = () => {
  const commentGap = getRandomInteger(0, 60*60*24*365*10);

  return dayjs().subtract(commentGap, 'second').toDate();
};

export const generateComment = (commentId, filmId) => ({
  id: commentId,
  filmId: filmId,
  text: generateRandomValue(commentText),
  emoji: generateRandomValue(emojis),
  author: generateRandomValue(authors),
  date: generateDate(),
});

export const generateComments = (films) => {
  const comments = [];
  films.forEach((film) => {
    film.comments.forEach((comment) => {
      comments.push(generateComment(comment, film.id));
    });
  });

  return comments;
}
