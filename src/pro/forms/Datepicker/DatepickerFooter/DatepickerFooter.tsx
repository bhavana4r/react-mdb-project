import React, { useContext } from 'react';
import { DatepickerContext } from '../utils/DatepickerContext';
import { DatepickerFooterProps } from './types';

const DatepickerFooter: React.FC<DatepickerFooterProps> = ({
  clearBtnText = 'Clear',
  cancelBtnText = 'Cancel',
  okBtnText = 'Ok',
  setValue,
  selectDate,
}) => {
  const { setActiveDate, setSelectedDate, setIsClosing, selectedDate } = useContext(DatepickerContext);

  const clearDate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();

    setActiveDate(new Date());
    setSelectedDate(undefined);
    setValue('');
  };

  return (
    <div className='datepicker-footer'>
      <button tabIndex={0} onClick={(e) => clearDate(e)} className='datepicker-footer-btn datepicker-clear-btn'>
        {clearBtnText}
      </button>
      <button tabIndex={0} onClick={() => setIsClosing(true)} className='datepicker-footer-btn datepicker-cancel-btn'>
        {cancelBtnText}
      </button>
      <button
        tabIndex={0}
        onClick={() => selectDate(selectedDate as Date)}
        className='datepicker-footer-btn datepicker-ok-btn'
      >
        {okBtnText}
      </button>
    </div>
  );
};

export default DatepickerFooter;
