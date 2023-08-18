import clsx from 'clsx';
import React, { useContext } from 'react';
import { getDateWithLast, getMonth, getToday, getYear, isMonthDisabled } from '../utils/date-utils';
import { getMonthsArray } from '../utils/date-views';
import { DatepickerContext } from '../utils/DatepickerContext';

const DatepickerMonthView: React.FC = () => {
  const { monthsShort, setActiveDate, setView, activeDate, selectedDate, tabCount, min, max } =
    useContext(DatepickerContext);

  return (
    <table className='datepicker-table'>
      <tbody className='datepicker-table-body'>
        {getMonthsArray(monthsShort).map((row, i) => (
          <tr key={i}>
            {row.map((month) => (
              <td
                key={monthsShort.indexOf(month)}
                onClick={() => {
                  setActiveDate(new Date(getYear(activeDate), monthsShort.indexOf(month), getDateWithLast(activeDate)));
                  setView('days');
                }}
                tabIndex={monthsShort.indexOf(month) === getMonth(activeDate) ? 0 : undefined}
                className={clsx(
                  'datepicker-cell',
                  'datepicker-large-cell',
                  'datepicker-month-cell',
                  selectedDate &&
                    monthsShort.indexOf(month) === getMonth(selectedDate) &&
                    getYear(activeDate) === getYear(selectedDate) &&
                    'selected',
                  tabCount === 3 && monthsShort.indexOf(month) === getMonth(activeDate) && 'focused',
                  getMonth(getToday()) === monthsShort.indexOf(month) &&
                    getYear(getToday()) === getYear(activeDate) &&
                    'current',
                  isMonthDisabled(monthsShort.indexOf(month), getYear(activeDate), min, max) && 'disabled'
                )}
              >
                <div className='datepicker-cell-content datepicker-large-cell-content'>{month}</div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DatepickerMonthView;
