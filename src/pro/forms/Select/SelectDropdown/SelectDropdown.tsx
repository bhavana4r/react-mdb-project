import clsx from 'clsx';
import React from 'react';
import type { SelectDropdownProps } from './types';

const MDBSelectDropdown: React.FC<SelectDropdownProps> = React.forwardRef<HTMLElement, SelectDropdownProps>(
  ({ className, open, tag: Tag = 'div', children, ...props }, ref): JSX.Element => {
    const classes = clsx('select-dropdown', open && 'open', className);

    return (
      <Tag className={classes} {...props} ref={ref}>
        {children}
      </Tag>
    );
  }
);

export default MDBSelectDropdown;
