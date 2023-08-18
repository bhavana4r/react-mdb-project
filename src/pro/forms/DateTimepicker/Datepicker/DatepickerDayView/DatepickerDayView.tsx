import clsx from 'clsx';
import React, { useContext } from 'react';
import { getMonth, isDateDisabled, isSameDate } from '../utils/date-utils';
import { getDatesArray } from '../utils/date-views';
import { DatepickerContext } from '../utils/DatepickerContext';
import { DatepickerDayProps } from './types';

const DatepickerDayView: React.FC<DatepickerDayProps> = ({
  filter,
  startWeekdays,
  startDay,
  inlineDayClick,
  setOpenPicker,
}) => {
  const { min, max, setActiveDate, setSelectedDate, activeDate, selectedDate, tabCount } =
    useContext(DatepickerContext);

  const setActiveDay = (date: Date) => {
    const isNotDisabled = !isDateDisabled(date, min, max, filter);

    if (isNotDisabled) {
      setActiveDate(date);
      setSelectedDate(date);
      setOpenPicker('time');
      inlineDayClick(date);
    }
  };

  return (
    <table className='datepicker-table'>
      <thead>
        <tr>
          {startWeekdays.map((row: string, i: number) => (
            <th key={i} className='datepicker-day-heading' scope='col'>
              {row}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='datepicker-table-body'>
        {getDatesArray(activeDate, selectedDate, min as Date, max as Date, filter, startDay).map((week, weekNr) => (
          <tr key={weekNr}>
            {week.map((day, dayNr) => (
              <td
                key={dayNr}
                onClick={() => setActiveDay(day.date)}
                tabIndex={isSameDate(day.date, activeDate) ? 0 : undefined}
                className={clsx(
                  'datepicker-cell',
                  'datepicker-small-cell',
                  'datepicker-day-cell',
                  day.isToday && 'current',
                  day.isSelected && 'selected',
                  day.disabled && 'disabled',
                  tabCount === 3 && isSameDate(day.date, activeDate) && 'focused',
                  getMonth(activeDate) !== getMonth(day.date) && 'disabled'
                )}
              >
                <div
                  className='datepicker-cell-content datepicker-small-cell-content'
                  style={{ display: day.currentMonth ? 'block' : 'none' }}
                >
                  {day.dayNumber}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DatepickerDayView;
