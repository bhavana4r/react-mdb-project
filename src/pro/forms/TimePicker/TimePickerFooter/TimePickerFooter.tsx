// import clsx from 'clsx';
import React, { useContext } from 'react';
import type { TimePickerFooterProps } from './types';
import MDBBtn from '../../../../free/components/Button/Button';
import { TimePickerContext } from '../context';
import { isDisabled, destructureClockValue } from '../utils';

const MDBTimePickerFooter: React.FC<TimePickerFooterProps> = React.forwardRef<HTMLDivElement, TimePickerFooterProps>(
  ({ ...props }, ref) => {
    const {
      setIsPickerOpened,
      setInputValue,
      cancelLabel,
      submitLabel,
      clearLabel,
      activeHour,
      period,
      activeMinute,
      maxHour,
      maxMinute,
      minHour,
      minMinute,
      maxPeriod,
      minPeriod,
      defaultValue,
      setActiveHour,
      setActiveMinute,
      setPeriod,
      format,
      setHourAngle,
      setMinuteAngle,
      onChange,
    } = useContext(TimePickerContext);

    const handleOkClick = () => {
      if (
        isDisabled(activeHour, maxHour, minHour, period, maxPeriod, minPeriod) ||
        isDisabled(activeMinute, maxMinute, minMinute, period, maxPeriod, minPeriod)
      ) {
        return;
      }

      setIsPickerOpened(false);

      const newHour = activeHour === 24 ? '00' : activeHour < 10 ? `0${activeHour}` : activeHour;
      const newMinute = activeMinute < 10 ? `0${activeMinute}` : activeMinute;
      const newValue = `${newHour}:${newMinute} ${period}`.trim();
      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleClearClick = () => {
      if (defaultValue !== '' && defaultValue !== undefined) {
        const { hour, minute, defaultPeriod } = destructureClockValue(defaultValue);
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
        setInputValue(defaultValue);
        onChange?.(defaultValue);
      } else {
        setActiveHour(12);
        setHourAngle(360);

        setActiveMinute(0);
        setMinuteAngle(360);

        setInputValue('');
        onChange?.('');

        setPeriod(format === '24h' ? '' : 'AM');
      }
    };

    return (
      <div className='timepicker-footer' ref={ref} {...props}>
        <div className='w-100 d-flex justify-content-between'>
          <MDBBtn
            onClick={handleClearClick}
            type='button'
            color='none'
            className='timepicker-button timepicker-clear'
            tabIndex={0}
          >
            {clearLabel}
          </MDBBtn>
          <MDBBtn
            onClick={() => setIsPickerOpened(false)}
            type='button'
            color='none'
            className='timepicker-button timepicker-cancel'
            tabIndex={0}
          >
            {cancelLabel}
          </MDBBtn>
          <MDBBtn
            onClick={handleOkClick}
            type='button'
            color='none'
            className='timepicker-button timepicker-submit'
            tabIndex={0}
          >
            {submitLabel}
          </MDBBtn>
        </div>
      </div>
    );
  }
);

export default MDBTimePickerFooter;
