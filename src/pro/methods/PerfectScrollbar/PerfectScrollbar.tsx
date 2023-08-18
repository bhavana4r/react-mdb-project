import React, { useRef, useEffect } from 'react';
import type { ScrollbarProps } from './types';
import 'react-perfect-scrollbar/dist/css/styles.css';
import Scrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';

const MDBScrollbar: React.FC<ScrollbarProps> = ({
  className,
  sidenav,
  tag = 'div',
  handlers = ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  wheelSpeed = 1,
  wheelPropagation = true,
  swipeEasing = true,
  minScrollbarLength = undefined,
  maxScrollbarLength = undefined,
  scrollingThreshold = 1000,
  useBothWheelAxes = false,
  suppressScrollX = false,
  suppressScrollY = false,
  scrollXMarginOffset = 0,
  scrollYMarginOffset = 0,
  scrollBarRef,
  children,
  ...props
}) => {
  const classes = clsx(sidenav && 'sidenav-menu', className);

  const scrollbarEl = useRef(null);

  useEffect(() => {
    scrollBarRef && scrollBarRef(scrollbarEl);
  }, [scrollBarRef]);

  const optionsSetup = {
    ...handlers,
    wheelSpeed,
    wheelPropagation,
    swipeEasing,
    minScrollbarLength,
    maxScrollbarLength,
    scrollingThreshold,
    useBothWheelAxes,
    suppressScrollX,
    suppressScrollY,
    scrollXMarginOffset,
    scrollYMarginOffset,
  };

  return (
    <Scrollbar className={classes} ref={scrollbarEl} component={tag} options={optionsSetup} {...props}>
      {children}
    </Scrollbar>
  );
};

export default MDBScrollbar;
