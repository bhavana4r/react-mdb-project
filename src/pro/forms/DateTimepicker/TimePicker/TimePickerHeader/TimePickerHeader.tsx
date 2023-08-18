// import clsx from 'clsx';
import React, { useContext } from 'react';
import type { TimePickerHeaderProps } from './types';
import MDBBtn from '../../../../../free/components/Button/Button';
import MDBIcon from '../../../../../free/styles/Icon/Icon';
import { TimePickerContext } from '../context';
import { isDisabled } from '../utils';

const MDBTimePickerHeader: React.FC<TimePickerHeaderProps> = React.forwardRef<HTMLDivElement, TimePickerHeaderProps>(
  ({ setOpenPicker, ...props }, ref) => {
    const {
      activeHour,
      format,
      period,
      setPeriod,
      mode,
      setMode,
      activeMinute,
      setHandAnimation,
      inline,
      setActiveHour,
      setActiveMinute,
      maxHour,
      maxMinute,
      minHour,
      minMinute,
      maxPeriod,
      minPeriod,
      setTimePickerValue,
      setIsPickerOpened,
      increment,
      submitLabel,
    } = useContext(TimePickerContext);

    const handleClick = (value: string) => {
      setMode(value);
      setHandAnimation(true);
    };

    const handleOkClick = () => {
      if (
        isDisabled(activeHour, maxHour, minHour, period, maxPeriod, minPeriod) ||
        isDisabled(activeMinute, maxMinute, minMinute, period, maxPeriod, minPeriod)
      ) {
        return;
      }

      setIsPickerOpened(false);
      setOpenPicker(null);

      const newHour = activeHour === 24 ? '00' : activeHour < 10 ? `0${activeHour}` : activeHour;
      const newMinute = activeMinute < 10 ? `0${activeMinute}` : activeMinute;
      setTimePickerValue(`${newHour}:${newMinute} ${period}`.trim());
    };

    const handleInlineHourClick = (isUp: boolean) => {
      const limit = format === '12h' ? 12 : 24;

      if (isUp) {
        activeHour === limit ? setActiveHour(1) : setActiveHour(activeHour + 1);
      } else {
        activeHour === 1 ? setActiveHour(limit) : setActiveHour(activeHour - 1);
      }
    };

    const handleInlineMinuteClick = (isUp: boolean) => {
      const limit = increment ? 55 : 59;
      const addend = increment ? 5 : 1;

      if (isUp) {
        activeMinute >= limit ? setActiveMinute(0) : setActiveMinute(activeMinute + addend);
      } else {
        activeMinute <= 0 ? setActiveMinute(limit) : setActiveMinute(activeMinute - addend);
      }
    };

    return inline ? (
      <div
        className='timepicker-head d-flex flex-row align-items-center justify-content-center timepicker-head-inline'
        style={{ paddingRight: '0px' }}
        ref={ref}
        {...props}
      >
        <div className='timepicker-head-content d-flex w-100 justify-content-evenly align-items-center'>
          <div className='timepicker-current-wrapper'>
            <span className='position-relative h-100 timepicker-inline-hour-icons'>
              <MDBIcon
                fas
                icon='chevron-up'
                className='position-absolute text-white timepicker-icon-up timepicker-icon-inline-hour'
                onClick={() => handleInlineHourClick(true)}
              />
              <MDBBtn
                type='button'
                color='none'
                onClick={() => handleClick('hours')}
                className={`timepicker-current timepicker-current-inline timepicker-hour ${
                  mode === 'hours' && 'active'
                }`}
                tabIndex={0}
                style={{ pointerEvents: mode === 'hours' ? 'none' : undefined }}
              >
                {activeHour === 24 ? '00' : activeHour < 10 ? `0${activeHour}` : activeHour}
              </MDBBtn>
              <MDBIcon
                fas
                icon='chevron-down'
                className='position-absolute text-white timepicker-icon-down timepicker-icon-inline-hour'
                onClick={() => handleInlineHourClick(false)}
              />
            </span>
            <MDBBtn color='none' className='timepicker-dot timepicker-current-inline' disabled>
              :
            </MDBBtn>
            <span className='position-relative h-100 timepicker-inline-minutes-icons'>
              <MDBIcon
                fas
                icon='chevron-up'
                className='position-absolute text-white timepicker-icon-up timepicker-icon-inline-minute'
                onClick={() => handleInlineMinuteClick(true)}
              />
              <MDBBtn
                onClick={() => handleClick('minutes')}
                type='button'
                color='none'
                className={`timepicker-current timepicker-current-inline timepicker-minute ${
                  mode === 'minutes' && 'active'
                }`}
                tabIndex={0}
                style={{ pointerEvents: mode === 'minutes' ? 'none' : undefined }}
              >
                {activeMinute < 10 ? `0${activeMinute}` : activeMinute}
              </MDBBtn>
              <MDBIcon
                fas
                icon='chevron-down'
                className='position-absolute text-white timepicker-icon-down timepicker-icon-inline-minute'
                onClick={() => handleInlineMinuteClick(false)}
              />
            </span>
          </div>
          <div className='d-flex justify-content-center timepicker-mode-wrapper'>
            {format === '12h' && (
              <>
                <MDBBtn
                  onClick={() => setPeriod('AM')}
                  type='button'
                  color='none'
                  className={`timepicker-hour-mode timepicker-am me-2 ms-4 ${period === 'AM' && 'active'}`}
                  tabIndex={0}
                >
                  AM
                </MDBBtn>
                <MDBBtn
                  onClick={() => setPeriod('PM')}
                  type='button'
                  color='none'
                  className={`timepicker-hour-mode timepicker-pm ${period === 'PM' && 'active'}`}
                  tabIndex={0}
                >
                  PM
                </MDBBtn>
              </>
            )}
            <MDBBtn
              type='button'
              color='none'
              className='timepicker-button timepicker-submit timepicker-submit-inline py-1 px-2 mb-0'
              tabIndex={0}
              onClick={handleOkClick}
            >
              {submitLabel}
            </MDBBtn>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div
          className='timepicker-head d-flex flex-row align-items-center justify-content-center'
          style={{ paddingRight: '0px' }}
          ref={ref}
          {...props}
        >
          <div
            className='timepicker-head-content d-flex w-100 justify-content-evenly'
            style={{ paddingRight: format === '24h' ? '50px' : '' }}
          >
            <div className='timepicker-current-wrapper'>
              <span className='position-relative h-100'>
                <MDBBtn
                  type='button'
                  color='none'
                  onClick={() => handleClick('hours')}
                  className={`timepicker-current timepicker-hour ${mode === 'hours' && 'active'}`}
                  tabIndex={0}
                  style={{ pointerEvents: mode === 'hours' ? 'none' : undefined }}
                >
                  {activeHour === 24 ? '00' : activeHour < 10 ? `0${activeHour}` : activeHour}
                </MDBBtn>
                <MDBBtn color='none' className='timepicker-dot' disabled>
                  :
                </MDBBtn>
              </span>
              <span className='position-relative h-100'>
                <MDBBtn
                  onClick={() => handleClick('minutes')}
                  type='button'
                  color='none'
                  className={`timepicker-current timepicker-minute ${mode === 'minutes' && 'active'}`}
                  tabIndex={0}
                  style={{ pointerEvents: mode === 'minutes' ? 'none' : undefined }}
                >
                  {activeMinute < 10 ? `0${activeMinute}` : activeMinute}
                </MDBBtn>
              </span>
            </div>
            {format === '12h' && (
              <div className='d-flex flex-column justify-content-center timepicker-mode-wrapper'>
                <MDBBtn
                  onClick={() => setPeriod('AM')}
                  type='button'
                  color='none'
                  className={`timepicker-hour-mode timepicker-am ${period === 'AM' && 'active'}`}
                  tabIndex={0}
                >
                  AM
                </MDBBtn>
                <MDBBtn
                  onClick={() => setPeriod('PM')}
                  type='button'
                  color='none'
                  className={`timepicker-hour-mode timepicker-pm ${period === 'PM' && 'active'}`}
                  tabIndex={0}
                >
                  PM
                </MDBBtn>
              </div>
            )}
          </div>
        </div>
        <div className='buttons-container'>
          <button type='button' className='datepicker-button-toggle' onClick={() => setOpenPicker('date')}>
            <i className='far fa-calendar datepicker-toggle-icon'></i>
          </button>
          <button type='button' className='timepicker-button-toggle' onClick={() => setOpenPicker('time')}>
            <i className='far fa-clock fa-sm timepicker-icon'></i>
          </button>
        </div>
      </>
    );
  }
);

export default MDBTimePickerHeader;
