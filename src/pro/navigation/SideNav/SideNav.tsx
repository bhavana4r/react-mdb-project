// @tsx-ignore
import clsx from 'clsx';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { SideNavProps } from './types';
import MDBScrollbar from '../../methods/PerfectScrollbar/PerfectScrollbar.tsx';
import MDBTouch from '../../methods/Touch/Touch.tsx';
import SideNavContext from './context.tsx'

const MDBSideNav = ({
  className,
  isOpen = true,
  getOpenState,
  children,
  color = 'primary',
  backdrop = true,
  slim,
  slimCollapsed = true,
  constant = false,
  bgColor,
  right,
  relative,
  absolute,
  light,
  mode = 'over',
  contentRef,
  closeOnEsc = true,
  onShow,
  onHide,
  onExpand,
  onCollapse,
  nonInvasive = true,
  ...props
}: SideNavProps) => {
  const [isOpened, setIsOpened] = useState(isOpen);
  const [isReadyToHide, setIsReadyToHide] = useState(isOpen);
  const [sidenavHeight, setSidenavHeight] = useState<number | undefined>(0);
  const [isSlimCollapsed, setIsSlimCollapsed] = useState(slimCollapsed);

  const classes = clsx(
    'sidenav',
    color && `sidenav-${color}`,
    bgColor && `bg-${bgColor}`,
    isOpened ? 'sidenav-shown' : 'sidenav-hidden',
    relative && 'sidenav-relative',
    absolute && 'sidenav-absolute',
    light && 'sidenav-theme-light',
    right && 'sidenav-right',
    slim && 'sidenav-slim',
    slim && isSlimCollapsed && 'sidenav-slim-collapsed',
    className
  );

  const pushClasses = clsx('sidenav-content', isOpened ? (right ? 'right-side-shown' : 'side-shown') : 'side-hidden');
  const sideClasses = clsx('sidenav-content', isOpened ? (right ? 'right-push-shown' : 'push-shown') : 'push-hidden');

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const getScrollbarWidth = () => {
      const documentWidth = document.documentElement.clientWidth;
      return Math.abs(window.innerWidth - documentWidth);
    };

    const hasVScroll = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576;

    if (hasVScroll && !nonInvasive) {
      const scrollbarWidth = getScrollbarWidth();
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [nonInvasive, isOpen]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (
        !constant &&
        backdrop &&
        mode === 'over' &&
        e.target !== navRef.current &&
        !navRef.current?.contains(e.target as Node)
      ) {
        setIsOpened(false);
        getOpenState && getOpenState(false);
      }
    },
    [navRef, getOpenState, constant, backdrop, mode]
  );

  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        setIsOpened(false);
        getOpenState && getOpenState(false);
      }
    },
    [getOpenState, closeOnEsc]
  );

  const handleResize = useCallback(() => {
    if (relative || absolute) {
      setSidenavHeight(navRef.current?.offsetHeight);
    } else {
      setSidenavHeight(window.innerHeight);
    }
  }, [absolute, relative]);

  useEffect(() => {
    setSidenavHeight(navRef.current?.offsetHeight);
  }, []);

  useEffect(() => {
    if (contentRef) {
      if (mode === 'push') {
        contentRef.className = sideClasses;
      } else if (mode === 'side') {
        contentRef.className = pushClasses;
      } else {
        contentRef.className = 'sidenav-content';
      }
    }
  }, [mode, contentRef, pushClasses, sideClasses]);

  useEffect(() => {
    if (isOpened) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleEscKey);
      window.addEventListener('resize', handleResize);
    }
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleClick, handleEscKey, handleResize, isOpened]);

  useEffect(() => {
    if (slim) {
      setIsSlimCollapsed(slimCollapsed);
      slimCollapsed ? onCollapse?.() : onExpand?.();
    }

    // eslint-disable-next-line
  }, [slimCollapsed, slim]);

  useEffect(() => {
    setIsOpened(isOpen);
    getOpenState && getOpenState(isOpen);
  }, [isOpen, getOpenState]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let secondTimer: ReturnType<typeof setTimeout>;

    if (isOpened) {
      setIsReadyToHide(true);
      timer = setTimeout(() => {
        setIsOpened(true);
        onShow?.();
      }, 4);
    } else {
      setIsOpened(false);

      secondTimer = setTimeout(() => {
        setIsReadyToHide(false);
        onHide?.();
      }, 300);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
    // eslint-disable-next-line
  }, [isOpened]);

  return (
    <SideNavContext.Provider value={{ color }}>
      <MDBTouch
        type='swipe'
        onSwipeLeft={() => {
          if (!slim) return;
          if (isOpened && !isSlimCollapsed) {
            setIsSlimCollapsed(true);
            onExpand?.();
          }
        }}
        onSwipeRight={() => {
          if (!slim) return;
          if (isOpened && isSlimCollapsed) {
            setIsSlimCollapsed(false);
            onCollapse?.();
          }
        }}
        tag='nav'
        className={classes}
        touchRef={navRef}
        {...props}
      >
        <MDBScrollbar suppressScrollX style={{ height: sidenavHeight }}>
          {children}
        </MDBScrollbar>
      </MDBTouch>
      {backdrop && mode === 'over' && (isReadyToHide || isOpened) && (
        <div
          className='sidenav-backdrop'
          style={{
            transition: 'opacity 0.3s ease-out 0s',
            position: absolute ? 'absolute' : 'fixed',
            width: '100%',
            height: '100%',
            opacity: isOpened && isReadyToHide ? 1 : 0,
          }}
        ></div>
      )}
    </SideNavContext.Provider>
  );
};

export default MDBSideNav;
