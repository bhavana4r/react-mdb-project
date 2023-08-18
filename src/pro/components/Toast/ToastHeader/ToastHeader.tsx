import React from 'react';
import clsx from 'clsx';
import type { ToastHeaderProps } from './types';
const MDBToastHeader: React.FC<ToastHeaderProps> = React.forwardRef<HTMLDivElement, ToastHeaderProps>(
  ({ className, color, children, ...props }, ref) => {
    const toastHeaderClasses = clsx(
      'toast-header',
      color && `bg-${color}`,
      color && color !== 'light' && 'text-white',
      className
    );

    return (
      <div className={toastHeaderClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

export default MDBToastHeader;
