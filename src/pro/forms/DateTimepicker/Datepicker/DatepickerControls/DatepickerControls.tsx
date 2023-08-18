import React, { useContext } from 'react';
import {
  addMonths,
  addYears,
  getDate,
  getDateWithLast,
  getMonth,
  getYear,
  isNextDateDisabled,
  isPreviousDateDisabled,
} from '../utils/date-utils';
import { DatepickerContext } from '../utils/DatepickerContext';

const DatepickerControls: React.FC = () => {
  const { view, setView, activeDate, setActiveDate, monthsFull, min, max, yearScope } = useContext(DatepickerContext);

  const handleArrows = (flag: boolean) => {
    if (view === 'days') {
      const date = flag
        ? new Date(getYear(activeDate), getMonth(activeDate) + 1, getDateWithLast(activeDate))
        : new Date(getYear(activeDate), getMonth(activeDate) - 1, getDateWithLast(activeDate));

      if (flag) {
        !isNextDateDisabled(addMonths(date, -1), 'days', 1, min, max) && setActiveDate(date);
      } else {
        !isPreviousDateDisabled(addMonths(date, 1), 'days', 1, min, max) && setActiveDate(date);
      }
    } else if (view === 'years') {
      const date = flag
        ? new Date(getYear(activeDate) + 24, getMonth(activeDate), getDate(activeDate))
        : new Date(getYear(activeDate) - 24, getMonth(activeDate), getDate(activeDate));

      if (flag) {
        max ? yearScope[0] + 24 < getYear(max) && setActiveDate(date) : setActiveDate(date);
      } else {
        min ? yearScope[1] - 24 > getYear(min) && setActiveDate(date) : setActiveDate(date);
      }
    } else if (view === 'months') {
      const date = flag
        ? new Date(getYear(activeDate) + 1, getMonth(activeDate), getDate(activeDate))
        : new Date(getYear(activeDate) - 1, getMonth(activeDate), getDate(activeDate));

      if (flag) {
        !isNextDateDisabled(addYears(date, -1), 'months', 1, min as Date, max as Date) && setActiveDate(date);
      } else {
        !isPreviousDateDisabled(addYears(date, 1), 'months', 1, min as Date, max as Date) && setActiveDate(date);
      }
    }
  };

  return (
    <div className='datepicker-date-controls'>
      {view === 'days' && (
        <button tabIndex={0} className='datepicker-view-change-button' onClick={() => setView('years')}>
          {monthsFull[activeDate.getMonth()]} {activeDate.getFullYear()}
        </button>
      )}
      {view === 'years' && (
        <button tabIndex={0} className='datepicker-view-change-button' onClick={() => setView('days')}>
          {yearScope[0]} - {yearScope[1]}
        </button>
      )}
      {view === 'months' && (
        <button tabIndex={0} className='datepicker-view-change-button' onClick={() => setView('days')}>
          {getYear(activeDate)}
        </button>
      )}

      <div className='datepicker-arrow-controls'>
        <button tabIndex={0} className='datepicker-previous-button' onClick={() => handleArrows(false)}></button>
        <button tabIndex={0} className='datepicker-next-button' onClick={() => handleArrows(true)}></button>
      </div>
    </div>
  );
};

export default DatepickerControls;
