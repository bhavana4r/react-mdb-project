import React from 'react';

interface TimepickerModalProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  isOpen: boolean;
  isReadyToHide: boolean;
  wrapperRef: React.RefObject<HTMLDivElement>;
  referenceElement: HTMLDivElement | null;
}

export { TimepickerModalProps };
