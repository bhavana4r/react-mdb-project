import clsx from 'clsx';
import React, { useState, useEffect, ChangeEvent, CSSProperties } from 'react';
import type { MultiRangeProps } from './types';
import MDBRange from '../../../free/forms/Range/Range';

const MDBMultiRange: React.FC<MultiRangeProps> = ({
  className,
  defaultValues = { first: 0, second: 100 },
  getValues,
  min = 0,
  max = 100,
  step = '1',
  tooltips,
  ...props
}) => {
  const [values, setValues] = useState({ first: defaultValues?.first, second: defaultValues?.second });
  const [defaultValueFirst, setDefaultValueFirst] = useState(defaultValues?.first);
  const [defaultValueSecond, setDefaultValueSecond] = useState(defaultValues?.second);

  const classes = clsx('multi-range', className);

  const [style, setStyle] = useState<CSSProperties>({ zIndex: 'auto' });

  const { first, second } = values;

  const handleChangeFirst = (e: ChangeEvent<HTMLInputElement>) => {
    const eventValue = Number(e.target.value);
    const inputValue = Number(second);

    eventValue === inputValue ? setStyle({ zIndex: 1 }) : setStyle({ zIndex: 'auto' });

    if (eventValue > inputValue) return;

    setValues({ ...values, first: eventValue });
  };

  const handleChangeSecond = (e: ChangeEvent<HTMLInputElement>) => {
    const eventValue = Number(e.target.value);
    const inputValue = Number(first);

    if (eventValue < inputValue) return;

    setValues({ ...values, second: eventValue });
  };

  useEffect(() => {
    getValues && getValues(values);
  }, [values, getValues]);

  useEffect(() => {
    setDefaultValueFirst(defaultValues?.first);
    setDefaultValueSecond(defaultValues?.second);
  }, [defaultValues]);

  useEffect(() => {
    if (defaultValueFirst) {
      setValues((values) => {
        return { ...values, first: defaultValueFirst };
      });
    }
  }, [defaultValueFirst]);

  useEffect(() => {
    if (defaultValueSecond) {
      setValues((values) => {
        return { ...values, second: defaultValueSecond };
      });
    }
  }, [defaultValueSecond]);

  return (
    <div className={classes} {...props}>
      <MDBRange
        value={first}
        onChange={handleChangeFirst}
        min={min}
        max={max}
        step={step}
        disableTooltip={!tooltips}
        style={style}
      />
      <MDBRange
        value={second}
        onChange={handleChangeSecond}
        min={min}
        max={max}
        step={step}
        className='multi-range-slider-second'
        disableTooltip={!tooltips}
      />
    </div>
  );
};

export default MDBMultiRange;
