import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MDBDatepickerModalContainer from './DatepickerModalContainer/DatepickerModalContainer';
import MDBAnimation from '../../styles/Animation/Animation';
import { DatepickerProps, defaultDatepickerProps } from './types';
import { usePopper } from 'react-popper';
import { flip } from '@popperjs/core';
import { getYear, getYearsOffset, isValidDate, formatDate, parseDate } from './utils/date-utils';
import DatepickerFooter from './DatepickerFooter/DatepickerFooter';
import DatepickerDayView from './DatepickerDayView/DatepickerDayView';
import DatepickerYearView from './DatepickerYearView/DatepickerYearView';
import DatepickerMonthView from './DatepickerMonthView/DatepickerMonthView';
import DatepickerHeader from './DatepickerHeader/DatepickerHeader';
import { DatepickerContext } from './utils/DatepickerContext';
import DatepickerControls from './DatepickerControls/DatepickerControls';
import DatepickerInput from './DatepickerInput/DatepickerInput';
import useDatepickerKeydown from './utils/hooks/useDatepickerKeydown';
import useDatepickerBodyScroll from './utils/hooks/useDatepickerBodyScroll';
import useDatepickerClickOutside from './utils/hooks/useDatepickerClickOutside';

const MDBDatepicker: React.FC<DatepickerProps> = ({
  closeOnEsc = defaultDatepickerProps.closeOnEsc,
  customHeader,
  title = defaultDatepickerProps.title,
  weekdaysNarrow = defaultDatepickerProps.weekdaysNarrow,
  monthsFull = defaultDatepickerProps.monthsFull,
  monthsShort = defaultDatepickerProps.monthsShort,
  weekdaysFull = defaultDatepickerProps.weekdaysFull,
  weekdaysShort = defaultDatepickerProps.weekdaysShort,
  disableFuture,
  disablePast,
  filter,
  inline,
  className,
  min,
  max,
  format = defaultDatepickerProps.format,
  okBtnText = defaultDatepickerProps.okBtnText,
  clearBtnText = defaultDatepickerProps.clearBtnText,
  cancelBtnText = defaultDatepickerProps.cancelBtnText,
  inputToggle,
  customIcon = defaultDatepickerProps.customIcon,
  inputId,
  inputLabel = defaultDatepickerProps.inputLabel,
  inputStyle,
  startDay = defaultDatepickerProps.startDay,
  views = defaultDatepickerProps.views,
  style,
  defaultValue = '',
  onChange,
  onClose,
  onOpen,
  getFormattedDateValues,
  value,
  wrapperClass,
  selectOnClick = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>(views);
  const [datepickerValue, setDatepickerValue] = useState(value || defaultValue);
  const [display, setDisplay] = useState(false);

  // popper
  const [popperElement, setPopperElement] = useState<HTMLElement>();
  const [referenceElement, setReferenceElement] = useState<HTMLInputElement>();
  const [startWeekdays, setStartWeekdays] = useState(weekdaysNarrow);

  const [yearScope, setYearScope] = useState([0, 0]);

  const backdropRef = useRef<HTMLDivElement>(null);
  const inputReference = useRef<HTMLInputElement>(null);

  const isDefault = useRef(defaultValue && true);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [flip],
    ...{},
  });

  const setInlineDate = (date: Date) => {
    if (!inline) return;

    const isInlineDateSelected = inline;

    if (isInlineDateSelected) {
      const newDate = formatDate(date, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull);

      setDatepickerValue(newDate);
      setIsClosing(true);
    }
  };

  const setModalDate = (date?: Date) => {
    const newDate = date && formatDate(date, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull);

    newDate && setDatepickerValue(newDate);

    setIsClosing(true);
  };

  const { tabCount, modalRef } = useDatepickerKeydown({
    setIsClosing,
    closeOnEsc,
    isOpen,
    activeDate,
    setActiveDate,
    min,
    max,
    view,
    setView,
    setSelectedDate,
    filter,
    setInlineDate,
    disableFuture,
    disablePast,
  });

  useDatepickerBodyScroll({ isOpen, inline });
  useDatepickerClickOutside({
    isOpen,
    inline,
    referenceElement,
    popperElement,
    setIsClosing,
    backdropRef,
  });

  useEffect(() => {
    const activeYear = getYear(activeDate);
    const yearsOffset = getYearsOffset(activeDate, 24);
    const firstYearInView = activeYear - yearsOffset;

    setYearScope([firstYearInView, firstYearInView + 23]);
  }, [activeDate]);

  useEffect(() => {
    const sortedWeekdays = weekdaysNarrow.slice(startDay).concat(weekdaysNarrow.slice(0, startDay));

    setStartWeekdays(sortedWeekdays);
  }, [weekdaysNarrow, startDay]);

  useEffect(() => {
    if (!isClosing) return;

    const inputElement = inline ? referenceElement : inputReference.current;
    const inputWrapper = inputElement?.parentNode;

    const inputBtn = inputWrapper?.querySelector('button');

    inputBtn ? inputBtn.focus() : inputElement?.focus();
    onClose?.();

    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setIsOpen(false);
      setDisplay(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [isClosing, inputReference, referenceElement, inline, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const inputElement = inline ? referenceElement : inputReference.current;
    const inputWrapper = inputElement?.parentNode;

    const inputBtn = inputWrapper?.querySelector('button');

    inputBtn ? inputBtn.blur() : inputElement?.blur();
    onOpen?.();
  }, [isOpen, inputReference, referenceElement, inline, onOpen]);

  useEffect(() => {
    const isDefaultValue = isDefault.current;

    if (isDefaultValue) {
      const newDate = parseDate(datepickerValue, format, monthsFull, monthsShort);

      if (newDate && isValidDate(newDate)) {
        setActiveDate(newDate);
        setSelectedDate(newDate);
      }

      isDefault.current = false;
    }
  }, [defaultValue, datepickerValue, format, monthsFull, monthsShort]);

  useEffect(() => {
    const newDate = value && parseDate(value, format, monthsFull, monthsShort);

    if (newDate && isValidDate(newDate)) {
      setActiveDate(newDate);
      setSelectedDate(newDate);
      setDatepickerValue(value);
    }
    if (value === '') {
      setActiveDate(new Date());
      setSelectedDate(undefined);
      setDatepickerValue(value);
    }
  }, [value, format, monthsFull, monthsShort]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setView(views);

      if (!datepickerValue) {
        setActiveDate(new Date());
        setSelectedDate(undefined);
      }
    }
  }, [isOpen, views, datepickerValue]);

  useEffect(() => {
    onChange?.(datepickerValue, activeDate);
  }, [datepickerValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const date = selectedDate ? selectedDate : new Date();
    const dayNumber = String(date.getDate());
    const weekdayShort = weekdaysShort[date.getDay()];
    const weekdayFull = weekdaysFull[date.getDay()];

    const monthShort = monthsShort[date.getMonth()];
    const monthFull = monthsFull[date.getMonth()];

    const yearFull = String(date.getFullYear());
    const yearShort = yearFull.slice(-2);

    getFormattedDateValues?.({ dayNumber, weekdayShort, weekdayFull, monthShort, monthFull, yearFull, yearShort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      isOpen && setDisplay(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <DatepickerContext.Provider
      value={{
        view,
        setView,
        activeDate,
        setActiveDate,
        selectedDate,
        setSelectedDate,
        weekdaysShort,
        monthsShort,
        monthsFull,
        min,
        max,
        setIsClosing,
        weekdaysFull,
        yearScope,
        tabCount,
        isClosing,
        isOpen,
        disablePast,
        disableFuture,
      }}
    >
      <>
        <DatepickerInput
          inputClasses={className}
          labelText={inputLabel}
          inline={inline}
          setReferenceElement={setReferenceElement}
          value={datepickerValue}
          setDatepickerValue={setDatepickerValue}
          setIsOpen={setIsOpen}
          style={style}
          inputStyle={inputStyle}
          format={format}
          icon={customIcon}
          input={inputReference}
          inputId={inputId}
          inputToggle={inputToggle}
          {...props}
        />
        {isOpen &&
          ReactDOM.createPortal(
            <>
              <MDBDatepickerModalContainer
                className={wrapperClass}
                dropdown={inline}
                isOpen={isClosing}
                styles={styles}
                attributes={attributes}
                setPopperElement={setPopperElement}
                style={{ display: display ? 'flex' : 'none' }}
              >
                {!inline && <DatepickerHeader title={title} customHeader={customHeader} />}
                <div className='datepicker-main' ref={modalRef}>
                  <DatepickerControls />
                  <div className='datepicker-view'>
                    {view === 'days' && (
                      <DatepickerDayView
                        startWeekdays={startWeekdays}
                        startDay={startDay}
                        filter={filter}
                        inlineDayClick={setInlineDate}
                        selectDate={setModalDate}
                        selectOnClick={selectOnClick}
                      />
                    )}
                    {view === 'years' && <DatepickerYearView />}
                    {view === 'months' && <DatepickerMonthView />}
                  </div>
                  {!inline && (
                    <DatepickerFooter
                      okBtnText={okBtnText}
                      clearBtnText={clearBtnText}
                      cancelBtnText={cancelBtnText}
                      setValue={setDatepickerValue}
                      selectDate={setModalDate}
                    />
                  )}
                </div>
              </MDBDatepickerModalContainer>

              {!inline && (
                <MDBAnimation
                  tag='div'
                  animation={isClosing ? 'fade-out' : 'fade-in'}
                  start='onLoad'
                  animationRef={backdropRef}
                  className='datepicker-backdrop'
                  style={{ display: display ? 'block' : 'none' }}
                  duration={300}
                />
              )}
            </>,
            document.body
          )}
      </>
    </DatepickerContext.Provider>
  );
};

export default MDBDatepicker;
