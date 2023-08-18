const destructureClockValue = (
  value: string
): {
  hour: number;
  minute: number;
  defaultPeriod: string;
} => {
  const valueArr = value.split(':');
  const hour = valueArr[0];
  const defaultPeriod = valueArr[1].split(' ')[1];
  const minute = valueArr[1].split(' ')[0];

  return {
    hour: parseInt(hour),
    minute: parseInt(minute),
    defaultPeriod,
  };
};

const regexpCheck = (value: string, format: string | undefined): boolean => {
  const regexp = format === '24h' ? /^([01]\d|2[0-3])(:[0-5]\d)$/ : /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;

  return regexp.test(value);
};

const isDisabled = (
  value: number,
  max: number | undefined,
  min: number | undefined,
  per: string,
  maxPer: string,
  minPer: string
): boolean => {
  let result = false;

  if (max) {
    if (maxPer !== '') {
      if (value > max && per === maxPer) {
        result = true;
      }
    } else {
      if (value > max) {
        result = true;
      }
    }
  }

  if (min) {
    if (minPer !== '') {
      if (value < min && per === minPer) {
        result = true;
      }
    } else {
      if (value < min) {
        result = true;
      }
    }
  }

  return result;
};

const areMinutesDisabled = (
  minHour: number | undefined,
  maxHour: number | undefined,
  activeHour: number,
  value: number,
  max: number | undefined,
  min: number | undefined,
  per: string,
  maxPer: string,
  minPer: string
): boolean => isDisabled(value, max, min, per, maxPer, minPer) && (activeHour === maxHour || activeHour === minHour);

const multiOn = (el: Document | HTMLElement, events: string, callback: (e: any) => void): void => {
  const eventsArray = events.split(' ');

  eventsArray.forEach((item) => {
    el.addEventListener(item, callback);
  });
};

const multiOff = (el: Document | HTMLElement, events: string, callback: (e: any) => void): void => {
  const eventsArray = events.split(' ');

  eventsArray.forEach((item) => {
    el.removeEventListener(item, callback);
  });
};

const euclidean = (p0: { x: number; y: number }, p1: { x: number; y: number }): number => {
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateAngle = (center: { x: number; y: number }, p1: { x: number; y: number }): number => {
  const value = 2 * Math.atan2(p1.y - center.y - euclidean(center, p1), p1.x - center.x);
  return Math.abs((value * 180) / Math.PI);
};

const getCircleGeometry = (circleSize: number): { radius: number } => {
  const width = (circleSize - 32) / 2;
  const radius = width - 4;

  return {
    radius,
  };
};

const getFirstAvailable = (
  value: number,
  max: number | undefined,
  min: number | undefined,
  per: string,
  maxPer: string,
  minPer: string,
  mode: string,
  format: string | undefined
): number => {
  let temp = value;
  let currentPeriod = per;

  if (mode === 'hours' && format === '12h' && temp > 12) {
    currentPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
    temp = 1;
  }

  if (mode === 'hours' && format === '24h' && temp > 24) {
    currentPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
    temp = 1;
  }

  if (mode === 'minutes' && temp > 59) {
    currentPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
    temp = 0;
  }

  if (isDisabled(temp, max, min, currentPeriod, maxPer, minPer)) {
    return getFirstAvailable(temp + 1, max, min, currentPeriod, maxPer, minPer, mode, format);
  }

  return temp;
};

const getCurrentTime = (format: '12h' | '24h'): { hours: number; minutes: number; period: string } => {
  const date = new Date();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  if (format === '24h')
    return {
      hours,
      minutes,
      period: '',
    };

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return {
    hours,
    minutes,
    period,
  };
};

const convertDateToTime = (date: Date, format: string) => {
  const minutes = date.getMinutes();
  let hour = date.getHours();
  let time;
  if (hour === 24) {
    hour = 0;
  }
  const amOrPm = hour >= 12 ? 'PM' : 'AM';
  if (format == '24h') {
    time = hour < 10 ? `0${hour}:${minutes}` : `${hour}:${minutes}`;
  } else if (format == '12h') {
    time = `${(hour + 24) % 12 || 12}:${minutes} ${amOrPm}`;
  }
  return time;
};

export {
  destructureClockValue,
  regexpCheck,
  isDisabled,
  multiOn,
  multiOff,
  euclidean,
  calculateAngle,
  getCircleGeometry,
  getFirstAvailable,
  getCurrentTime,
  areMinutesDisabled,
  convertDateToTime,
};
