import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import MDBAnimation from '../../../../styles/Animation/Animation';
import { StepperContext } from '../../StepperContext';
import { getAnimation } from '../../utils/utils';
import type { StepperContentProps } from './types';

const MDBStepperContent: React.FC<StepperContentProps> = ({ itemId, children, className, style }) => {
  const { activeItem, prevActive, animations } = useContext(StepperContext);

  const [show, setShow] = useState(itemId === activeItem);
  const [hiding, setHiding] = useState(false);

  const classes = clsx('stepper-content', 'py-3', !show && 'stepper-content-hide', className);
  const animation = getAnimation(hiding, prevActive.current, activeItem);
  const isVisible = animations ? show || hiding : show;
  const contentStyle = { display: isVisible ? 'block' : 'none', ...style };

  useEffect(() => {
    const { current } = prevActive;

    if (itemId === current) {
      setHiding(true);

      setTimeout(() => {
        setHiding(false);
      }, 800);
    }
  }, [itemId, prevActive, activeItem]);

  useEffect(() => {
    setShow(itemId === activeItem);
  }, [itemId, activeItem]);

  return (
    <MDBAnimation className={classes} start='onLoad' animation={animation} duration={800} style={contentStyle}>
      <span>{children}</span>
    </MDBAnimation>
  );
};

export default MDBStepperContent;
