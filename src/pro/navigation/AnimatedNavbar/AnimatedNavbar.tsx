import React, { useCallback, useEffect, useState } from 'react';
import type { AnimatedNavbarProps } from './types';
import MDBNavbar from '../../../free/navigation/Navbar/Navbar';
import clsx from 'clsx';

const MDBAnimatedNavbar: React.FC<AnimatedNavbarProps> = React.forwardRef<HTMLAllCollection, AnimatedNavbarProps>(
  ({ className, ...props }, ref) => {
    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = useCallback(() => {
      const documentScroll = document.documentElement.scrollTop;

      if (documentScroll) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, []);

    const clases = clsx(isScrolled && 'navbar-scrolled', 'navbar-scroll', className);

    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return <MDBNavbar className={clases} ref={ref} {...props} />;
  }
);

export default MDBAnimatedNavbar;
