import clsx from 'clsx';
import React, { useContext } from 'react';
import { getDate, getMonth, getToday, getYear, isYearDisabled } from '../utils/date-utils';
import { getYearsArray } from '../utils/date-views';
import { DatepickerContext } from '../utils/DatepickerContext';

const DatepickerYearView: React.FC = () => {
  const { yearScope, setView, setActiveDate, activeDate, selectedDate, tabCount, min, max } =
    useContext(DatepickerContext);

  return (
    <table className='datepicker-table'>
      <tbody className='datepicker-table-body'>
        {getYearsArray(yearScope).map((row, i) => (
          <tr key={i}>
            {row.map((year) => (
              <td
                key={year}
                onClick={() => {
                  setActiveDate(new Date(year, getMonth(activeDate), getDate(activeDate)));
                  setView('months');
                }}
                tabIndex={year === getYear(activeDate) ? 0 : undefined}
                className={clsx(
                  'datepicker-cell',
                  'datepicker-large-cell',
                  'datepicker-year-cell',
                  selectedDate && year === getYear(selectedDate) && 'selected',
                  tabCount === 3 && year === getYear(activeDate) && 'focused',
                  isYearDisabled(year, min, max) && 'disabled',
                  getYear(getToday()) === year && 'current'
                )}
              >
                <div className='datepicker-cell-content datepicker-large-cell-content'>{year}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DatepickerYearView;
