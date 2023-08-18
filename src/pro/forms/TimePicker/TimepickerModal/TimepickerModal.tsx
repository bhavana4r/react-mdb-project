import clsx from 'clsx';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import type { TimepickerModalProps } from './types';
import MDBTimePickerHeader from '../TimePickerHeader/TimePickerHeader';
import MDBTimePickerClock from '../TimePickerClock/TimePickerClock';
import MDBTimePickerFooter from '../TimePickerFooter/TimePickerFooter';

const MDBTimepickerModal: React.FC<TimepickerModalProps> = ({
  className,
  isOpen,
  isReadyToHide,
  wrapperRef,
  inline,
  referenceElement,
}) => {
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const pickerClasses = clsx('timepicker-modal', 'animation', 'fade-in', className);

  const pickerWrapperClasses = clsx(
    'timepicker-wrapper',
    'h-100',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-column',
    inline ? 'timepicker-wrapper-inline' : 'position-fixed',
    'fade',
    isReadyToHide && isOpen && 'show'
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });

  return (
    <>
      {(isOpen || isReadyToHide) &&
        createPortal(
          inline ? (
            <div
              className={pickerClasses}
              style={styles.popper}
              {...attributes.popper}
              role='dialog'
              ref={setPopperElement}
              tabIndex={-1}
            >
              <div ref={wrapperRef} className={pickerWrapperClasses}>
                <div
                  className='d-flex align-items-center justify-content-center flex-column shadow timepicker-container'
                  style={{ overflowY: 'inherit' }}
                >
                  <div className='d-flex flex-column timepicker-elements justify-content-around timepicker-elements-inline'>
                    <MDBTimePickerHeader />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={pickerClasses} role='dialog' tabIndex={-1}>
              <div ref={wrapperRef} className={pickerWrapperClasses}>
                <div className='d-flex align-items-center justify-content-center flex-column shadow timepicker-container'>
                  <div className='d-flex flex-column timepicker-elements justify-content-around'>
                    <MDBTimePickerHeader />
                    <MDBTimePickerClock />
                  </div>
                  <MDBTimePickerFooter />
                </div>
              </div>
            </div>
          ),
          document.body
        )}
    </>
  );
};

export default MDBTimepickerModal;
