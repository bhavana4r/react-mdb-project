import clsx from 'clsx';
import React, { useContext } from 'react';
import type { StepperFormProps } from './types';
import MDBValidation from '../../../../free/forms/Validation/Validation';
import { StepperContext } from '../StepperContext';

const MDBStepperForm: React.FC<StepperFormProps> = ({ className, children, onSubmit, ...props }) => {
  const { formRef, setValidate, activeItem } = useContext(StepperContext);

  const classes = clsx('stepper-form', className);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setValidate({ target: activeItem, after: activeItem });

    onSubmit?.(e);
  };

  return (
    <MDBValidation onSubmit={handleSubmit} ref={formRef} className={classes} {...props} noValidate>
      {children}
    </MDBValidation>
  );
};

export default MDBStepperForm;
