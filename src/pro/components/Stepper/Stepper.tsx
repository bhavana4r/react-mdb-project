import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import type { StepperProps } from './types';
import { StepperContext } from './StepperContext';
import MDBStepperMobileHead from './StepperMobileHead/StepperMobileHead';
import MDBStepperMobileFooter from './StepperMobileFooter/StepperMobileFooter';

const MDBStepper: React.FC<StepperProps> = ({
  className,
  children,
  defaultStep = 1,
  linear,
  noEditable,
  externalNext,
  externalPrev,
  style,
  type = 'horizontal',
  onChange,
  onInvalid,
  onValid,
  mobileProgress,
  disableHeadSteps,
  mobileOfLabel,
  mobileStepLabel,
  mobileBackLabel,
  mobileNextLabel,
  animations = true,
  ...props
}) => {
  const [activeItem, setActiveItem] = useState(defaultStep);
  const [height, setHeight] = useState(undefined);
  const [completed, setCompleted] = useState<number[]>([]);
  const [validate, setValidate] = useState({ target: 0, after: 0 });
  const [stepsLength, setStepsLength] = useState(0);

  const prevActive = useRef(defaultStep);
  const isAnimating = useRef(false);

  const isMobile = type === 'mobile';

  const classes = clsx(
    'stepper',
    type === 'horizontal' && 'stepper-horizontal',
    type === 'vertical' && 'stepper-vertical',
    isMobile && 'stepper-mobile',
    className
  );
  const styles = { height: clsx(type !== 'vertical' && height && `${height}px`), ...style };

  const stepperRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const goNext = () => {
      setActiveItem((prev) => {
        if (isAnimating.current && prev !== prevActive.current) return prev;

        prevActive.current = prev;
        const after = prev !== stepsLength ? prev + 1 : prev;

        if (linear) {
          setValidate({ target: prev, after });

          return prev;
        }

        return after;
      });
    };

    const nextElement = externalNext?.current;

    if (!nextElement) return;

    nextElement.addEventListener('click', goNext);

    return () => {
      nextElement.removeEventListener('click', goNext);
    };
  }, [externalNext, prevActive, linear, stepsLength]);

  useEffect(() => {
    const goPrev = () => {
      setActiveItem((prev) => {
        if (isAnimating.current && prev !== prevActive.current) return prev;

        prevActive.current = prev;
        const after = prev !== 1 ? prev - 1 : prev;

        if (linear) {
          setValidate({ target: prev, after });

          return prev;
        }

        return after;
      });
    };

    const prevElement = externalPrev?.current;

    if (!prevElement) return;

    prevElement.addEventListener('click', goPrev);

    return () => {
      prevElement.removeEventListener('click', goPrev);
    };
  }, [externalPrev, prevActive, linear]);

  useEffect(() => {
    setCompleted((prevState) => (!prevState.includes(activeItem) ? [...prevState, activeItem] : prevState));

    onChange?.(activeItem);
  }, [activeItem, onChange]);

  useEffect(() => {
    isAnimating.current = true;

    setTimeout(() => {
      isAnimating.current = false;
    }, 500);
  }, [activeItem]);

  useEffect(() => {
    const stepperElement = stepperRef.current;

    if (!stepperElement) return;

    const length = stepperElement.querySelectorAll('li').length;

    setStepsLength(length);
  }, []);

  return (
    <ul ref={stepperRef} className={classes} {...props} style={styles}>
      <StepperContext.Provider
        value={{
          activeItem,
          setActiveItem,
          prevActive,
          setHeight,
          completed,
          noEditable,
          isAnimating,
          linear,
          formRef,
          validate,
          setValidate,
          type,
          stepsLength,
          onValid,
          onInvalid,
          mobileProgress,
          disableHeadSteps,
          animations,
        }}
      >
        {isMobile && <MDBStepperMobileHead ofLabel={mobileOfLabel} stepLabel={mobileStepLabel} />}
        {children}
        {isMobile && (
          <MDBStepperMobileFooter
            backLabel={mobileBackLabel}
            nextLabel={mobileNextLabel}
            mobileProgress={mobileProgress}
          />
        )}
      </StepperContext.Provider>
    </ul>
  );
};

export default MDBStepper;
