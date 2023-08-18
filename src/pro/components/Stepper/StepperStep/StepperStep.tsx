import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StepperContext } from '../StepperContext';
import useStepHeight from '../utils/useStepHeight/useStepHeight';
import { checkValidStep } from '../utils/utils';
import MDBStepperContent from './StepperContent/StepperContent';
import MDBStepperVerticalContent from './StepperVerticalContent/StepperVerticalContent';
import type { StepperStepProps } from './types';

const MDBStepperStep: React.FC<StepperStepProps> = ({
  className,
  itemId,
  children,
  headIcon,
  headText,
  customValidation,
  headClassName,
  contentClassName,
  headStyle,
  contentStyle,
  ...props
}) => {
  const {
    activeItem,
    setActiveItem,
    setHeight,
    prevActive,
    completed,
    noEditable,
    linear,
    formRef,
    validate,
    setValidate,
    type,
    onInvalid,
    onValid,
    mobileProgress,
    isAnimating,
    disableHeadSteps,
  } = useContext(StepperContext);

  const [isValidated, setIsValidated] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const isCompleted = completed.includes(itemId);
  const isActive = activeItem === itemId;
  const isDisabled = noEditable && isCompleted && !isActive;
  const wasValidated = linear && isValidated;
  const classes = clsx(
    'stepper-step',
    isActive && 'stepper-active',
    isCompleted && 'stepper-completed',
    isDisabled && 'stepper-disabled',
    wasValidated && 'was-validated',
    isInvalid && 'stepper-invalid',
    className
  );
  const headClasses = clsx('stepper-head', headClassName);
  const stepRef = useRef<HTMLLIElement>(null);

  const headStyles: React.CSSProperties = { cursor: clsx(disableHeadSteps && 'auto'), ...headStyle };

  useStepHeight({ stepRef, setHeight, isActive, isValidated, isMobile: type === 'mobile', children });

  const changeStep = () => {
    const isStepAnimating = isAnimating.current && type !== 'vertical' && activeItem !== prevActive.current;
    const shouldNotChange = isDisabled || isActive || disableHeadSteps || isStepAnimating;

    if (shouldNotChange) return;

    if (linear) {
      setValidate({ target: activeItem, after: itemId });

      return;
    }

    prevActive.current = activeItem;
    setActiveItem(itemId);
  };

  useEffect(() => {
    const { target, after } = validate;

    if (itemId === target && linear) {
      if (after < target) {
        prevActive.current = target;
        setActiveItem(after);

        return;
      }

      const stepElement = stepRef.current as HTMLLIElement;
      const formElement: HTMLFormElement = formRef.current;

      formElement?.classList.add('was-validated');

      const isValid = checkValidStep(stepElement, customValidation);

      setIsValidated(true);
      setIsInvalid(!isValid);

      if (isValid) {
        onValid?.(itemId);
        formElement?.classList.remove('was-validated');
        prevActive.current = target;

        setActiveItem(after);
      } else {
        onInvalid?.(itemId);
      }
    }
  }, [validate, itemId, formRef, linear, setActiveItem, prevActive, onValid, onInvalid, customValidation]);

  return (
    <li ref={stepRef} className={classes} {...props}>
      {!mobileProgress && (
        <div className={headClasses} tabIndex={isActive ? 0 : -1} onClick={changeStep} style={headStyles}>
          <span className='stepper-head-icon'>{headIcon}</span>
          <span className='stepper-head-text'>{headText}</span>
        </div>
      )}

      {type === 'vertical' ? (
        <MDBStepperVerticalContent
          style={contentStyle}
          className={contentClassName}
          isValidated={isValidated}
          itemId={itemId}
        >
          {children}
        </MDBStepperVerticalContent>
      ) : (
        <MDBStepperContent style={contentStyle} className={contentClassName} itemId={itemId}>
          {children}
        </MDBStepperContent>
      )}
    </li>
  );
};

export default MDBStepperStep;
