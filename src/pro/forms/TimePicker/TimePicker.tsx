import clsx from 'clsx';
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';

import type { TimepickerProps } from './types';
import MDBInput from '../../../free/forms/Input/Input';
import TimepickerModal from './TimepickerModal/TimepickerModal';
import MDBBtn from '../../../free/components/Button/Button';

import { TimePickerContext } from './context';
import { destructureClockValue, regexpCheck, getCurrentTime, convertDateToTime } from './utils';
import { handleHoursKeys, handleMinutesKeys, handleTab, handleClickOutside } from './navigationUtils';

import { ESCAPE, DOWN_ARROW, UP_ARROW, ENTER, TAB } from './keycodes';

const MDBTimepicker: React.FC<TimepickerProps> = ({
  className,
  defaultValue,
  minHour,
  maxHour,
  maxTime,
  minTime,
  noIcon = false,
  showRef,
  inputID,
  justInput = false,
  inputClasses,
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
  inputStyle,
  onOpen,
  onClose,
  disableFuture,
  disablePast,
  disabled = false,
  amLabel = 'AM',
  pmLabel = 'PM',
  switchHoursToMinutesOnClick = true,
  headId = '',
  bodyId = '',
  ...props
}) => {
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const [isReadyToHide, setIsReadyToHide] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
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
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [tabCount, setTabCount] = useState(0);
  if (defaultValue instanceof Date) {
    defaultValue = convertDateToTime(defaultValue, format);
  }

  const inputUniqueId = useId();

  const inputIDValue = inputID ?? inputUniqueId;

  const labels = {
    input: inputLabel ?? 'Select a time',
    invalid: invalidLabel ?? 'Invalid Time Format',
    clear: clearLabel ?? 'Clear',
    submit: submitLabel ?? 'Ok',
    cancel: cancelLabel ?? 'Cancel',
  };

  const classes = clsx('timepicker', className);

  const inputClassName = clsx('timepicker-input', isInvalid && 'is-invalid', inputClasses);

  const timepickerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickerBtnHandle = useCallback(() => {
    setIsPickerOpened(true);
  }, []);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleInputFocus = (e: any) => {
    if (justInput) {
      e.target.blur();

      setIsPickerOpened(true);
    }
  };

  const handleCloseOutside = useCallback(
    (e: any) => handleClickOutside(e, setIsPickerOpened, inline, wrapperRef.current, inputRef.current),
    [wrapperRef, inline, inputRef]
  );

  const keyboardNavigation = useCallback(
    (e: any) => {
      const { key } = e;

      if (![DOWN_ARROW, UP_ARROW, ESCAPE, TAB, ENTER].includes(key)) return;

      e.preventDefault();

      if (key === ESCAPE) {
        return setIsPickerOpened(false);
      }

      if (key === UP_ARROW && mode === 'hours') {
        return handleHoursKeys(format, activeHour, setActiveHour, setHourAngle, true);
      }

      if (key === UP_ARROW && mode === 'minutes') {
        return handleMinutesKeys(setActiveMinute, setMinuteAngle, increment, activeMinute, true);
      }

      if (key === DOWN_ARROW && mode === 'hours') {
        return handleHoursKeys(format, activeHour, setActiveHour, setHourAngle, false);
      }

      if (key === DOWN_ARROW && mode === 'minutes') {
        return handleMinutesKeys(setActiveMinute, setMinuteAngle, increment, activeMinute, false);
      }

      if (key === TAB) {
        return handleTab(setTabCount, tabCount, wrapperRef.current);
      }

      if (key === ENTER) {
        return document.activeElement && (document.activeElement as HTMLElement).click();
      }
    },
    [activeHour, format, mode, activeMinute, increment, tabCount]
  );

  useEffect(() => {
    if (!disablePast && !disableFuture) return;

    const { hours, minutes, period } = getCurrentTime(format);

    if (disablePast) {
      setMinimumHour(hours);
      setMinimumMinute(minutes);
      return setMinPeriod(period);
    }

    if (disableFuture) {
      setMaximumHour(hours);
      setMaximumMinute(minutes);
      return setMaxPeriod(period);
    }
  }, [disableFuture, disablePast, format]);

  useEffect(() => {
    if (isPickerOpened) {
      document.addEventListener('click', handleCloseOutside);
      document.addEventListener('keydown', keyboardNavigation);
    }

    return () => {
      document.removeEventListener('click', handleCloseOutside);
      document.removeEventListener('keydown', keyboardNavigation);
    };
  }, [isPickerOpened, handleCloseOutside, keyboardNavigation]);

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
    if (typeof defaultValue !== 'string') {
      return;
    }
    if (defaultValue && regexpCheck(defaultValue, format)) {
      setInputValue(defaultValue);
    }
  }, [defaultValue, format]);

  useEffect(() => {
    if (regexpCheck(inputValue, format) || inputValue === '') {
      setIsInvalid(false);

      if (inputValue !== '') {
        const { hour, minute, defaultPeriod } = destructureClockValue(inputValue);
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
    } else {
      setIsInvalid(true);
    }
  }, [inputValue, format]);

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
    if (isPickerOpened) {
      onOpen?.();
      setMode('hours');
      setTabCount(0);
    } else {
      onClose?.();
      setIsPickerOpened(false);
    }

    const timer = setTimeout(() => setIsReadyToHide(isPickerOpened), 150);

    return () => {
      clearTimeout(timer);
    };
  }, [isPickerOpened, onOpen, onClose]);

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

  return (
    <>
      <TimePickerContext.Provider
        value={{
          isPickerOpened,
          setIsPickerOpened,
          setInputValue,
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
          amLabel,
          pmLabel,
          switchHoursToMinutesOnClick,
          headId,
          bodyId,
        }}
      >
        <>
          <div className={classes} ref={inline ? setReferenceElement : timepickerRef} {...props}>
            <MDBInput
              onFocus={handleInputFocus}
              ref={inputRef}
              labelRef={labelRef}
              className={inputClassName}
              label={labels.input}
              id={inputIDValue}
              value={inputValue}
              onChange={handleInputChange}
              wrapperClass='timepicker'
              style={inputStyle}
              disabled={disabled}
            >
              {!justInput &&
                !noIcon &&
                (!btnIcon ? (
                  <i
                    onClick={pickerBtnHandle}
                    className={`${customIcon} ${customIconSize} timepicker-icon timepicker-toggle-button`}
                  />
                ) : (
                  <MDBBtn
                    className='timepicker-toggle-button'
                    onClick={pickerBtnHandle}
                    color='none'
                    tabIndex={0}
                    type='button'
                    disabled={disabled}
                    style={{ pointerEvents: disabled ? 'none' : 'auto' }}
                  >
                    <i className={`${customIcon} ${customIconSize} timepicker-icon`} />
                  </MDBBtn>
                ))}
            </MDBInput>
          </div>
          <TimepickerModal
            isOpen={isPickerOpened}
            isReadyToHide={isReadyToHide}
            wrapperRef={wrapperRef}
            referenceElement={referenceElement}
            inline={inline}
            className={timePickerClasses}
          />
        </>
      </TimePickerContext.Provider>
    </>
  );
};

export default MDBTimepicker;
