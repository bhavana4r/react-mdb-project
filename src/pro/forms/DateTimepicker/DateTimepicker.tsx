import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import MDBInput from '../../../free/forms/Input/Input';
import Datepicker from './Datepicker/Datepicker';
import Timepicker from './TimePicker/TimePicker';
import type { DateTimepickerProps } from './types';
import { isValidDate, isValidTime } from './utils/isValid';
import { usePopper } from 'react-popper';
import { parseDate } from '../Datepicker/utils/date-utils';
import { defaultDatepickerProps } from '../Datepicker/types';

const MDBDateTimepicker = ({
  className,
  label = 'Select Date and Time',
  labelStyle,
  labelClass,
  labelRef,
  inputRef,
  inline,
  disabled,
  defaultTime = '',
  defaultDate = '',
  invalidLabel,
  inputToggle = false,
  timepickerOptions,
  datepickerOptions,
  showFormat,
  dateFormat = 'dd/mm/yyyy',
  timeFormat = '12h',
  appendValidationInfo = true,
  onChange,
  onOpen,
  onClose,
  ...props
}: DateTimepickerProps) => {
  const [openPicker, setOpenPicker] = useState<'time' | 'date' | null>(null);
  const [datePickerValue, setDatePickerValue] = useState(defaultDate);
  const [timePickerValue, setTimePickerValue] = useState(defaultTime);
  const [combinedValue, setCombinedValue] = useState('');

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const splittedDate = datePickerValue ? combinedValue.split(',')[0] : null;
  const splittedTime = timePickerValue && datePickerValue ? combinedValue.split(', ')[1] : null;

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });

  const classes = clsx('form-outline', 'datetimepicker', className);

  const getInputClasses = () => {
    const date =
      splittedDate &&
      parseDate(splittedDate, dateFormat, defaultDatepickerProps.monthsFull, defaultDatepickerProps.monthsShort);

    if (combinedValue && !splittedDate && !splittedTime) {
      return 'is-invalid';
    }

    if (splittedDate && !isValidDate(date)) {
      return 'is-invalid';
    }

    if (splittedTime && !isValidTime(splittedTime)) {
      return 'is-invalid';
    }
  };

  const handleToggle = () => {
    if (!inputToggle) return;

    setOpenPicker('date');
    onOpen?.();
  };

  useEffect(() => {
    if (timePickerValue && datePickerValue) {
      setCombinedValue(`${datePickerValue}, ${timePickerValue}`);
      onChange?.(`${datePickerValue}, ${timePickerValue}`);
    }
  }, [timePickerValue, datePickerValue, onChange]);

  return (
    <>
      <div className={classes} ref={setReferenceElement} {...props}>
        <MDBInput
          label={label}
          labelStyle={labelStyle}
          labelClass={labelClass}
          ref={inputRef}
          labelRef={labelRef}
          placeholder={showFormat ? `${dateFormat}, ${timeFormat}` : undefined}
          value={combinedValue}
          onChange={(e) => {
            setCombinedValue(e.target.value);
            onChange?.(e.target.value);
          }}
          className={appendValidationInfo ? getInputClasses() : undefined}
          disabled={disabled}
          onClick={handleToggle}
        >
          {invalidLabel && <div className='invalid-feedback'>{invalidLabel}</div>}
        </MDBInput>
        {!inputToggle && (
          <button
            type='button'
            className='datetimepicker-toggle-button'
            onClick={() => {
              setOpenPicker('date');
              onOpen?.();
            }}
            disabled={disabled}
            style={{ pointerEvents: disabled ? 'none' : 'initial' }}
          >
            <i className='far fa-calendar datepicker-toggle-icon' />
          </button>
        )}
      </div>
      <Datepicker
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
        setDatePickerValue={setDatePickerValue}
        datePickerValue={datePickerValue}
        inline={inline}
        setPopperElement={setPopperElement}
        styles={styles}
        attributes={attributes}
        popperElement={popperElement}
        referenceElement={referenceElement}
        format={dateFormat}
        defaultValue={defaultDate}
        onClose={onClose}
        {...datepickerOptions}
      />
      <Timepicker
        openPicker={openPicker}
        setOpenPicker={setOpenPicker}
        setTimePickerValue={setTimePickerValue}
        timePickerValue={timePickerValue}
        inline={inline}
        setPopperElement={setPopperElement}
        styles={styles}
        format={timeFormat}
        attributes={attributes}
        defaultValue={defaultTime}
        onClose={onClose}
        {...timepickerOptions}
      />
    </>
  );
};

export default MDBDateTimepicker;
