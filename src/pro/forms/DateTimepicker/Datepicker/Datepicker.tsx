import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MDBDatepickerModalContainer from './DatepickerModalContainer/DatepickerModalContainer';
import MDBAnimation from '../../../styles/Animation/Animation';
import { DatepickerProps, defaultDatepickerProps } from './types';
import { getYear, getYearsOffset, isValidDate, formatDate, parseDate } from './utils/date-utils';
import DatepickerFooter from './DatepickerFooter/DatepickerFooter';
import DatepickerDayView from './DatepickerDayView/DatepickerDayView';
import DatepickerYearView from './DatepickerYearView/DatepickerYearView';
import DatepickerMonthView from './DatepickerMonthView/DatepickerMonthView';
import DatepickerHeader from './DatepickerHeader/DatepickerHeader';
import { DatepickerContext } from './utils/DatepickerContext';
import DatepickerControls from './DatepickerControls/DatepickerControls';
import useDatepickerKeydown from './utils/hooks/useDatepickerKeydown';
import useDatepickerBodyScroll from './utils/hooks/useDatepickerBodyScroll';
import useDatepickerClickOutside from './utils/hooks/useDatepickerClickOutside';

const MDBDatepicker: React.FC<DatepickerProps> = ({
  closeOnEsc = defaultDatepickerProps.closeOnEsc,
  title = defaultDatepickerProps.title,
  weekdaysNarrow = defaultDatepickerProps.weekdaysNarrow,
  monthsFull = defaultDatepickerProps.monthsFull,
  monthsShort = defaultDatepickerProps.monthsShort,
  weekdaysFull = defaultDatepickerProps.weekdaysFull,
  weekdaysShort = defaultDatepickerProps.weekdaysShort,
  filter,
  inline,
  min,
  max,
  format = defaultDatepickerProps.format,
  okBtnText = defaultDatepickerProps.okBtnText,
  clearBtnText = defaultDatepickerProps.clearBtnText,
  cancelBtnText = defaultDatepickerProps.cancelBtnText,
  startDay = defaultDatepickerProps.startDay,
  views = defaultDatepickerProps.views,
  defaultValue = '',
  onChange,
  onOpen,
  value,
  wrapperClass,
  openPicker = null,
  setOpenPicker,
  setDatePickerValue,
  datePickerValue,
  setPopperElement,
  styles,
  attributes,
  referenceElement,
  popperElement,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>(views);
  const [display, setDisplay] = useState(false);

  const [startWeekdays, setStartWeekdays] = useState(weekdaysNarrow);

  const [yearScope, setYearScope] = useState([0, 0]);

  const backdropRef = useRef<HTMLDivElement>(null);
  const inputReference = useRef<HTMLInputElement>(null);

  const isDefault = useRef(defaultValue && true);

  const setInlineDate = (date: Date) => {
    if (!inline) return;

    const isInlineDateSelected = inline;

    if (isInlineDateSelected) {
      const newDate = formatDate(date, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull);

      setDatePickerValue(newDate);
      setIsClosing(true);
    }
  };

  const setModalDate = (date?: Date) => {
    const newDate = date && formatDate(date, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull);

    newDate && setDatePickerValue(newDate);

    setIsClosing(true);
  };

  const { tabCount, modalRef } = useDatepickerKeydown({
    setIsClosing,
    closeOnEsc,
    openPicker,
    activeDate,
    setActiveDate,
    min,
    max,
    view,
    setView,
    setSelectedDate,
    filter,
    setInlineDate,
  });

  useDatepickerBodyScroll({ openPicker, inline });
  useDatepickerClickOutside({
    openPicker,
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
      setOpenPicker(null);
      setDisplay(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [isClosing, inputReference, referenceElement, inline, onClose, setOpenPicker]);

  useEffect(() => {
    if (openPicker !== 'date') return;

    const inputElement = inline ? referenceElement : inputReference.current;
    const inputWrapper = inputElement?.parentNode;

    const inputBtn = inputWrapper?.querySelector('button');

    inputBtn ? inputBtn.blur() : inputElement?.blur();
    onOpen?.();
  }, [openPicker, inputReference, referenceElement, inline, onOpen]);

  useEffect(() => {
    const isDefaultValue = isDefault.current;

    if (isDefaultValue) {
      const newDate = parseDate(datePickerValue, format, monthsFull, monthsShort);

      if (newDate && isValidDate(newDate)) {
        setActiveDate(newDate);
        setSelectedDate(newDate);
      }

      isDefault.current = false;
    }
  }, [defaultValue, datePickerValue, format, monthsFull, monthsShort]);

  useEffect(() => {
    const newDate = value && parseDate(value, format, monthsFull, monthsShort);

    if (newDate && isValidDate(newDate)) {
      setActiveDate(newDate);
      setSelectedDate(newDate);
      setDatePickerValue(value);
    }
  }, [value, format, monthsFull, monthsShort, setDatePickerValue]);

  useEffect(() => {
    if (openPicker !== 'date') {
      setIsClosing(false);
      setView(views);

      if (!datePickerValue) {
        setActiveDate(new Date());
        setSelectedDate(undefined);
      }
    }
  }, [openPicker, views, datePickerValue]);

  useEffect(() => {
    onChange?.(datePickerValue, activeDate);
  }, [datePickerValue, activeDate, onChange]);

  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      openPicker === 'date' && setDisplay(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [openPicker]);

  useEffect(() => {
    if (!selectedDate) return;

    setDatePickerValue(formatDate(selectedDate, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull));
  }, [selectedDate, setDatePickerValue, format, weekdaysShort, weekdaysFull, monthsShort, monthsFull]);

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
        setOpenPicker,
      }}
    >
      <>
        {openPicker === 'date' &&
          ReactDOM.createPortal(
            <>
              <MDBDatepickerModalContainer
                className={wrapperClass}
                dropdown={inline}
                isOpen={isClosing}
                styles={styles}
                attributes={attributes}
                setPopperElement={setPopperElement}
                style={{ display: display ? 'block' : 'none' }}
              >
                {!inline && <DatepickerHeader title={title} />}
                <div className='datepicker-main' ref={modalRef}>
                  <DatepickerControls />
                  <div className='datepicker-view'>
                    {view === 'days' && (
                      <DatepickerDayView
                        startWeekdays={startWeekdays}
                        startDay={startDay}
                        filter={filter}
                        inlineDayClick={setInlineDate}
                        setOpenPicker={setOpenPicker}
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
                      setValue={setDatePickerValue}
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
