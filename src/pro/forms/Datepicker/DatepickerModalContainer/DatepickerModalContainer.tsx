import clsx from 'clsx';
import React from 'react';
import MDBAnimation from '../../../styles/Animation/Animation';
import { DatepickerModalContainerProps } from './types';

const MDBDatepickerModalContainer: React.FC<DatepickerModalContainerProps> = ({
  className,
  dropdown,
  children,
  isOpen,
  styles,
  attributes,
  setPopperElement,
  style,
}) => {
  const dropdownClasses = clsx(
    'datepicker-dropdown-container',
    isOpen ? 'fade-out' : 'fade-in',
    'animation',
    className
  );

  const modalClasses = clsx('datepicker-modal-container', className);

  return (
    <>
      {dropdown ? (
        <div
          style={{ position: 'absolute', zIndex: 1065, ...styles.popper, animationDuration: '300ms' }}
          {...attributes.popper}
          ref={setPopperElement as any}
          className={dropdownClasses}
          tabIndex={-1}
        >
          {children}
        </div>
      ) : (
        <MDBAnimation
          tag='div'
          start='onLoad'
          animation={isOpen ? 'fade-out' : 'fade-in'}
          className={modalClasses}
          duration={300}
          style={style}
        >
          {children}
        </MDBAnimation>
      )}
    </>
  );
};

export default MDBDatepickerModalContainer;
