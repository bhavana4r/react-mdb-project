import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StepperContext } from '../../StepperContext';
import useVerticalStepHeight from '../../utils/useVerticalStepHeight/useVerticalStepHeight';
import type { StepperVerticalContentProps } from './types';

const MDBStepperVerticalContent: React.FC<StepperVerticalContentProps> = ({
  itemId,
  children,
  className,
  isValidated,
  style,
}) => {
  const { activeItem } = useContext(StepperContext);

  const [show, setShow] = useState(true);

  const classes = clsx('stepper-content', 'py-3', !show && 'stepper-content-hide', className);

  const stepRef = useRef<HTMLDivElement>(null);

  useVerticalStepHeight({ stepRef, show, isValidated });

  useEffect(() => {
    setShow(itemId === activeItem);
  }, [itemId, activeItem]);

  return (
    <div style={style} className={classes} ref={stepRef}>
      <span>{children}</span>
    </div>
  );
};

export default MDBStepperVerticalContent;
