import React from 'react';
import {
  addDays,
  addMonths,
  addYears,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  getYearsOffset,
  isDateDisabled,
  isYearDisabled,
} from './date-utils';
import { LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, UP_ARROW, ENTER, PAGE_DOWN, PAGE_UP, HOME, END, SPACE } from './keycodes';

export const handleDayView = (
  keydown: string,
  setActiveDate: React.SetStateAction<any>,
  activeDate: Date,
  min: Date | undefined,
  max: Date | undefined,
  setSelectedDate: React.SetStateAction<any>,
  filter: ((date: Date) => boolean) | undefined,
  setInlineDate: (date: Date) => void
): void => {
  switch (keydown) {
    case LEFT_ARROW:
      setActiveDate((value: Date) => addDays(value, -1));
      break;
    case RIGHT_ARROW:
      setActiveDate((value: Date) => addDays(value, 1));
      break;
    case UP_ARROW:
      setActiveDate((value: Date) => addDays(value, -7));
      break;
    case DOWN_ARROW:
      setActiveDate((value: Date) => addDays(value, 7));
      break;
    case HOME:
      setActiveDate((value: Date) => addDays(value, 1 - getDate(value)));
      break;
    case END:
      setActiveDate((value: Date) => addDays(value, getDaysInMonth(value) - getDate(value)));
      break;
    case PAGE_UP:
      setActiveDate((value: Date) => addMonths(value, -1));
      break;
    case PAGE_DOWN:
      setActiveDate((value: Date) => addMonths(value, 1));
      break;

    case ENTER:
      if (isDateDisabled(activeDate, min, max, filter)) return;

      setInlineDate(activeDate);
      setSelectedDate(activeDate);
      break;

    case SPACE:
      if (!filter || filter(activeDate)) {
        if (isDateDisabled(activeDate, min, max, filter)) return;

        setInlineDate(activeDate);
        setSelectedDate(activeDate);
      }
      break;

    default:
      return;
  }
};

export const handleYearView = (
  keydown: string,
  activeDate: Date,
  setActiveDate: React.SetStateAction<any>,
  min: Date | undefined,
  max: Date | undefined,
  setView: React.SetStateAction<any>,
  setSelectedDate: React.SetStateAction<any>
): void => {
  const yearsPerRow = 4;
  const yearsPerPage = 24;

  switch (keydown) {
    case LEFT_ARROW:
      setActiveDate((value: Date) => addYears(value, -1));
      break;
    case RIGHT_ARROW:
      setActiveDate((value: Date) => addYears(value, 1));
      break;
    case UP_ARROW:
      setActiveDate((value: Date) => addYears(value, -yearsPerRow));
      break;
    case DOWN_ARROW:
      setActiveDate((value: Date) => addYears(value, yearsPerRow));
      break;
    case HOME:
      setActiveDate((value: Date) => addYears(value, -getYearsOffset(value, yearsPerPage)));
      break;
    case END:
      setActiveDate((value: Date) => addYears(value, yearsPerPage - getYearsOffset(value, yearsPerPage) - 1));
      break;
    case PAGE_UP:
      setActiveDate((value: Date) => addYears(value, -yearsPerPage));
      break;
    case PAGE_DOWN:
      setActiveDate((value: Date) => addYears(value, yearsPerPage));
      break;
    case ENTER:
      !isYearDisabled(getYear(activeDate), min, max) && setView('months');
      break;
    case SPACE:
      !isYearDisabled(getYear(activeDate), min, max) && setSelectedDate(activeDate);
      return;
    default:
      return;
  }
};

export const handleMonthKeyDown = (
  keydown: string,
  activeDate: Date,
  setActiveDate: React.SetStateAction<any>,
  min: Date | undefined,
  max: Date | undefined,
  setView: React.SetStateAction<any>,
  setSelectedDate: React.SetStateAction<any>,
  filter?: (date: Date) => boolean
): void => {
  switch (keydown) {
    case LEFT_ARROW:
      setActiveDate((value: Date) => addMonths(value, -1));
      break;
    case RIGHT_ARROW:
      setActiveDate((value: Date) => addMonths(value, 1));
      break;
    case UP_ARROW:
      setActiveDate((value: Date) => addMonths(value, -4));
      break;
    case DOWN_ARROW:
      setActiveDate((value: Date) => addMonths(value, 4));
      break;
    case HOME:
      setActiveDate((value: Date) => addMonths(value, -getMonth(value)));
      break;
    case END:
      setActiveDate((value: Date) => addMonths(value, 11 - getMonth(value)));
      break;
    case PAGE_UP:
      setActiveDate((value: Date) => addYears(value, -1));
      break;
    case PAGE_DOWN:
      setActiveDate((value: Date) => addYears(value, 1));
      break;
    case ENTER:
      !isDateDisabled(activeDate, min, max, filter) && setView('days');
      break;
    case SPACE:
      !isDateDisabled(activeDate, min, max, filter) && setSelectedDate(activeDate);
      return;
    default:
      return;
  }
};
