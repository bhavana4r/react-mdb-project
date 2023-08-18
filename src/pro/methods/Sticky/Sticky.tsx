import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { StickyProps } from './types';
import { getOffset } from './utils';

interface styleInf {
  top?: string | null;
  bottom?: string | null;
  position?: string | null;
  left?: string | null;
  zIndex?: string | null;
  width?: string | null;
  height?: string | null;
}

interface hidenStyleInf {
  opacity?: string | null;
  width?: string | null;
  height?: string | null;
}

const MDBSticky: React.FC<StickyProps> = ({
  className,
  stickyRef,
  animationSticky,
  animationUnsticky,
  boundary,
  delay = 0,
  direction = 'down',
  offset = 0,
  position = 'top',
  tag: Tag = 'span',
  children,
  onActive,
  onInactive,
  ...props
}) => {
  const stickyInnerRef = useRef(null);
  const hiddenReference = useRef<HTMLElement>(null);

  const stickyReference = stickyRef ? stickyRef : stickyInnerRef;
  const scrollDirection = useRef('');
  const isSticked = useRef(false);
  const elementOffsetTop = useRef(0);
  const scrollTop = useRef(0);
  const pushPoint = useRef(0);

  const [stickyStyle, setStickyStyle] = useState<styleInf>();
  const [hiddenStyle, setHiddenStyle] = useState<hidenStyleInf>();
  const [showHiddenElement, setShowHiddenElement] = useState(false);
  const [elementPositionStyles, setElementPositionStyles] = useState({});
  const [isReadyToHide, setIsReadyToHide] = useState(false);

  const classes = clsx(
    'sticky',
    animationSticky && showHiddenElement && `animation ${animationSticky}`,
    animationUnsticky && isReadyToHide && `animation ${animationUnsticky}`,
    className
  );

  const updateElementOffset = useCallback(() => {
    const hiddenElement = hiddenReference.current;
    const element = stickyReference.current;
    if (hiddenElement) {
      elementOffsetTop.current = hiddenElement.offsetTop;
    } else {
      elementOffsetTop.current = element.offsetTop;
    }
  }, [stickyReference]);

  const updatePushPoint = useCallback(() => {
    const element = stickyReference.current;
    if (element) {
      if (position === 'top') {
        pushPoint.current = elementOffsetTop.current - (delay as number);
      } else {
        pushPoint.current = elementOffsetTop.current + element.height - document.body.scrollHeight + (delay as number);
      }
    }
  }, [delay, position, stickyReference]);

  const updateScrollDirection = useCallback((_scrollTop: number) => {
    if (_scrollTop > scrollTop.current) {
      scrollDirection.current = 'down';
    } else {
      scrollDirection.current = 'up';
    }
  }, []);

  const setStyle = (element: HTMLElement, styles: any) => {
    Object.keys(styles).forEach((style: any) => {
      element.style[style] = styles[style];
    });
  };

  const handleResize = useCallback(() => {
    const hiddenElement = hiddenReference.current;
    const element = stickyReference.current;
    if (hiddenElement) {
      const { left } = hiddenElement.getBoundingClientRect();

      setElementPositionStyles({ left: `${left}px` });
    } else {
      setElementPositionStyles({});
    }

    setStyle(element, elementPositionStyles);

    updateElementOffset();
  }, [updateElementOffset, elementPositionStyles, stickyReference]);

  const changeBoundaryPosition = useCallback(() => {
    const element = stickyReference.current;

    const offsetNumber = offset as number;

    const { height } = element.getBoundingClientRect();

    const parentOffset = {
      height: element.parentElement.getBoundingClientRect().height,
      ...getOffset(element.parentElement),
    };

    let stopPoint;
    const stopper = typeof boundary !== 'boolean' && boundary?.current;

    if (stopper) {
      stopPoint = getOffset(stopper as HTMLElement).top - height - offsetNumber;
    } else {
      stopPoint = parentOffset.height + parentOffset[position as string] - height - offsetNumber;
    }

    const isStickyTop = position === 'top';
    const isStickyBottom = position === 'bottom';
    const isboundary = boundary;
    const isBelowStopPoint = stopPoint < 0;
    const isBelowParentElementEnd = stopPoint > parentOffset.height - height;
    let elementStyle;

    if (isStickyTop) {
      if (isBelowStopPoint && isboundary) {
        elementStyle = { top: `${offsetNumber + stopPoint}px` };
      } else {
        elementStyle = { top: `${offsetNumber + 0}px` };
      }
    }

    if (isStickyBottom) {
      if (isBelowStopPoint && isboundary) {
        elementStyle = { bottom: `${offsetNumber + stopPoint}px` };
      } else if (isBelowParentElementEnd && isboundary) {
        elementStyle = { bottom: `${offset + parentOffset.bottom}px` };
      } else {
        elementStyle = { bottom: `${offsetNumber + 0}px` };
      }
    }

    setStyle(element, elementStyle);
  }, [boundary, offset, position, stickyReference]);

  const handleScroll = useCallback(() => {
    const _scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offsetNumber = offset as number;

    updateElementOffset();
    updatePushPoint();
    updateScrollDirection(_scrollTop);

    const isCorrectScrollDirection = [scrollDirection.current, 'both'].includes(direction as string);
    const isPushPointReached = pushPoint.current <= _scrollTop;

    const shouldBeSticky = isPushPointReached && !isSticked.current && isCorrectScrollDirection;
    const shouldNotBeSticky = (!isPushPointReached || !isCorrectScrollDirection) && isSticked.current;

    if (shouldBeSticky) {
      const { height, left, width } = stickyReference.current.getBoundingClientRect();

      onActive && onActive();

      setShowHiddenElement(true);
      setHiddenStyle({
        height: `${height}px`,
        width: `${width}px`,
        opacity: '0',
      });

      setStickyStyle({
        top: position === 'top' ? `${0 + offsetNumber}px` : null,
        bottom: position === 'bottom' ? `${0 + offsetNumber}px` : null,
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        zIndex: '100',
        position: 'fixed',
      });

      changeBoundaryPosition();
      isSticked.current = true;
    }

    if (shouldNotBeSticky) {
      onInactive && onInactive();

      if (animationUnsticky) {
        setIsReadyToHide(true);
        setTimeout(() => {
          setStickyStyle({
            top: null,
            bottom: null,
            position: null,
            left: null,
            zIndex: null,
            width: null,
            height: null,
          });

          setShowHiddenElement(false);

          setHiddenStyle({
            height: null,
            width: null,
            opacity: null,
          });

          setIsReadyToHide(false);
        }, 200);
      } else {
        setStickyStyle({
          top: null,
          bottom: null,
          position: null,
          left: null,
          zIndex: null,
          width: null,
          height: null,
        });

        setShowHiddenElement(false);

        setHiddenStyle({
          height: null,
          width: null,
          opacity: null,
        });
      }

      isSticked.current = false;
    }

    if (isSticked.current) {
      setStyle(stickyReference.current, elementPositionStyles);
      changeBoundaryPosition();
    }

    scrollTop.current = _scrollTop <= 0 ? 0 : _scrollTop;
  }, [
    direction,
    updateElementOffset,
    updatePushPoint,
    updateScrollDirection,
    offset,
    position,
    stickyReference,
    elementPositionStyles,
    changeBoundaryPosition,
    animationUnsticky,
    onActive,
    onInactive,
  ]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll]);

  return (
    <>
      {showHiddenElement && (
        <Tag className={classes} ref={hiddenReference} style={hiddenStyle} {...props}>
          {children}
        </Tag>
      )}

      <Tag className={classes} ref={stickyReference} style={stickyStyle} {...props}>
        {children}
      </Tag>
    </>
  );
};

export default MDBSticky;
