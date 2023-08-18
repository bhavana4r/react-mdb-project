import clsx from 'clsx';
import React, { useState, useEffect, useContext } from 'react';
import type { SideNavLinkProps } from './types';
import  SideNavContext  from '../context.tsx';
import MDBIcon from '../../../../free/styles/Icon/Icon.tsx';
import MDBRipple from '../../../../free/methods/Ripple/Ripple.tsx';

const MDBSideNavLink: React.FC<SideNavLinkProps> = React.forwardRef<HTMLAnchorElement, SideNavLinkProps>(
  ({ className, icon, iconClasses, iconAngle = 180, shouldBeExpanded, children, active, tag = 'a', ...props }, ref) => {
    const { color } = useContext(SideNavContext);

    const classes = clsx('sidenav-link', active && 'active', className);
    const iconClass = clsx('rotate-icon', iconClasses);

    const [angle, setAngle] = useState(shouldBeExpanded ? iconAngle : 0);

    useEffect(() => {
      setAngle(shouldBeExpanded ? iconAngle : 0);
    }, [shouldBeExpanded, iconAngle]);

    return (
      <MDBRipple
        rippleTag={tag}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter') {
            e.target.click();
          }
        }}
        tabIndex={1}
        rippleColor={color}
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
        {icon && <MDBIcon icon={icon} style={{ transform: `rotate(${angle}deg)` }} className={iconClass} />}
      </MDBRipple>
    );
  }
);

export default MDBSideNavLink;
