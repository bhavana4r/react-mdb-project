// import clsx from 'clsx';
import React, { useContext } from 'react';
import type { TimePickerHeaderProps } from './types';
import MDBBtn from '../../../../free/components/Button/Button';
import MDBIcon from '../../../../free/styles/Icon/Icon';
import { TimePickerContext } from '../context';
import { isDisabled } from '../utils';

const MDBTimePickerHeader: React.FC<TimePickerHeaderProps> = React.forwardRef<HTMLDivElement, TimePickerHeaderProps>(
  ({ ...props }, ref) => {
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
      setInputValue,
      setIsPickerOpened,
      increment,
      submitLabel,
      onChange,
      amLabel,
      pmLabel,
      headId,
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

      const newHour = activeHour === 24 ? '00' : activeHour < 10 ? `0${activeHour}` : activeHour;
      const newMinute = activeMinute < 10 ? `0${activeMinute}` : activeMinute;
      const newValue = `${newHour}:${newMinute} ${period}`.trim();
      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleInlineHourClick = (isUp: boolean, e: React.MouseEvent) => {
      const limit = format === '12h' ? 12 : 24;

      if (e.type === 'click') {
        return isUp
          ? setActiveHour((currHour: number) => (currHour === limit ? 1 : currHour + 1))
          : setActiveHour((currHour: number) => (currHour === 1 ? limit : currHour - 1));
      }

      if (e.type === 'mousedown') {
        const timeout = setTimeout(() => {
          const interval = setInterval(() => {
            isUp
              ? setActiveHour((currHour: number) => (currHour === limit ? 1 : currHour + 1))
              : setActiveHour((currHour: number) => (currHour === 1 ? limit : currHour - 1));
          }, 100);

          const stopInterval = () => {
            clearInterval(interval);
            document.removeEventListener('mouseup', stopInterval);
          };

          document.addEventListener('mouseup', stopInterval);
        }, 300);

        const stopTimer = () => {
          clearTimeout(timeout);
          document.removeEventListener('mouseup', stopTimer);
        };

        document.addEventListener('mouseup', stopTimer);
      }
    };

    const handleInlineMinuteClick = (isUp: boolean, e: React.MouseEvent) => {
      const limit = increment ? 55 : 59;
      const minutesToAdd = increment ? 5 : 1;

      if (e.type === 'click') {
        return isUp
          ? setActiveMinute((currMinute: number) => (currMinute >= limit ? 0 : currMinute + minutesToAdd))
          : setActiveMinute((currMinute: number) =>
              currMinute - minutesToAdd < 0 ? limit : currMinute - minutesToAdd
            );
      }

      if (e.type === 'mousedown') {
        const timeout = setTimeout(() => {
          const interval = setInterval(() => {
            isUp
              ? setActiveMinute((currMinute: number) => (currMinute >= limit ? 0 : currMinute + minutesToAdd))
              : setActiveMinute((currMinute: number) =>
                  currMinute - minutesToAdd < 0 ? limit : currMinute - minutesToAdd
                );
          }, 100);

          const stopInterval = () => {
            clearInterval(interval);
            document.removeEventListener('mouseup', stopInterval);
          };

          document.addEventListener('mouseup', stopInterval);
        }, 300);

        const stopTimer = () => {
          clearTimeout(timeout);
          document.removeEventListener('mouseup', stopTimer);
        };

        document.addEventListener('mouseup', stopTimer);
      }
    };

    return inline ? (
      <div
        id={headId}
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
                style={{ display: 'flex' }}
                className='position-absolute text-white timepicker-icon-up timepicker-icon-inline-hour'
                onClick={(e: React.MouseEvent) => handleInlineHourClick(true, e)}
                onMouseDown={(e: React.MouseEvent) => handleInlineHourClick(true, e)}
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
                style={{ display: 'flex' }}
                className='position-absolute text-white timepicker-icon-down timepicker-icon-inline-hour'
                onClick={(e: React.MouseEvent) => handleInlineHourClick(false, e)}
                onMouseDown={(e: React.MouseEvent) => handleInlineHourClick(false, e)}
              />
            </span>
            <MDBBtn color='none' className='timepicker-dot timepicker-current-inline' disabled>
              :
            </MDBBtn>
            <span className='position-relative h-100 timepicker-inline-minutes-icons'>
              <MDBIcon
                fas
                icon='chevron-up'
                style={{ display: 'flex' }}
                className='position-absolute text-white timepicker-icon-up timepicker-icon-inline-minute'
                onClick={(e: React.MouseEvent) => handleInlineMinuteClick(true, e)}
                onMouseDown={(e: React.MouseEvent) => handleInlineMinuteClick(true, e)}
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
                style={{ display: 'flex' }}
                className='position-absolute text-white timepicker-icon-down timepicker-icon-inline-minute'
                onClick={(e: React.MouseEvent) => handleInlineMinuteClick(false, e)}
                onMouseDown={(e: React.MouseEvent) => handleInlineMinuteClick(false, e)}
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
                  {amLabel}
                </MDBBtn>
                <MDBBtn
                  onClick={() => setPeriod('PM')}
                  type='button'
                  color='none'
                  className={`timepicker-hour-mode timepicker-pm ${period === 'PM' && 'active'}`}
                  tabIndex={0}
                >
                  {pmLabel}
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
      <div
        id={headId}
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
                {amLabel}
              </MDBBtn>
              <MDBBtn
                onClick={() => setPeriod('PM')}
                type='button'
                color='none'
                className={`timepicker-hour-mode timepicker-pm ${period === 'PM' && 'active'}`}
                tabIndex={0}
              >
                {pmLabel}
              </MDBBtn>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MDBTimePickerHeader;
