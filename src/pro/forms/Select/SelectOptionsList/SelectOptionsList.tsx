import clsx from 'clsx';
import React from 'react';
import type { SelectOptionsListProps } from './types';

const MDBSelectOptionsList: React.FC<SelectOptionsListProps> = React.forwardRef(
  ({ className, tag: Tag = 'div', children, ...props }, ref): JSX.Element => {
    const classes = clsx('select-options-list', className);

    return (
      <Tag className={classes} {...props} ref={ref}>
        {children}
      </Tag>
    );
  }
);

export default MDBSelectOptionsList;
