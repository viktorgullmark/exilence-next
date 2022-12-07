import moment from 'moment';

export function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const getMillisecondsFromMoment = (timeValue: moment.Moment | null) => {
  if (!timeValue || !timeValue.isValid()) return 0;
  const hourSeconds = timeValue.hours() * 60 * 60;
  const minuteSeconds = timeValue.minutes() * 60;
  const seconds = timeValue.seconds();

  return (hourSeconds + minuteSeconds + seconds) * 1000;
};

export const placeholderOption = 'None';
