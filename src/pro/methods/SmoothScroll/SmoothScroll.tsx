import React, { useEffect, useRef } from 'react';
import { getEasing } from './motions';
import type { SmoothScrollProps } from './types';

const MDBSmoothScroll: React.FC<SmoothScrollProps> = ({
  className,
  duration = 500,
  href = '#',
  offset = 0,
  easing = 'motionLinear',
  containerRef,
  targetRef,
  children,
  ...props
}) => {
  const containerToScroll = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerToScroll.current = containerRef ? containerRef.current : document.documentElement;
  }, [containerRef]);

  const getOffset = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  };

  const offsetFromEl = () => {
    const containerElement = containerToScroll.current;
    const targetElement = targetRef?.current;

    if (containerElement && offset !== undefined) {
      const heightFromTop = containerElement.scrollTop;

      if (!containerRef) {
        return getOffset(targetElement).top - offset + heightFromTop;
      }
      const elY = targetElement.getBoundingClientRect().y;
      const containerY = containerElement.getBoundingClientRect().y;
      const offsetFromContainer = elY - containerY;

      return offsetFromContainer - offset + heightFromTop;
    }
  };

  const inViewport = () => {
    if (!containerRef) {
      return true;
    }
    if (containerToScroll.current) {
      const rect = containerToScroll.current?.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }
  };

  const scrollOnNextTick = (
    scrollingContainer: any,
    positionFrom: any,
    positionTo: any,
    scrollProgress: any,
    speed: any,
    step: any
  ) => {
    const progressWrongValue = scrollProgress < 0;
    const scrollEnd = scrollProgress > 1;
    const speedWrongValue = speed <= 0;
    if (progressWrongValue || scrollEnd || speedWrongValue) {
      scrollingContainer.scrollTop = positionTo;
      return;
    }
    if (!easing) return;
    scrollingContainer.scrollTo({
      top: positionFrom - (positionFrom - positionTo) * getEasing(scrollProgress, easing),
    });
    scrollProgress += speed * step;

    // After one tick ends next tick is able to run, otherwise scrolling aren't goint to be animated
    setTimeout(() => {
      scrollOnNextTick(scrollingContainer, positionFrom, positionTo, scrollProgress, speed, step);
    });
  };

  const handleClick = (e: any) => {
    e.preventDefault();

    const containerElement = containerToScroll.current;
    if (containerElement && duration) {
      const positionFrom = containerElement.scrollTop;
      const positionTo = offsetFromEl();
      const scrollProgress = 0;
      const speed = 1 / duration;
      // Thanks to this value time of scrolling is almost equal to value which user set
      const step = 4.25;

      if (!inViewport()) {
        scrollOnNextTick(
          document.documentElement,
          document.documentElement.scrollTop,
          containerElement.offsetTop,
          scrollProgress,
          speed,
          step
        );

        // Function which is waiting for ends scrolling to viewport
        setTimeout(() => {
          scrollOnNextTick(containerElement, positionFrom, positionTo, scrollProgress, speed, step);
        }, duration);
      } else {
        scrollOnNextTick(containerElement, positionFrom, positionTo, scrollProgress, speed, step);
      }
    }
  };

  return (
    <a className={className} href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default MDBSmoothScroll;
