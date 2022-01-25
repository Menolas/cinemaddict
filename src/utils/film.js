import {MINUTES_IN_HOURS} from '../const.js';

export const getRuntime = (runtime) => {
  const filmRuntime = {
    hours: 0,
    minutes: 0,
  };

  filmRuntime.hours = runtime / MINUTES_IN_HOURS | 0;
  filmRuntime.minutes = runtime % MINUTES_IN_HOURS;

  return filmRuntime;
};
