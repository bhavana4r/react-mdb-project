import clsx from 'clsx';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import type { TimepickerProps } from './types';
import MDBAnimation from '../../../styles/Animation/Animation';
import MDBTimePickerHeader from './TimePickerHeader/TimePickerHeader';
import MDBTimePickerClock from './TimePickerClock/TimePickerClock';
import MDBTimePickerFooter from './TimePickerFooter/TimePickerFooter';
import { TimePickerContext } from './context';
import { destructureClockValue, regexpCheck, generateIcon } from './utils';

const MDBTimepicker: React.FC<TimepickerProps> = ({
  defaultValue,
  minHour,
  maxHour,
  maxTime,
  minTime,
  noIcon = false,
  showRef,
  justInput = false,
  inputLabel,
  invalidLabel,
  clearLabel,
  submitLabel,
  cancelLabel,
  format = '12h',
  timePickerClasses,
  customIcon = 'far fa-clock',
  customIconSize = 'sm',
  btnIcon = true,
  inline = false,
  increment = false,
  onChange,
  customValue,
  onOpen,
  onClose,
  isOpen,
  setIsOpen,
  inlinePickerTag = 'div',
  openPicker,
  setOpenPicker,
  setTimePickerValue,
  timePickerValue,
  setPopperElement,
  styles,
  attributes,
}) => {
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const [isReadyToHide, setIsReadyToHide] = useState(false);
  const [activeHour, setActiveHour] = useState(12);
  const [activeMinute, setActiveMinute] = useState(0);
  const [period, setPeriod] = useState(format === '24h' ? '' : 'AM');
  const [maximumHour, setMaximumHour] = useState(maxHour ? maxHour : 24);
  const [minimumHour, setMinimumHour] = useState(minHour ? minHour : 1);
  const [maximumMinute, setMaximumMinute] = useState(59);
  const [minimumMinute, setMinimumMinute] = useState(0);
  const [minPeriod, setMinPeriod] = useState('');
  const [maxPeriod, setMaxPeriod] = useState('');
  const [mode, setMode] = useState('hours');
  const [handAnimation, setHandAnimation] = useState(false);
  const [hourAngle, setHourAngle] = useState(360);
  const [minuteAngle, setMinuteAngle] = useState(360);
  const [tabCount, setTabCount] = useState(0);

  const labels = {
    input: inputLabel ?? 'Select a time',
    invalid: invalidLabel ?? 'Invalid Time Format',
    clear: clearLabel ?? 'Clear',
    submit: submitLabel ?? 'Ok',
    cancel: cancelLabel ?? 'Cancel',
  };

  const pickerClasses = clsx('timepicker-modal', timePickerClasses);

  const pickerWrapperClasses = clsx(
    'timepicker-wrapper',
    'h-100',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-column',
    inline ? 'timepicker-wrapper-inline' : 'position-fixed',
    'fade',
    isReadyToHide && (isOpen || isPickerOpened) && 'show'
  );

  const labelRef = useRef<HTMLLabelElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickerBtnHandle = useCallback(() => {
    isOpen ? setIsOpen(true) : setIsPickerOpened(true);
  }, [isOpen, setIsOpen]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!inline && e.target === wrapperRef.current) {
        if (isOpen) {
          setIsOpen(false);
        } else {
          setIsPickerOpened(false);
          setOpenPicker(null);
        }
      }

      if (
        inline &&
        e.target !== wrapperRef.current &&
        !wrapperRef.current?.contains(e.target as Node) &&
        e.target !== inputRef.current?.parentNode &&
        !inputRef.current?.parentNode?.contains(e.target as Node)
      ) {
        isOpen ? setIsOpen(false) : setIsPickerOpened(false);
      }
    },
    [wrapperRef, inline, inputRef, isOpen, setIsOpen, setOpenPicker]
  );

  const keyboardNavigation = useCallback(
    (e: any) => {
      const { key } = e;

      e.preventDefault();

      if (key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
        } else {
          setIsPickerOpened(false);
          setOpenPicker(null);
        }
      }

      if (key === 'ArrowUp' && mode === 'hours') {
        const limit = format === '12h' ? 12 : 24;
        const newValue = activeHour === limit ? 1 : activeHour + 1;
        setActiveHour(newValue);
        setHourAngle(newValue * 30);
      }

      if (key === 'ArrowUp' && mode === 'minutes') {
        const limit = increment ? 55 : 59;
        const addend = increment ? 5 : 1;
        const newValue = activeMinute >= limit ? 0 : activeMinute + addend;
        setActiveMinute(newValue);
        setMinuteAngle(newValue * 6);
      }

      if (key === 'ArrowDown' && mode === 'hours') {
        const limit = format === '12h' ? 12 : 24;

        const newValue = activeHour === 1 ? limit : activeHour - 1;
        setActiveHour(newValue);
        setHourAngle(newValue * 30);
      }

      if (key === 'ArrowDown' && mode === 'minutes') {
        const limit = increment ? 55 : 59;
        const addend = increment ? 5 : 1;
        const newValue = activeMinute <= 0 ? limit : activeMinute - addend;
        setActiveMinute(newValue);
        setMinuteAngle(newValue * 6);
      }

      if (key === 'Tab') {
        const focusableElemenets = wrapperRef.current?.querySelectorAll('[tabindex="0"]');

        if (focusableElemenets && focusableElemenets[tabCount]) {
          (focusableElemenets[tabCount] as HTMLElement).focus();
          tabCount === focusableElemenets.length - 1 ? setTabCount(0) : setTabCount(tabCount + 1);
        }
      }

      if (key === 'Enter') {
        document.activeElement && (document.activeElement as HTMLElement).click();
      }
    },
    [activeHour, format, mode, activeMinute, increment, tabCount, isOpen, setIsOpen, setOpenPicker]
  );

  useEffect(() => {
    if (isPickerOpened) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', keyboardNavigation);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', keyboardNavigation);
    };
  }, [isPickerOpened, handleClickOutside, keyboardNavigation]);

  useEffect(() => {
    if (maxTime) {
      const { hour, minute, defaultPeriod } = destructureClockValue(maxTime);

      setMaximumHour(hour);
      setMaximumMinute(minute);

      if (defaultPeriod !== undefined) {
        setMaxPeriod(defaultPeriod);
      }
    }

    if (minTime) {
      const { hour, minute, defaultPeriod } = destructureClockValue(minTime);

      setMinimumHour(hour);
      setMinimumMinute(minute);

      if (defaultPeriod !== undefined) {
        setMinPeriod(defaultPeriod);
      }
    }
  }, [maxTime, minTime]);

  useEffect(() => {
    customValue && setTimePickerValue(customValue);
  }, [customValue, setTimePickerValue]);

  useEffect(() => {
    if (defaultValue && regexpCheck(defaultValue, format)) {
      setTimePickerValue(defaultValue);
    }
  }, [defaultValue, format, setTimePickerValue]);

  useEffect(() => {
    if (regexpCheck(timePickerValue, format) || timePickerValue === '') {
      if (timePickerValue !== '') {
        const { hour, minute, defaultPeriod } = destructureClockValue(timePickerValue);
        if (format === '24h') {
          hour === 0 ? setActiveHour(24) : setActiveHour(hour);
          if (hour === 0) {
            setHourAngle(360);
          } else if (hour > 12) {
            setHourAngle((hour - 12) * 30);
          } else {
            setHourAngle(hour * 30);
          }
        } else {
          setActiveHour(hour);
          setHourAngle(hour * 30);
          setPeriod(defaultPeriod);
        }

        setActiveMinute(minute);
        setMinuteAngle(minute * 6);
      }
    }
  }, [timePickerValue, format]);

  useEffect(() => {
    if (!justInput && !noIcon) {
      const inputWrapper = labelRef.current?.parentNode;

      const { div, selector } = generateIcon(labels.invalid, customIcon, customIconSize, btnIcon);

      inputWrapper?.insertBefore(div, labelRef.current);
      inputWrapper?.insertBefore(selector, labelRef.current);

      selector.addEventListener('click', pickerBtnHandle);

      return () => {
        selector.removeEventListener('click', pickerBtnHandle);
        inputWrapper?.removeChild(selector);
      };
    }
  }, [pickerBtnHandle, labels.invalid, btnIcon, customIcon, customIconSize, justInput, noIcon]);

  useEffect(() => {
    if (showRef) {
      const selector = showRef.current;

      selector?.addEventListener('click', pickerBtnHandle);

      return () => {
        selector?.removeEventListener('click', pickerBtnHandle);
      };
    }
  }, [showRef, pickerBtnHandle]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let secondTimer: ReturnType<typeof setTimeout>;
    if (isPickerOpened || isOpen) {
      onOpen?.();
      setMode('hours');
      setIsReadyToHide(true);
      setTabCount(0);
      timer = setTimeout(() => {
        isOpen ? setIsOpen(true) : setIsPickerOpened(true);
      }, 4);
    } else {
      onClose?.();
      isOpen ? setIsOpen(false) : setIsPickerOpened(false);
      secondTimer = setTimeout(() => {
        setIsReadyToHide(false);
      }, 300);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [isPickerOpened, isOpen, setIsOpen, onOpen, onClose]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (handAnimation) {
      timer = setTimeout(() => {
        setHandAnimation(false);
      }, 400);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [handAnimation]);

  useEffect(() => {
    setIsPickerOpened(openPicker === 'time');
  }, [openPicker, setIsOpen]);

  useEffect(() => {
    setTimePickerValue(timePickerValue);
  }, [timePickerValue, setTimePickerValue]);

  return (
    <>
      <TimePickerContext.Provider
        value={{
          isPickerOpened: isOpen ?? isPickerOpened,
          setIsPickerOpened: isOpen ? setIsOpen : setIsPickerOpened,
          setTimePickerValue,
          submitLabel: labels.submit,
          clearLabel: labels.clear,
          cancelLabel: labels.cancel,
          activeHour,
          activeMinute,
          setActiveHour,
          setActiveMinute,
          format,
          period,
          setPeriod,
          defaultValue,
          maxHour: maximumHour,
          minHour: minimumHour,
          maxPeriod,
          minPeriod,
          mode,
          setMode,
          setHandAnimation,
          handAnimation,
          minMinute: minimumMinute,
          maxMinute: maximumMinute,
          hourAngle,
          setHourAngle,
          minuteAngle,
          setMinuteAngle,
          inline,
          increment,
          onChange,
        }}
      >
        <>
          {!inline &&
            (isOpen || isPickerOpened || isReadyToHide) &&
            ReactDOM.createPortal(
              <MDBAnimation
                tag='div'
                start='onLoad'
                animation='fade-in'
                className={pickerClasses}
                role='dialog'
                tabIndex={-1}
                duration={300}
              >
                <div ref={wrapperRef} className={pickerWrapperClasses}>
                  <div className='d-flex align-items-center justify-content-center flex-column shadow timepicker-container'>
                    <div className='d-flex flex-column timepicker-elements justify-content-around'>
                      <MDBTimePickerHeader setOpenPicker={setOpenPicker} />
                      <MDBTimePickerClock />
                    </div>
                    <MDBTimePickerFooter setOpenPicker={setOpenPicker} />
                  </div>
                </div>
              </MDBAnimation>,
              document.body
            )}
          {inline &&
            (isOpen || isPickerOpened || isReadyToHide) &&
            ReactDOM.createPortal(
              <MDBAnimation
                start='onLoad'
                animation='fade-in'
                className={pickerClasses}
                style={styles.popper}
                {...attributes.popper}
                role='dialog'
                animationRef={setPopperElement as any}
                tabIndex={-1}
                tag={inlinePickerTag}
                duration={300}
              >
                <div ref={wrapperRef} className={pickerWrapperClasses}>
                  <div
                    className='d-flex align-items-center justify-content-center flex-column shadow timepicker-container'
                    style={{ overflowY: 'inherit' }}
                  >
                    <div className='d-flex flex-column timepicker-elements justify-content-around timepicker-elements-inline'>
                      <MDBTimePickerHeader setOpenPicker={setOpenPicker} />
                    </div>
                  </div>
                </div>
              </MDBAnimation>,
              document.body
            )}
        </>
      </TimePickerContext.Provider>
    </>
  );
};

export default MDBTimepicker;
