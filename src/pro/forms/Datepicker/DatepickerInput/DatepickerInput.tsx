import React, { useContext, useEffect, useRef } from 'react';
import { generateIcon } from '../utils/date-views';
import MDBInput from '../../../../free/forms/Input/Input';
import clsx from 'clsx';
import { DatepickerContext } from '../utils/DatepickerContext';
import { isValidDate, parseDate } from '../utils/date-utils';
import { DatepickerInputProps } from './types';

const DatepickerInput: React.FC<DatepickerInputProps> = ({
  labelText,
  inline,
  setReferenceElement,
  inputClasses,
  value,
  style,
  inputStyle,
  setIsOpen,
  icon,
  input,
  inputId,
  inputToggle,
  setDatepickerValue,
  format,
  ...props
}) => {
  const { monthsFull, monthsShort, setSelectedDate, setActiveDate } = useContext(DatepickerContext);
  const inputClass = clsx(value ? 'active' : '', inputClasses);

  const labelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (inputToggle) return;

    const inputWrapper = labelRef.current?.parentNode;

    const { div, selector } = generateIcon(icon, 'sm', true);

    inputWrapper?.insertBefore(div, labelRef.current);
    inputWrapper?.insertBefore(selector, labelRef.current);

    selector.addEventListener('click', () => setIsOpen((value: boolean) => !value));

    return () => {
      selector.removeEventListener('click', () => setIsOpen((value: boolean) => !value));
      inputWrapper?.removeChild(selector);
    };
  }, [icon, setIsOpen, inputToggle]);

  const onClickInput = () => {
    if (!inputToggle) return;

    setIsOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDate(e.target.value, format, monthsFull, monthsShort);
    setDatepickerValue(e.target.value);

    if (date && isValidDate(date)) {
      setActiveDate(date);
      setSelectedDate(date);
    } else {
      setActiveDate(new Date());
      setSelectedDate(undefined);
    }
  };

  return (
    <MDBInput
      className={inputClass}
      label={labelText}
      id={inputId}
      ref={inline ? setReferenceElement : input}
      labelRef={labelRef}
      wrapperClass='datepicker'
      value={value}
      onChange={handleInput}
      style={inputStyle}
      wrapperStyle={style as Record<string, unknown>}
      onClick={onClickInput}
      {...props}
    />
  );
};

export default DatepickerInput;
