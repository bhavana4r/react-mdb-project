import React, { useRef } from 'react';
import clsx from 'clsx';
import type { LazyContainerProps } from './types';
import MDBLazyLoading from '../LazyLoading';

const MDBLazyContainer: React.FC<LazyContainerProps> = ({
  tag: Tag = 'div',
  lazyContainerRef,
  lazyItems = [],
  lazyPlaceholder,
  lazyError,
  className,
  ...props
}) => {
  const containerClasses = clsx('lazy-container', className);

  const lazyContainerElement = useRef(null);

  const lazyContainerReference = lazyContainerRef ? lazyContainerRef : lazyContainerElement;

  return (
    <Tag ref={lazyContainerReference} className={containerClasses} {...props}>
      {lazyItems.map((item: any) => {
        const lazyProps = { ...item };

        if (lazyPlaceholder) {
          lazyProps.lazyPlaceholder = lazyPlaceholder;
        }

        if (lazyError) {
          lazyProps.lazyError = lazyError;
        }

        lazyProps.containerRef = lazyContainerReference;

        return <MDBLazyLoading key={Math.floor(Math.random() * 999 + 1)} {...lazyProps} />;
      })}
    </Tag>
  );
};

export default MDBLazyContainer;
