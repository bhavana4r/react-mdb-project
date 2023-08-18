import clsx from 'clsx';
import React from 'react';
import type { SideNavItemProps } from './types';

const MDBSideNavItem: React.FC<SideNavItemProps> = React.forwardRef<HTMLLIElement, SideNavItemProps>(
  ({ className, children, ...props }, ref) => {
    const classes = clsx('sidenav-item', className);

    return (
      <li className={classes} ref={ref} {...props}>
        {children}
      </li>
    );
  }
);

export default MDBSideNavItem;
