import clsx from 'clsx';
import React from 'react';
import type { SelectOptionIconProps } from './types';

const MDBSelectOptionIcon: React.FC<SelectOptionIconProps> = React.forwardRef(
  ({ className, tag: Tag = 'img', children, ...props }, ref): JSX.Element => {
    const classes = clsx('select-option-icon', className);

    return (
      <Tag className={classes} {...props} ref={ref}>
        {children}
      </Tag>
    );
  }
);

export default MDBSelectOptionIcon;
