import React, { useContext } from 'react';
import { StepperContext } from '../StepperContext';
import { StepperMobileFooterProps } from './types';
import MDBBtn from '../../../../free/components/Button/Button';
import MDBIcon from '../../../../free/styles/Icon/Icon';

const MDBStepperMobileFooter: React.FC<StepperMobileFooterProps> = ({
  mobileProgress,
  backLabel = 'BACK',
  nextLabel = 'NEXT',
}) => {
  const { activeItem, setActiveItem, prevActive, isAnimating, stepsLength } = useContext(StepperContext);

  const goNext = () => {
    if (isAnimating.current && activeItem !== prevActive.current) return;

    prevActive.current = activeItem;

    const newActive = activeItem !== stepsLength ? activeItem + 1 : activeItem;

    setActiveItem(newActive);
  };

  const goPrev = () => {
    if (isAnimating.current && activeItem !== prevActive.current) return;

    prevActive.current = activeItem;

    const newActive = activeItem !== 1 ? activeItem - 1 : activeItem;

    setActiveItem(newActive);
  };

  return (
    <div className='stepper-mobile-footer bg-light'>
      <div className='stepper-back-btn'>
        <MDBBtn color='link' onClick={goPrev}>
          <MDBIcon fas icon='chevron-left' />
          {backLabel}
        </MDBBtn>
      </div>

      {mobileProgress && (
        <div className='stepper-mobile-progress gray-500'>
          <div
            className='stepper-mobile-progress-bar bg-primary'
            style={{ width: `${(activeItem / stepsLength) * 100}%` }}
          ></div>
        </div>
      )}

      <div className='stepper-next-btn'>
        <MDBBtn color='link' onClick={goNext}>
          {nextLabel}
          <MDBIcon fas icon='chevron-right' />
        </MDBBtn>
      </div>
    </div>
  );
};

export default MDBStepperMobileFooter;
