import React, { useContext } from 'react';
import { DatepickerContext } from '../utils/DatepickerContext';
import { DatepickerHeaderProps } from './types';

const DatepickerHeader: React.FC<DatepickerHeaderProps> = ({ title, customHeader }) => {
  const { weekdaysShort, monthsShort, selectedDate } = useContext(DatepickerContext);
  const date = selectedDate ? selectedDate : new Date();
  return (
    <div className='datepicker-header'>
      <div className='datepicker-title'>
        <span className='datepicker-title-text'>{title}</span>
      </div>
      <div className='datepicker-date'>
        {!customHeader && (
          <span className='datepicker-date-text'>
            {weekdaysShort[date.getDay()]}, {monthsShort[date.getMonth()]} {date.getDate()}
          </span>
        )}
        {customHeader && customHeader}
      </div>
    </div>
  );
};

export default DatepickerHeader;
