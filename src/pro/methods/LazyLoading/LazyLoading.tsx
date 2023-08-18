import React, { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import type { LazyLoadingProps } from './types';

const MDBLazyLoading: React.FC<LazyLoadingProps> = ({
  animation = 'fade-in',
  className,
  containerRef,
  lazyRef,
  lazyOffset = 0,
  lazySrc,
  lazyError,
  lazyDelay = 500,
  lazyPlaceholder,
  video,
  onLoad,
  onError,
  ...props
}) => {
  const lazyElement = useRef(null);

  const lazyReference = lazyRef ? lazyRef : lazyElement;

  const [source, setSource] = useState(lazyPlaceholder ? lazyPlaceholder : '...');
  const [isAnimated, setIsAnimated] = useState(false);
  const [isInViewport, setisInViewport] = useState(false);

  const classes = clsx(animation !== 'none' && isAnimated && `animation ${animation}`, className);

  const scrollHandler = useCallback(() => {
    const offsetValues = lazyReference.current.getBoundingClientRect();

    if (containerRef) {
      const parentRect = containerRef.current.getBoundingClientRect();
      if (
        parentRect.y > 0 &&
        parentRect.y < window.innerHeight &&
        offsetValues.y >= parentRect.y &&
        offsetValues.y <= parentRect.y + parentRect.height &&
        offsetValues.y <= window.innerHeight
      ) {
        setisInViewport(true);
        onLoad && onLoad();
      }
    }

    if (offsetValues.top + lazyOffset <= window.innerHeight && offsetValues.bottom >= 0) {
      setisInViewport(true);
      onLoad && onLoad();
    }
  }, [lazyOffset, lazyReference, containerRef, onLoad]);

  const handleError = useCallback(() => {
    onError && onError(lazyError);
    lazyError && setSource(lazyError);
    setIsAnimated(true);
  }, [lazyError, onError]);

  useEffect(() => {
    if (isInViewport) {
      setTimeout(() => {
        lazySrc && setSource(lazySrc);
        setIsAnimated(true);
      }, lazyDelay);
    }
  }, [isInViewport, lazyDelay, lazySrc]);

  useEffect(() => {
    let selector: any;

    if (containerRef) {
      if (!containerRef.current.classList.contains('lazy-container')) {
        selector = containerRef.current;
      } else {
        selector = window;
      }
    } else {
      selector = window;
    }

    const lazyEl = lazyReference.current;

    selector.addEventListener('scroll', scrollHandler);
    lazyEl.addEventListener('error', handleError);

    if (isInViewport) {
      selector.removeEventListener('scroll', scrollHandler);
    }

    return () => {
      selector.removeEventListener('scroll', scrollHandler);
      lazyEl.removeEventListener('error', handleError);
    };
  }, [containerRef, scrollHandler, isInViewport, handleError, lazyReference]);

  return video ? (
    <video className={classes} src={source} ref={lazyReference} {...props}></video>
  ) : (
    <img className={classes} src={source} ref={lazyReference} {...props} />
  );
};

export default MDBLazyLoading;
