import React, { useContext } from 'react';

import { StepperMobileHeadProps } from './types';

import { StepperContext } from '../StepperContext';

const MDBStepperMobileHead: React.FC<StepperMobileHeadProps> = ({ ofLabel = 'of', stepLabel = 'step' }) => {
  const { activeItem, stepsLength } = useContext(StepperContext);

  return (
    <div className='stepper-mobile-head bg-light'>
      {stepLabel} {activeItem} {ofLabel} {stepsLength}
    </div>
  );
};

export default MDBStepperMobileHead;
