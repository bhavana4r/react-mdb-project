// import clsx from 'clsx';
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import type { TimePickerClockProps } from './types';
import { TimePickerContext } from '../context';
import clockData from './clockData';
import { isDisabled, multiOn, multiOff, calculateAngle, getCircleGeometry, euclidean } from '../utils';

const MDBTimePickerClock: React.FC<TimePickerClockProps> = React.forwardRef<HTMLDivElement, TimePickerClockProps>(
  ({ ...props }, ref) => {
    const clockRef = useRef<HTMLDivElement>(null);
    const innerClockRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [outerClockSize, setOuterClockSize] = useState(0);
    const [innerClockSize, setInnerClockSize] = useState(0);
    const {
      setActiveHour,
      format,
      activeHour,
      minHour,
      maxHour,
      minPeriod,
      maxPeriod,
      period,
      mode,
      setMode,
      activeMinute,
      setActiveMinute,
      setHandAnimation,
      handAnimation,
      maxMinute,
      minMinute,
      hourAngle,
      setHourAngle,
      minuteAngle,
      setMinuteAngle,
      increment,
    } = useContext(TimePickerContext);
    const hours =
      format === '24h' ? clockData.hours : clockData.hours.filter((hour) => hour.value < 13 && hour.value !== 0);

    const minutes = clockData.minutes;

    const [pointerHeight, setPointerHeight] = useState('calc(40% + 1px)');

    const angle = useCallback(calculateAngle, []);

    const onMouseDown = (e: any) => {
      e.preventDefault();

      setIsDragging(true);
    };

    const onMouseUp = (e: any) => {
      e.preventDefault();

      setIsDragging(false);

      if (mode === 'hours') {
        setMode('minutes');
        setHandAnimation(true);
      }
    };

    const handleDrag = useCallback(
      (e: any) => {
        const { width, top, left } = clockRef.current?.getBoundingClientRect() as DOMRect;
        const { clientX, clientY } = 'touches' in e ? e.touches[0] : e;
        const center = { x: width / 2, y: -width / 2 };
        const coords = { x: clientX - left, y: top - clientY };
        const handAngle = Math.round(angle(center, coords) + 360) % 360;

        if (mode === 'hours') {
          const newAngle = 30 * Math.round(handAngle / 30);
          let newValue = newAngle / 30;

          if (format === '24h') {
            const { radius: outerRadius } = getCircleGeometry(outerClockSize);
            const { radius: innerRadius } = getCircleGeometry(innerClockSize);

            if (euclidean(center, coords) < (outerRadius + innerRadius) / 2 - 16) {
              newValue += 12;
            }
          }

          if (!isDisabled(newValue, maxHour, minHour, period, maxPeriod, minPeriod)) {
            setActiveHour(newValue);
            setHourAngle(newAngle);
          }
        } else {
          if (handAngle === 0) {
            if (!isDisabled(0, maxMinute, minMinute, period, maxPeriod, minPeriod)) {
              setActiveMinute(0);
              setMinuteAngle(360);
            }
          } else {
            const factor = increment ? 30 : 6;
            const newValue = factor * Math.round(handAngle / factor);

            if (!isDisabled(newValue / 6, maxMinute, minMinute, period, maxPeriod, minPeriod)) {
              setActiveMinute(newValue / 6);
              setMinuteAngle(newValue);
            }
          }
        }
      },
      [
        angle,
        maxMinute,
        minMinute,
        maxPeriod,
        minPeriod,
        mode,
        period,
        setActiveMinute,
        maxHour,
        minHour,
        setActiveHour,
        innerClockSize,
        outerClockSize,
        format,
        setHourAngle,
        setMinuteAngle,
        increment,
      ]
    );

    useEffect(() => {
      if (clockRef.current) {
        setOuterClockSize(clockRef.current.offsetWidth);
      }

      if (innerClockRef.current) {
        setInnerClockSize(innerClockRef.current.offsetWidth);
      }
    }, []);

    useEffect(() => {
      if (isDragging) {
        multiOn(document, 'mouseup mousemove mouseleave mouseover touchstart touchmove touchend', handleDrag);
      }
      return () => {
        multiOff(document, 'mouseup mousemove mouseleave mouseover touchstart touchmove touchend', handleDrag);
      };
    }, [isDragging, handleDrag]);

    useEffect(() => {
      const active = hours.find((hours) => hours.value === activeHour);

      active !== undefined &&
        (active.value > 12 || active.value === 24 ? setPointerHeight('21.5%') : setPointerHeight('calc(40% + 1px)'));
    }, [hours, activeHour]);

    return (
      <div
        className='timepicker-clock-wrapper d-flex justify-content-center flex-column align-items-center'
        ref={ref}
        {...props}
      >
        <div
          onMouseDown={(e: any) => onMouseDown(e)}
          onMouseUp={(e: any) => onMouseUp(e)}
          ref={clockRef}
          className='timepicker-clock timepicker-clock-animation'
        >
          <span className='timepicker-middle-dot position-absolute'></span>
          <div
            className={`timepicker-hand-pointer position-absolute ${handAnimation && 'timepicker-transform'}`}
            style={{
              transform: `rotateZ(${mode === 'hours' ? hourAngle : minuteAngle}deg)`,
              height: mode === 'hours' ? pointerHeight : 'calc(40% + 1px)',
            }}
          >
            <div className='timepicker-circle position-absolute' style={{ backgroundColor: 'rgb(25, 118, 210)' }}></div>
          </div>
          {mode === 'hours' && format === '24h' && (
            <div ref={innerClockRef} className='timepicker-clock-inner'>
              {hours.map((hour) => {
                if (hour.value > 12 || hour.value === 0) {
                  return (
                    <span
                      id={hour.id}
                      key={hour.id}
                      className={`timepicker-time-tips-inner ${
                        isDisabled(hour.value, maxHour, minHour, period, maxPeriod, minPeriod) && 'disabled'
                      } ${hour.value === activeHour && 'active'}`}
                      style={{ left: hour.left, bottom: hour.bottom }}
                    >
                      <span className='timepicker-tips-inner-element'>{hour.value === 24 ? '00' : hour.value}</span>
                    </span>
                  );
                }
              })}
            </div>
          )}
          {mode === 'hours' &&
            hours.map((hour) => {
              if (format === '24h') {
                if (hour.value < 13 && hour.value !== 0) {
                  return (
                    <span
                      id={hour.id}
                      key={hour.id}
                      className={`timepicker-time-tips-hours ${
                        isDisabled(hour.value, maxHour, minHour, period, maxPeriod, minPeriod) && 'disabled'
                      } ${hour.value === activeHour && 'active'}`}
                      style={{ left: hour.left, bottom: hour.bottom }}
                    >
                      <span className='timepicker-tips-element'>{hour.value}</span>
                    </span>
                  );
                }
              } else {
                return (
                  <span
                    id={hour.id}
                    key={hour.id}
                    className={`timepicker-time-tips-hours ${
                      isDisabled(hour.value, maxHour, minHour, period, maxPeriod, minPeriod) && 'disabled'
                    } ${hour.value === activeHour && 'active'}`}
                    style={{ left: hour.left, bottom: hour.bottom }}
                  >
                    <span className='timepicker-tips-element'>{hour.value}</span>
                  </span>
                );
              }
            })}
          {mode === 'minutes' &&
            minutes.map((minute) => {
              return (
                <span
                  id={minute.id}
                  key={minute.id}
                  className={`timepicker-time-tips-minutes ${
                    isDisabled(minute.value, maxMinute, minMinute, period, maxPeriod, minPeriod) && 'disabled'
                  } ${activeMinute === minute.value && 'active'}`}
                  style={{ left: minute.left, bottom: minute.bottom }}
                >
                  <span className='timepicker-tips-element'>
                    {minute.value < 10 ? `0${minute.value}` : minute.value}
                  </span>
                </span>
              );
            })}
        </div>
      </div>
    );
  }
);

export default MDBTimePickerClock;
