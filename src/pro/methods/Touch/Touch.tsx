import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TouchProps } from './types';
import {
  getCoordinates,
  getDirection,
  getOrigin,
  getPinchTouchOrigin,
  isNumber,
  getAngle,
  getRightMostTouch,
} from './TouchUtil.tsx';

const MDBScrollbar: React.FC<TouchProps> = ({
  tag: Tag = 'div',
  children,
  touchRef,
  type,
  threshold = 10,
  allDirections = false,
  onSwipe,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPan,
  onPanLeft,
  onPanRight,
  onPanUp,
  onPanDown,
  onPinch,
  onRotate,
  onTap,
  onPress,
  pointers = 1,
  interval = 500,
  taps = 1,
  duration = 250,
  preventSwipeScroll = true,
  ...props
}) => {
  const touchEl = useRef(null);
  const touchReference = touchRef ? touchRef : touchEl;

  const [startPosition, setStartPosition] = useState<{ x: any; y: any } | null>(null);
  const [startTouch, setStartTouch] = useState<number | { x: number; y: number } | null>(null);
  const [movedTouch, setMovedTouch] = useState(null);
  const [touch, setTouch] = useState<number | { x: number; y: number } | null>(null);
  const [origin, setOrigin] = useState<number | { x: number; y: number } | Record<string, any>>({ x: 0, y: 0 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [previousAngle, setPreviousAngle] = useState<number>(0);
  const [initialAngle, setInitialAngle] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [pivot, setPivot] = useState<{ x: any; y: any }>({ x: 0, y: 0 });
  const [tapCount, setTapCount] = useState(0);
  const [tapData, setTapData] = useState(null);

  const timer = useRef<number>();

  // TAP HANDLERS

  useEffect(() => {
    if (type === 'tap') {
      if (tapCount === 1) {
        timer.current = window.setTimeout(() => {
          setTapCount(0);
        }, interval);
      }

      if (tapCount === taps) {
        window.clearTimeout(timer.current);
        setTapCount(0);

        onTap && onTap(tapData);
      }
    }
  }, [tapCount, interval, taps, onTap, tapData, type]);

  const handleTapStart = useCallback(
    (e: any) => {
      if (e.touches.length === pointers) {
        setTapCount(tapCount + 1);

        setTapData(e);
      }
    },
    [pointers, tapCount]
  );

  const handleTapMove = useCallback(() => {
    return;
  }, []);

  const handleTapEnd = useCallback(() => {
    return;
  }, []);

  // PRESS HANDLERS

  const handlePressStart = useCallback(
    (e: any) => {
      if (e.touches.length === pointers) {
        timer.current = window.setTimeout(() => {
          onPress && onPress(e, duration);
        }, duration);
      }
    },
    [duration, pointers, onPress]
  );

  const handlePressMove = useCallback(() => {
    return;
  }, []);

  const handlePressEnd = useCallback(() => {
    window.clearTimeout(timer.current);
  }, []);

  // SWIPE HANDLERS

  const handleSwipeStart = useCallback((e: any) => {
    setStartPosition(getCoordinates(e));
  }, []);

  const getSwipeDirectionHandler = useCallback(
    (swipeDirection: string) => {
      if (swipeDirection === 'left') {
        return onSwipeLeft;
      }

      if (swipeDirection === 'right') {
        return onSwipeRight;
      }

      if (swipeDirection === 'up') {
        return onSwipeUp;
      }

      if (swipeDirection === 'down') {
        return onSwipeDown;
      }

      return;
    },
    [onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const handleSwipeMove = useCallback(
    (e: any) => {
      e.type === 'touchmove' && preventSwipeScroll && e.preventDefault();

      if (!startPosition) return;

      const position = getCoordinates(e);
      const displacement = {
        x: position.x - startPosition.x,
        y: position.y - startPosition.y,
      };
      const swipe = getDirection(displacement);
      const { x, y } = swipe;

      if (allDirections) {
        if (threshold && y.value < threshold && x.value < threshold) {
          return;
        }

        const direction = y.value > x.value ? y.direction : x.direction;

        onSwipe && onSwipe(e, { direction });
        setStartPosition(null);
        return;
      }

      const axis = onSwipeRight || onSwipeLeft ? 'x' : 'y';

      if (threshold && swipe[axis].value > threshold) {
        const handler = getSwipeDirectionHandler(swipe[axis].direction);

        handler && handler(e);

        setStartPosition(null);
      }
    },
    [
      allDirections,
      onSwipe,
      startPosition,
      threshold,
      onSwipeRight,
      onSwipeLeft,
      getSwipeDirectionHandler,
      preventSwipeScroll,
    ]
  );

  const handleSwipeEnd = useCallback(() => {
    setStartPosition(null);
  }, []);

  // PAN HANDLERS

  const handlePanStart = useCallback((e: any) => {
    setStartTouch(getCoordinates(e));
    setMovedTouch(e);
  }, []);

  const getPanDirectionHandler = useCallback(
    (panDirection: string) => {
      if (panDirection === 'left') {
        return onPanLeft;
      }

      if (panDirection === 'right') {
        return onPanRight;
      }

      if (panDirection === 'up') {
        return onPanUp;
      }

      if (panDirection === 'down') {
        return onPanDown;
      }

      return;
    },
    [onPanDown, onPanLeft, onPanRight, onPanUp]
  );

  const handlePanMove = useCallback(
    (e: any) => {
      e.type === 'touchmove' && e.preventDefault();

      const postion = getCoordinates(e);
      const movedPosition = getCoordinates(movedTouch);

      const displacement = getOrigin(postion, startTouch as { x: any; y: any });
      const displacementMoved = getOrigin(postion, movedPosition);

      const pan = getDirection(displacement);
      const movedDirection = getDirection(displacementMoved);

      const { x, y } = pan;

      if (threshold && allDirections && (y.value > threshold || x.value > threshold)) {
        onPan && onPan(e);
      }

      const axis = onPanLeft || onPanRight ? 'x' : 'y';

      if (threshold && pan[axis].value > threshold) {
        const handler = getPanDirectionHandler(movedDirection[axis].direction);

        handler && handler(e);
      }
      setMovedTouch(e);
    },
    [allDirections, movedTouch, startTouch, threshold, onPan, onPanLeft, onPanRight, getPanDirectionHandler]
  );

  const handlePanEnd = useCallback((e: any) => {
    e.type === 'touchend' && e.preventDefault();

    setStartTouch(null);
    setMovedTouch(null);
  }, []);

  // PINCH HANDLERS

  const handlePinchStart = useCallback(
    (e: any) => {
      if (e.touches.length !== pointers) return;

      e.type === 'touchstart' && e.preventDefault();

      const [touch, origin] = getPinchTouchOrigin(e.touches);

      setTouch(touch);
      setStartTouch(touch);
      setOrigin(origin);
    },
    [pointers]
  );

  const handlePinchMove = useCallback(
    (e: any) => {
      if (e.touches.length !== pointers) return;

      e.type === 'touchmove' && e.preventDefault();

      setTouch(getPinchTouchOrigin(e.touches)[0]);

      if (typeof startTouch === 'number' && typeof touch === 'number') {
        setRatio(touch / startTouch);
      }

      if (isNumber(startTouch, touch)) {
        if (typeof origin === 'object') {
          if ((threshold && origin.x > threshold) || (threshold && origin.y > threshold)) {
            setStartTouch(touch as { x: number; y: number });
            onPinch && onPinch(e, { ratio, origin });
          }
        }
      }
    },
    [pointers, startTouch, touch, threshold, onPinch, origin, ratio]
  );

  const handlePinchEnd = useCallback(() => {
    if (isNumber(startTouch, touch)) {
      setStartTouch(null);
    }
  }, [startTouch, touch]);

  // ROTATE HANDLERS

  const handleRotateStart = useCallback(
    (e: any) => {
      e.type === 'touchstart' && e.preventDefault();

      if (e.touches.length === 1 && pointers === 1) {
        const { left, top, width, height } = e.target.element.getBoundingClientRect();

        setPivot({ x: left + width / 2, y: top + height / 2 });
      } else if (e.touches.length === 2 && pointers === 2) {
        const [t2, t1] = e.touches;
        const position = {
          x1: t1.clientX,
          x2: t2.clientX,
          y1: t1.clientY,
          y2: t2.clientY,
        };

        setPivot({
          x: (position.x1 + position.x2) / 2,
          y: (position.y1 + position.y2) / 2,
        });
      } else {
        return;
      }
    },
    [pointers]
  );

  const handleRotateMove = useCallback(
    (e: any) => {
      e.type === 'touchmove' && e.preventDefault();

      let input;

      if (e.touches.length === 1 && pointers === 1) {
        input = e.touches[0];
      } else if (e.touches.length === 2 && pointers === 2) {
        input = getRightMostTouch(e.touches);
      } else {
        return;
      }

      setCurrentAngle(getAngle(pivot.x, pivot.y, input.clientX, input.clientY));

      if (!initialAngle) {
        setPreviousAngle(currentAngle);
        setInitialAngle(currentAngle);

        setDistance(0);
        setChange(0);
      } else {
        setChange(currentAngle - previousAngle);

        setDistance(distance + change);
      }

      setPreviousAngle(currentAngle);

      const result = {
        currentAngle,
        distance,
        change,
      };

      onRotate && onRotate(e, result);
    },
    [change, currentAngle, previousAngle, pivot, onRotate, distance, initialAngle, pointers]
  );

  const handleRotateEnd = useCallback((e: any) => {
    e.type === 'touchend' && e.preventDefault();

    setCurrentAngle(0);
    setInitialAngle(0);
    setPreviousAngle(0);
    setChange(0);
    setDistance(0);
  }, []);

  useEffect(() => {
    const target = touchReference.current;

    if (type === 'tap') {
      target.addEventListener('touchstart', handleTapStart);
      target.addEventListener('touchmove', handleTapMove);
      target.addEventListener('touchend', handleTapEnd);
    }

    if (type === 'press') {
      target.addEventListener('touchstart', handlePressStart);
      target.addEventListener('touchmove', handlePressMove);
      target.addEventListener('touchend', handlePressEnd);
    }

    if (type === 'swipe') {
      target.addEventListener('touchstart', handleSwipeStart);
      target.addEventListener('touchmove', handleSwipeMove);
      target.addEventListener('touchend', handleSwipeEnd);
    }

    if (type === 'pan') {
      target.addEventListener('touchstart', handlePanStart);
      target.addEventListener('touchmove', handlePanMove);
      target.addEventListener('touchend', handlePanEnd);
    }

    if (type === 'pinch') {
      target.addEventListener('touchstart', handlePinchStart);
      target.addEventListener('touchmove', handlePinchMove);
      target.addEventListener('touchend', handlePinchEnd);
    }

    if (type === 'rotate') {
      target.addEventListener('touchstart', handleRotateStart);
      target.addEventListener('touchmove', handleRotateMove);
      target.addEventListener('touchend', handleRotateEnd);
    }

    return () => {
      if (type === 'tap') {
        target.removeEventListener('touchstart', handleTapStart);
        target.removeEventListener('touchmove', handleTapMove);
        target.removeEventListener('touchend', handleTapEnd);
      }

      if (type === 'press') {
        target.removeEventListener('touchstart', handlePressStart);
        target.removeEventListener('touchmove', handlePressMove);
        target.removeEventListener('touchend', handlePressEnd);
      }

      if (type === 'swipe') {
        target.removeEventListener('touchstart', handleSwipeStart);
        target.removeEventListener('touchmove', handleSwipeMove);
        target.removeEventListener('touchend', handleSwipeEnd);
      }

      if (type === 'pan') {
        target.removeEventListener('touchstart', handlePanStart);
        target.removeEventListener('touchmove', handlePanMove);
        target.removeEventListener('touchend', handlePanEnd);
      }

      if (type === 'pinch') {
        target.removeEventListener('touchstart', handlePinchStart);
        target.removeEventListener('touchmove', handlePinchMove);
        target.removeEventListener('touchend', handlePinchEnd);
      }

      if (type === 'rotate') {
        target.removeEventListener('touchstart', handleRotateStart);
        target.removeEventListener('touchmove', handleRotateMove);
        target.removeEventListener('touchend', handleRotateEnd);
      }
    };
  }, [
    touchReference,
    handleTapStart,
    handleTapMove,
    handleTapEnd,
    handlePressStart,
    handlePressMove,
    handlePressEnd,
    handleSwipeStart,
    handleSwipeMove,
    handleSwipeEnd,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handlePinchStart,
    handlePinchMove,
    handlePinchEnd,
    handleRotateStart,
    handleRotateMove,
    handleRotateEnd,
    type,
  ]);

  return (
    <Tag ref={touchReference} {...props}>
      {children}
    </Tag>
  );
};

export default MDBScrollbar;
