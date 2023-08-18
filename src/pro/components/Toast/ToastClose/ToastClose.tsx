import React from 'react';
import clsx from 'clsx';
import type { ToastCloseProps } from './types';
import MDBBtn from '../../../../free/components/Button/Button';

const MDBToastClose: React.FC<ToastCloseProps> = React.forwardRef<HTMLAllCollection, ToastCloseProps>(
  ({ className, white, children, ...props }, ref) => {
    const toastCloseClasses = clsx('btn-close', white && 'btn-close-white', className);

    return (
      <MDBBtn className={toastCloseClasses} color='none' ref={ref} {...props}>
        {children}
      </MDBBtn>
    );
  }
);

export default MDBToastClose;
