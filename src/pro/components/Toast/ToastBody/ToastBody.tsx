import React from 'react';
import clsx from 'clsx';
import type { ToastBodyProps } from './types';
const MDBToastBody: React.FC<ToastBodyProps> = React.forwardRef<HTMLDivElement, ToastBodyProps>(
  ({ className, children, color, ...props }, ref) => {
    const toastBodyClasses = clsx('toast-body', color && color !== 'light' && 'text-white', className);

    return (
      <div className={toastBodyClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

export default MDBToastBody;
