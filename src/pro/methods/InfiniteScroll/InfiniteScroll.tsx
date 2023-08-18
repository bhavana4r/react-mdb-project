import React, { useEffect, useCallback, useRef } from 'react';
import type { InfiniteScrollProps } from './types';

const MDBInfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  infiniteScrollRef,
  infiniteDirection,
  tag: Tag = 'div',
  onInfiniteScroll,
  onComplete,
  windowParent = false,
  ...props
}) => {
  const infiniteScrollElement = useRef(null);

  const infiniteScrollReference = infiniteScrollRef ? infiniteScrollRef : infiniteScrollElement;

  const getRect = (el: any) => {
    return el.getBoundingClientRect();
  };

  const condition = useCallback(() => {
    if (windowParent) {
      return window.scrollY + window.innerHeight === document.documentElement.scrollHeight;
    }

    const rect = getRect(infiniteScrollReference.current);

    if (infiniteDirection === 'x') {
      return (
        rect.width + infiniteScrollReference.current.scrollLeft + 10 >= infiniteScrollReference.current.scrollWidth
      );
    }
    return (
      Math.ceil(rect.height + infiniteScrollReference.current.scrollTop) >= infiniteScrollReference.current.scrollHeight
    );
  }, [windowParent, infiniteDirection, infiniteScrollReference]);

  const handleScroll = useCallback(() => {
    if (condition()) {
      onComplete && onComplete();
      onInfiniteScroll && onInfiniteScroll();
    }
  }, [condition, onInfiniteScroll, onComplete]);

  useEffect(() => {
    const selector = windowParent ? window : infiniteScrollReference.current;

    selector.addEventListener('scroll', handleScroll);

    return () => {
      selector.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, infiniteScrollReference, windowParent]);

  return (
    <Tag ref={infiniteScrollReference} {...props}>
      {children}
    </Tag>
  );
};

export default MDBInfiniteScroll;
