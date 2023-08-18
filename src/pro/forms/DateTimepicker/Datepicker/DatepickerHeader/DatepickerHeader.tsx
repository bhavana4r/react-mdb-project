import React, { useContext } from 'react';
import { DatepickerContext } from '../utils/DatepickerContext';
import { DatepickerHeaderProps } from './types';

const DatepickerHeader: React.FC<DatepickerHeaderProps> = ({ title }) => {
  const { weekdaysShort, monthsShort, selectedDate, setOpenPicker } = useContext(DatepickerContext);

  return (
    <div className='datepicker-header'>
      <div className='datepicker-title'>
        <span className='datepicker-title-text'>{title}</span>
      </div>
      <div className='datepicker-date'>
        <span className='datepicker-date-text'>
          {weekdaysShort[selectedDate ? selectedDate.getDay() : new Date().getDay()]},{' '}
          {monthsShort[selectedDate ? selectedDate.getMonth() : new Date().getMonth()]}{' '}
          {selectedDate ? selectedDate.getDate() : new Date().getDate()}
        </span>
      </div>
      <div className='buttons-container'>
        <button type='button' className='datepicker-button-toggle' onClick={() => setOpenPicker('date')}>
          <i className='far fa-calendar datepicker-toggle-icon'></i>
        </button>
        <button type='button' className='timepicker-button-toggle' onClick={() => setOpenPicker('time')}>
          <i className='far fa-clock fa-sm timepicker-icon'></i>
        </button>
      </div>
    </div>
  );
};

export default DatepickerHeader;
