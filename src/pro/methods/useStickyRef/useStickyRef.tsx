import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useStickyRefProps, styleInf, hiddenStyleInf } from './types';
import clsx from 'clsx';

export const useStickyRef = <Type extends HTMLElement>({
  animationSticky,
  animationUnsticky,
  boundary = false,
  delay = 0,
  direction = 'down',
  offset = 0,
  position = 'top',
}: useStickyRefProps): MutableRefObject<any> => {
  const stickyRef = useRef<Type>(null);
  const placeholderRef = useRef<HTMLElement>(null) as MutableRefObject<HTMLElement>;

  const scrollDirection = useRef('');
  const isSticked = useRef(false);
  const elementOffsetTop = useRef(0);
  const scrollTop = useRef(0);
  const pushPoint = useRef(0);
  const initRender = useRef(false);
  const inheritClasses = useRef('');

  const [stickyStyle, setStickyStyle] = useState<styleInf>({});
  const [hiddenStyle, setHiddenStyle] = useState<hiddenStyleInf>({});
  const [elementPositionStyles, setElementPositionStyles] = useState({});
  const [showHiddenElement, setShowHiddenElement] = useState(false);
  const [isReadyToHide, setIsReadyToHide] = useState(false);

  const getOffset = (element: HTMLElement): any => {
    const rectElement = element.getBoundingClientRect();

    const left = rectElement.left + document.body.scrollLeft;
    const top = rectElement.top + document.body.scrollTop;
    const bottom = left === 0 && top === 0 ? 0 : window.innerHeight - rectElement.bottom;

    return {
      top,
      left,
      bottom,
    };
  };

  const updateElementOffset = useCallback(() => {
    const hiddenElement = placeholderRef.current;
    const element = stickyRef.current;

    if (!element) return;

    elementOffsetTop.current = hiddenElement ? hiddenElement.offsetTop : element.offsetTop;
  }, [stickyRef]);

  const updatePushPoint = useCallback(() => {
    const element = stickyRef.current;

    if (!element) return;

    const { height } = element.getBoundingClientRect();
    const offsetTop = elementOffsetTop.current;

    const pushPointTop = offsetTop - delay - height / 2;
    const pushPointBottom = offsetTop + height - document.body.scrollHeight + delay;

    pushPoint.current = position === 'top' ? pushPointTop : pushPointBottom;
  }, [delay, position, stickyRef]);

  const updateScrollDirection = useCallback((_scrollTop: number) => {
    scrollDirection.current = _scrollTop > scrollTop.current ? 'down' : 'up';
  }, []);

  const updateStyle = (element: HTMLElement, styles: any) => {
    Object.keys(styles).forEach((style: any) => {
      element.style[style] = styles[style];
    });
  };

  const handleResize = useCallback(() => {
    const hiddenElement = placeholderRef.current;
    const stickyElement = stickyRef.current;

    if (!stickyElement) return;

    const { left } = hiddenElement.getBoundingClientRect();

    const newStyle = hiddenElement ? { left } : {};

    setElementPositionStyles(newStyle);
    updateStyle(stickyElement, newStyle);
    updateElementOffset();
  }, [updateElementOffset, stickyRef]);

  const changeBoundaryPosition = useCallback(() => {
    const element = stickyRef.current;

    if (!element) return;

    const { height } = element.getBoundingClientRect();
    const parentOffset = {
      height: element.parentElement?.getBoundingClientRect().height,
      ...getOffset(element.parentElement as HTMLElement),
    };

    const stopper = typeof boundary !== 'boolean' && boundary?.current;
    const stopPoint = stopper
      ? getOffset(stopper as HTMLElement).top - height - offset
      : parentOffset.height + parentOffset[position] - height - offset;

    const isStickyBottom = position === 'bottom';
    const isBoundary = boundary;
    const isBelowStopPoint = stopPoint < 0;
    const isBelowParentElementEnd = stopPoint > parentOffset.height - height;
    let elementStyle;

    if (isBelowStopPoint && isBoundary) {
      elementStyle = { [position]: `${offset + stopPoint}px` };
      return updateStyle(element, elementStyle);
    }

    if (isBelowParentElementEnd && isBoundary && isStickyBottom) {
      elementStyle = { bottom: `${offset + parentOffset.bottom}px` };
      return updateStyle(element, elementStyle);
    }

    elementStyle = { [position]: `${offset}px` };
    updateStyle(element, elementStyle);
  }, [boundary, offset, position, stickyRef]);

  const resetStickyStyle = useCallback(() => {
    setStickyStyle({
      [position]: null,
      height: null,
      width: null,
      left: null,
      zIndex: null,
      position: null,
    });

    setShowHiddenElement(false);

    setHiddenStyle({
      height: null,
      width: null,
      opacity: null,
    });
  }, [position]);

  const handleScroll = useCallback(() => {
    if (!stickyRef.current) return;

    const _scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    updateElementOffset();
    updatePushPoint();
    updateScrollDirection(_scrollTop);

    const isCorrectScrollDirection = [scrollDirection.current, 'both'].includes(direction);
    const isPushPointReached = pushPoint.current <= _scrollTop;

    const shouldBeSticky = isPushPointReached && !isSticked.current && isCorrectScrollDirection;
    const shouldNotBeSticky = (!isPushPointReached || !isCorrectScrollDirection) && isSticked.current;

    if (shouldBeSticky) {
      const { height, left, width } = stickyRef.current.getBoundingClientRect();

      setShowHiddenElement(true);
      setHiddenStyle({
        height: `${height}px`,
        width: `${width}px`,
        opacity: '0',
      });

      setStickyStyle({
        [position]: `${offset}px`,
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
      if (animationUnsticky) {
        setIsReadyToHide(true);
        setTimeout(() => {
          resetStickyStyle();

          setIsReadyToHide(false);
        }, 200);
      } else {
        resetStickyStyle();
      }

      isSticked.current = false;
    }

    if (isSticked.current) {
      updateStyle(stickyRef.current, elementPositionStyles);
      changeBoundaryPosition();
    }

    scrollTop.current = _scrollTop <= 0 ? 0 : _scrollTop;
  }, [
    animationUnsticky,
    changeBoundaryPosition,
    direction,
    elementPositionStyles,
    offset,
    position,
    resetStickyStyle,
    updateElementOffset,
    updatePushPoint,
    updateScrollDirection,
  ]);

  useEffect(() => {
    if (!stickyRef.current || initRender.current) return;

    const stickyRefTag = stickyRef.current.tagName.toLowerCase();

    const placeholderElement = document.createElement(stickyRefTag);
    placeholderRef.current = placeholderElement;
    stickyRef.current.parentElement?.insertBefore(placeholderElement, stickyRef.current);

    inheritClasses.current = stickyRef.current.className;
    initRender.current = true;
  }, [initRender]);

  useEffect(() => {
    updateStyle(placeholderRef.current, hiddenStyle);
  }, [hiddenStyle]);

  useEffect(() => {
    if (!stickyRef.current) return;

    updateStyle(stickyRef.current, stickyStyle);
  }, [stickyStyle]);

  useEffect(() => {
    const stickyElement = stickyRef.current;

    if (!stickyElement) return;

    const stickyClasses = clsx(animationSticky && showHiddenElement && `animation ${animationSticky}`);
    const unstickyClasses = clsx(animationUnsticky && isReadyToHide && `animation ${animationUnsticky}`);
    const placeholderClasses = clsx(showHiddenElement && inheritClasses.current);

    stickyElement.className = clsx('sticky', inheritClasses.current, stickyClasses, unstickyClasses);
    placeholderRef.current.className = clsx(placeholderClasses);
  }, [animationSticky, animationUnsticky, isReadyToHide, showHiddenElement]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll]);

  return stickyRef;
};

export default useStickyRef;
