import clsx from 'clsx';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { LoadingManagementProps } from './types';
import MDBSpinner from '../../../free/components/Spinner/Spinner';

const MDBLoadingManagement: React.FC<LoadingManagementProps> = React.forwardRef<
  HTMLAllCollection,
  LoadingManagementProps
>(
  (
    {
      backdrop = true,
      backdropColor = 'black',
      backdropOpacity = 0.4,
      color,
      className,
      loadingText = 'Loading...',
      isOpen,
      fullScreen,
      overflow = true,
      parentRef,
      spinnerElement = <MDBSpinner className='loading-icon' role='status' />,
      textClassName,
      textStyles,
      tag: Tag = 'div',
      ...props
    },
    ref
  ) => {
    const textClasses = clsx('loading-text', textClassName);
    const classes = clsx(
      fullScreen ? 'loading-full' : 'loading',
      'loading-spinner',
      fullScreen ? 'position-fixed' : 'position-absolute',
      color && `text-${color}`,
      className
    );
    const backdropClasses = clsx('loading-backdrop', !fullScreen && 'position-absolute');

    useEffect(() => {
      const parentElement = parentRef?.current;
      if (parentElement) {
        parentElement.classList.add('position-relative');

        return () => {
          parentElement.classList.remove('position-relative');
        };
      }
    }, [parentRef]);

    useEffect(() => {
      if (fullScreen && overflow) {
        isOpen ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = '');

        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [fullScreen, isOpen, overflow]);

    const loadingElement = (
      <Tag className={classes} ref={ref} {...props}>
        {spinnerElement}
        <span className={textClasses} style={textStyles}>
          {loadingText}
        </span>
      </Tag>
    );

    const backdropElement = (
      <div className={backdropClasses} style={{ opacity: backdropOpacity, backgroundColor: backdropColor }}></div>
    );

    return (
      <>
        {isOpen !== false && (
          <>
            {fullScreen ? (
              ReactDOM.createPortal(
                <>
                  {loadingElement}
                  {backdropElement}
                </>,
                document.body
              )
            ) : (
              <>
                {loadingElement}
                {backdrop && backdropElement}
              </>
            )}
          </>
        )}
      </>
    );
  }
);

export default MDBLoadingManagement;
