import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import {getUserRank} from '../utils/common.js';
import {MINUTES_IN_HOURS, STATISTIC_BAR_HEIGHT, StatisticDiagramColors, StatisticType} from '../const';
import {getStatisticGenres, sortGenreCountDown, getTotalDuration, getFilmsFilteredByStatisticDate} from '../utils/statistic.js';


const renderChart = (statisticCtx, films, statisticType) => {
  const filteredFilms = getFilmsFilteredByStatisticDate(statisticType, films);
  const filmGenresCounted = getStatisticGenres(filteredFilms);
  const sortedFilmGenres = filmGenresCounted.sort(sortGenreCountDown);
  const filmGenres = sortedFilmGenres.map((item) => item.item);
  const filmsByGenreEntity = sortedFilmGenres.map((genre) => genre.count);

  statisticCtx.height = STATISTIC_BAR_HEIGHT * filmGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: filmGenres,
      datasets: [{
        data: filmsByGenreEntity,
        backgroundColor: StatisticDiagramColors.STATISTIC_BAR_COLOR,
        hoverBackgroundColor: StatisticDiagramColors.HOVER_STATISTIC_BAR_COLOR,
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: StatisticDiagramColors.STATISTIC_DIAGRAM_LABELS_COLOR,
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: StatisticDiagramColors.STATISTIC_DIAGRAM_LABELS_COLOR,
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticTemplate = (data) => {
  const {films, statisticType} = data;
  const checkedStatisticType = (type) => type === statisticType ? 'checked="checked"' : '';
  const filteredFilms = getFilmsFilteredByStatisticDate(statisticType, films);
  const watchedFilms = filteredFilms.length;

  let totalDuration = 0;
  let totalDurationHourse = 0;
  let totalDurationMinutes = 0;
  let topGenre = null;

  if (watchedFilms) {
    totalDuration = getTotalDuration(filteredFilms);
    totalDurationHourse =  Math.trunc(totalDuration / MINUTES_IN_HOURS);
    totalDurationMinutes = totalDuration % MINUTES_IN_HOURS;
    const filmGenresWithCount =  getStatisticGenres(filteredFilms);
    const sortedFilmGenres = filmGenresWithCount.sort(sortGenreCountDown);
    topGenre = sortedFilmGenres.length ? sortedFilmGenres[0].item : null;
  }

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getUserRank(films.length)}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" 
          value="${StatisticType.ALL}" ${checkedStatisticType(StatisticType.ALL)}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" 
          value="${StatisticType.TODAY}" ${checkedStatisticType(StatisticType.TODAY)}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" 
          value="${StatisticType.WEEK}" ${checkedStatisticType(StatisticType.WEEK)}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" 
          value="${StatisticType.MONTH}" ${checkedStatisticType(StatisticType.MONTH)}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" 
          value="${StatisticType.YEAR}" ${checkedStatisticType(StatisticType.YEAR)}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilms}<span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationHourse}<span class="statistic__item-description">h</span>${totalDurationMinutes}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre ? topGenre : ''}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticView extends SmartView {
  #chart = null;
  #statisticType = StatisticType.ALL;

  constructor(films) {
    super();

    this._data = {
      films,
      statisticType: this.#statisticType
    };

    this.#setCharts();
    this.#setTimeChange();
  }

  get template() {
    return createStatisticTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setCharts();
    this.#setTimeChange();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#setTimeChange();
    }
  }

  #setTimeChange = () => {
    this.element.querySelectorAll('.statistic__filters-input').forEach((input) => {
      input.addEventListener('click', this.#actionTimeChange);
    });
  }

  #actionTimeChange = (evt) => {
    evt.preventDefault();
    const statisticType = evt.target.value;

    if (statisticType === this.#statisticType) {
      return;
    }

    this.#statisticType = statisticType;
    this.updateData({statisticType: this.#statisticType});
  }

  #setCharts = () => {
    const {films, statisticType} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(statisticCtx, films, statisticType);
  }
}
