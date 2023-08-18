export function getDate(date: Date): number {
  return date.getDate();
}

export function getDayNumber(date: Date): number {
  return date.getDay();
}

export function getMonth(date: Date): number {
  return date.getMonth();
}

export function getYear(date: Date) {
  return date.getFullYear();
}

export function getFirstDayOfWeek(year: number, month: number, startDay: number): number {
  const firstDayIndex = startDay;
  const sundayIndex = firstDayIndex > 0 ? 7 - firstDayIndex : 0;
  const date = new Date(year, month);
  const index = date.getDay() + sundayIndex;
  const newIndex = index >= 7 ? index - 7 : index;
  return newIndex;
}

export function isLastDayOfMonth(date: Date): boolean {
  return date.getDate() === getDaysInMonth(date);
}

export function getDateWithLast(date: Date): number {
  if (isLastDayOfMonth(date)) {
    const newDate = getDaysInMonth(new Date(getYear(date), getMonth(date) + 1, 1));

    return newDate;
  } else {
    return getDate(date);
  }
}

export function getDaysInMonth(date: Date): number {
  return getMonthEnd(date).getDate();
}

export function getMonthEnd(date: Date): Date {
  return createDate(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getToday(): Date {
  return new Date();
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12);
}

export function addMonths(date: Date, months: number): Date {
  const month = createDate(date.getFullYear(), date.getMonth() + months, date.getDate());
  const dayOfPreviousMonth = getDate(date);
  const dayOfNewMonth = getDate(month);

  // Solution for edge cases, like moving from a month with a greater number
  // of days than the destination month. For example, when we move from 31 Mar 2020 to
  // February, createDate(2020, 2, 31) will return 2 Mar 2020, not the desired 29 Feb 2020.
  // We need to use setDate(0) to move back to the last day of the previous month (29 Feb 2020)
  if (dayOfPreviousMonth !== dayOfNewMonth) {
    month.setDate(0);
  }

  return month;
}

export function addDays(date: Date, days: number): Date {
  return createDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function createDate(year: number, month: number, day: number): Date {
  const result = new Date(year, month, day);

  // In js native date years from 0 to 99 are treated as abbreviation
  // for dates like 19xx
  if (year >= 0 && year < 100) {
    result.setFullYear(result.getFullYear() - 1900);
  }
  return result;
}

export function convertStringToDate(dateString: string): Date {
  const dateArr = dateString.split('-');
  const year = parseInt(dateArr[0]);
  const month = parseInt(dateArr[1]);
  const day = parseInt(dateArr[2]);

  return createDate(year, month, day);
}

export function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function compareDates(date1: Date, date2: Date): number {
  return getYear(date1) - getYear(date2) || getMonth(date1) - getMonth(date2) || getDate(date1) - getDate(date2);
}

export function isSameDate(date1: Date, date2: Date): boolean {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  return date1.getTime() === date2.getTime();
}

export function addLeadingZero(value: string): string {
  return parseInt(value, 10) < 10 ? `0${value}` : value;
}

export function getYearsOffset(date: Date, yearsInView: number): number {
  const activeYear = getYear(date);
  const yearsDifference = activeYear - getStartYear(0, null, null);
  return modulo(yearsDifference, yearsInView);
}

function modulo(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function getStartYear(yearsInView: number, minDate: any, maxDate: any): number {
  let startYear = 0;

  if (maxDate) {
    const maxYear = getYear(maxDate);
    startYear = maxYear - yearsInView + 1;
  } else if (minDate) {
    startYear = getYear(minDate);
  }

  return startYear;
}

export function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date, filter?: (date: Date) => boolean): boolean {
  const isBeforeMin = minDate && compareDates(date, minDate) <= 0;
  const isAfterMax = maxDate && compareDates(date, maxDate) >= 0;

  const isDisabled = filter && filter(date) === false;

  return Boolean(isBeforeMin || isAfterMax || isDisabled);
}

export function isMonthDisabled(month: number, year: number, minDate?: Date, maxDate?: Date): boolean | number {
  const maxYear = maxDate && getYear(maxDate);
  const maxMonth = maxDate && getMonth(maxDate);
  const minYear = minDate && getYear(minDate);
  const minMonth = minDate && getMonth(minDate);

  const isMonthAndYearAfterMax = maxMonth && maxYear ? year > maxYear || (year === maxYear && month > maxMonth) : false;

  const isMonthAndYearBeforeMin =
    minMonth && minYear ? year < minYear || (year === minYear && month < minMonth) : false;

  return isMonthAndYearAfterMax || isMonthAndYearBeforeMin;
}

export function isYearDisabled(year: number, minDate?: Date, maxDate?: Date): boolean | number {
  const min = minDate && getYear(minDate);
  const max = maxDate && getYear(maxDate);

  const isAfterMax = max ? year > max : false;
  const isBeforeMin = min ? year < min : false;

  return isAfterMax || isBeforeMin;
}

export function getDelimeters(format: string): RegExpMatchArray | null {
  return format.match(/[^(dmy)]{1,}/g);
}

export function getMonthNumberByMonthName(monthValue: string, monthLabels: Array<string>): number {
  return monthLabels.findIndex((monthLabel) => monthLabel === monthValue);
}

export function isNextDateDisabled(
  date: Date,
  view: string,
  yearsInView: number,
  minDate?: Date,
  maxDate?: Date
): boolean {
  return maxDate ? areDatesInSameView(date, maxDate, view, yearsInView, minDate, maxDate) : false;
}

export function isPreviousDateDisabled(
  date: Date,
  view: string,
  yearsInView: number,
  minDate?: Date,
  maxDate?: Date
): boolean {
  return minDate ? areDatesInSameView(date, minDate, view, yearsInView, minDate, maxDate) : false;
}

export function areDatesInSameView(
  date1: Date,
  date2: Date,
  view: string,
  yearsInView: number,
  minDate?: Date,
  maxDate?: Date
): boolean {
  if (view === 'days') {
    return getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2);
  }

  if (view === 'months') {
    return getYear(date1) === getYear(date2);
  }

  if (view === 'years') {
    const startYear = getStartYear(yearsInView, minDate, maxDate);

    return (
      Math.floor((getYear(date1) - startYear) / yearsInView) === Math.floor((getYear(date2) - startYear) / yearsInView)
    );
  }

  return false;
}

export function parseDate(
  dateString: string,
  format: string | undefined,
  monthsFull: Array<string>,
  monthsShort: Array<string>
): Date | undefined {
  let delimeterPattern;
  if (format) {
    const delimeters = getDelimeters(format);

    if (delimeters) {
      if (delimeters[0] !== delimeters[1]) {
        delimeterPattern = delimeters[0] + delimeters[1];
      } else {
        delimeterPattern = delimeters[0];
      }

      const regExp = new RegExp(`[${delimeterPattern}]`);
      const dateParts = dateString.split(regExp);
      const formatParts = format?.split(regExp);
      const isMonthString = format?.indexOf('mmm') !== -1;

      const datesArray: { value: string; format: string }[] = [];

      formatParts?.forEach((part, i) => {
        if (part.indexOf('yy') !== -1) {
          datesArray[0] = { value: dateParts[i], format: part };
        }
        if (part.indexOf('m') !== -1) {
          datesArray[1] = { value: dateParts[i], format: part };
        }
        if (part.indexOf('d') !== -1 && part.length <= 2) {
          datesArray[2] = { value: dateParts[i], format: part };
        }
      });

      let monthsNames;

      if (format?.indexOf('mmmm') !== -1) {
        monthsNames = monthsFull;
      } else {
        monthsNames = monthsShort;
      }

      const year = Number(datesArray[0].value);
      const month = isMonthString
        ? getMonthNumberByMonthName(datesArray[1].value, monthsNames)
        : Number(datesArray[1].value) - 1;
      const day = Number(datesArray[2].value);

      const parsedDate = createDate(year, month, day);

      return parsedDate;
    }
  }
}

export function formatDate(
  date: Date,
  format: string,
  weekdaysShort: Array<string>,
  weekdaysFull: Array<string>,
  monthsShort: Array<string>,
  monthsFull: Array<string>
): string {
  const d = getDate(date);
  const dd = addLeadingZero(getDate(date).toString());
  const ddd = weekdaysShort[getDayNumber(date)];
  const dddd = weekdaysFull[getDayNumber(date)];
  const m = getMonth(date);
  const mm = addLeadingZero((getMonth(date) + 1).toString());
  const mmm = monthsShort[getMonth(date)];
  const mmmm = monthsFull[getMonth(date)];
  const yy = getYear(date).toString().length === 2 ? getYear(date) : getYear(date).toString().slice(2, 4);
  const yyyy = getYear(date);

  const preformatted = format.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g);
  let formatted = '';
  preformatted.forEach((datePart: string) => {
    switch (datePart) {
      case 'dddd':
        datePart = datePart.replace(datePart, dddd);
        break;
      case 'ddd':
        datePart = datePart.replace(datePart, ddd);
        break;
      case 'dd':
        datePart = datePart.replace(datePart, dd);
        break;
      case 'd':
        datePart = datePart.replace(datePart, d.toString());
        break;
      case 'mmmm':
        datePart = datePart.replace(datePart, mmmm);
        break;
      case 'mmm':
        datePart = datePart.replace(datePart, mmm);
        break;
      case 'mm':
        datePart = datePart.replace(datePart, mm);
        break;
      case 'm':
        datePart = datePart.replace(datePart, m.toString());
        break;
      case 'yyyy':
        datePart = datePart.replace(datePart, yyyy.toString());
        break;
      case 'yy':
        datePart = datePart.replace(datePart, yy.toString());
        break;
      default:
    }
    formatted += datePart;
  });

  return formatted;
}
