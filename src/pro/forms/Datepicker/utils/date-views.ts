import {
  addMonths,
  createDate,
  getDate,
  getDaysInMonth,
  getFirstDayOfWeek,
  getMonth,
  getToday,
  getYear,
  isDateDisabled,
  isSameDate,
} from './date-utils';

export const generateIcon = (
  customIcon: string | undefined,
  customIconSize: string | undefined,
  btnIcon: boolean | undefined
): { div: HTMLDivElement; selector: HTMLElement } => {
  const btn = document.createElement('button');
  const div = document.createElement('div');

  btn.id = `datepicker-toggle-${Math.floor(Math.random() * 10001)}`;
  btn.tabIndex = 0;
  btn.type = 'button';
  btn.style.pointerEvents = 'auto';

  const icon = document.createElement('i');

  icon.className = `${customIcon} fa-${customIconSize} datepicker-icon`;

  btnIcon && btn.appendChild(icon);

  const selector = btnIcon ? btn : icon;

  selector.classList.add('datepicker-toggle-button');

  return {
    div,
    selector,
  };
};

export const getDatesArray = (
  activeDate: Date,
  selectedDate: Date | undefined,
  min: Date,
  max: Date,
  filter: any,
  startDay: number
): {
  date: Date;
  currentMonth: boolean;
  isSelected: boolean | undefined;
  isToday: boolean;
  dayNumber: number;
  disabled: boolean;
}[][] => {
  const dates = [];

  const month = getMonth(activeDate);
  const previousMonth = getMonth(addMonths(activeDate, -1));
  const nextMonth = getMonth(addMonths(activeDate, 1));
  const year = getYear(activeDate);

  const firstDay = getFirstDayOfWeek(year, month, startDay);
  const daysInMonth = getDaysInMonth(activeDate);
  const daysInPreviousMonth = getDaysInMonth(addMonths(activeDate, -1));
  const daysInWeek = 7;

  let dayNumber = 1;
  let isCurrentMonth = false;

  for (let i = 1; i < daysInWeek; i++) {
    const week = [];
    if (i === 1) {
      // First week
      const previousMonthDay = daysInPreviousMonth - firstDay + 1;
      // Previous month
      for (let j = previousMonthDay; j <= daysInPreviousMonth; j++) {
        const date = createDate(year, previousMonth, j);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: selectedDate && isSameDate(date, selectedDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
          disabled: isDateDisabled(date, min, max, filter),
        });
      }

      isCurrentMonth = true;
      // Current month
      const daysLeft = daysInWeek - week.length;
      for (let j = 0; j < daysLeft; j++) {
        const date = createDate(year, month, dayNumber);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: selectedDate && isSameDate(date, selectedDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
          disabled: isDateDisabled(date, min, max, filter),
        });
        dayNumber++;
      }
    } else {
      // Rest of the weeks
      for (let j = 1; j < 8; j++) {
        if (dayNumber > daysInMonth) {
          // Next month
          dayNumber = 1;
          isCurrentMonth = false;
        }
        const date = createDate(year, isCurrentMonth ? month : nextMonth, dayNumber);

        week.push({
          date,
          currentMonth: isCurrentMonth,
          isSelected: selectedDate && isSameDate(date, selectedDate),
          isToday: isSameDate(date, getToday()),
          dayNumber: getDate(date),
          disabled: isDateDisabled(date, min, max, filter),
        });
        dayNumber++;
      }
    }
    dates.push(week);
  }

  return dates;
};

export const getYearsArray = (yearScope: Array<number>): Array<Array<number>> => {
  const years = [];

  const firstYearInView = yearScope[0];

  let row = [];

  for (let i = 0; i < 24; i++) {
    row.push(firstYearInView + i);

    if (row.length === 4) {
      const yearsRow = row;
      years.push(yearsRow);
      row = [];
    }
  }

  return years;
};

export const getMonthsArray = (monthsShort: Array<string>): Array<Array<string>> => {
  const months: Array<Array<string>> = [];

  let row: Array<string> = [];

  monthsShort.forEach((month: string) => {
    row.push(month);

    if (row.length === 4) {
      const monthsRow = row;
      months.push(monthsRow);
      row = [];
    }
  });

  return months;
};
