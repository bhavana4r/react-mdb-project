import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import type { SideNavCollapseProps } from './types';
import MDBCollapse from '../../../../free/components/Collapse/Collapse.tsx';

const MDBSideNavCollapse: React.FC<SideNavCollapseProps> = ({ className, children, show, collapseRef, ...props }) => {
  const sidenavCollapseEl = useRef(null);
  const sidenavCollapseReference = collapseRef ? collapseRef : sidenavCollapseEl;

  const classes = clsx('sidenav-collapse', className);

  useEffect(() => {
    const childLinks = sidenavCollapseReference?.current?.querySelectorAll('.sidenav-link');
    const newTabIndex = show ? '1' : '-1';

    childLinks?.forEach((child: any) => {
      child.setAttribute('tabindex', newTabIndex);
    });
  }, [show, sidenavCollapseReference]);

  return (
    <MDBCollapse tag='ul' show={show} className={classes} collapseRef={sidenavCollapseReference} {...props}>
      {children}
    </MDBCollapse>
  );
};

export default MDBSideNavCollapse;
