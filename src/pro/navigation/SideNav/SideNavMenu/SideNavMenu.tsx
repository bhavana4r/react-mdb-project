import clsx from 'clsx';
import React from 'react';
import type { SideNavMenuProps } from './types';

const MDBSideNavMenu: React.FC<SideNavMenuProps> = React.forwardRef<HTMLUListElement, SideNavMenuProps>(
  ({ className, children, ...props }, ref) => {
    const classes = clsx('sidenav-menu', className);

    return (
      <ul className={classes} ref={ref} {...props}>
        {children}
      </ul>
    );
  }
);

export default MDBSideNavMenu;
