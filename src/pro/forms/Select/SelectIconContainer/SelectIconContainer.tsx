import clsx from 'clsx';
import React from 'react';
import type { SelectIconContainerProps } from './types';

const MDBSelectIconContainer: React.FC<SelectIconContainerProps> = React.forwardRef(
  ({ className, tag: Tag = 'span', children, ...props }, ref): JSX.Element => {
    const classes = clsx('select-option-icon-container', className);

    return (
      <Tag className={classes} {...props} ref={ref}>
        {children}
      </Tag>
    );
  }
);

export default MDBSelectIconContainer;
