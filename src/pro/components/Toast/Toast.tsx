import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import type { ToastProps } from './types';
import MDBToastHeader from './ToastHeader/ToastHeader';
import MDBToastBody from './ToastBody/ToastBody';
import MDBToastClose from './ToastClose/ToastClose';

const MDBToast: React.FC<ToastProps> = ({
  className,
  position,
  delay = 1000,
  autohide,
  width = 'width',
  onShow,
  onHide,
  containerRef,
  toastRef,
  offset = 10,
  stacking,
  appendToBody,
  color,
  triggerRef,
  show = false,
  bodyContent,
  headerContent,
  bodyClasses,
  headerClasses,
  closeBtnClasses,
  ...props
}) => {
  const [isShown, setIsShown] = useState(show);
  const [isFaded, setIsFaded] = useState(show);
  const [placement, setPlacement] = useState({});
  const [toastDisplay, setToastDisplay] = useState(isShown ? 'block' : 'none');
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);

  const thisToast = useRef<HTMLDivElement>(null);
  const toastReference = toastRef ? toastRef : thisToast;

  const toastClasses = clsx(
    'toast',
    'fade',
    position && !containerRef && 'toast-fixed',
    position && `toast-${position}`,
    containerRef && 'toast-absolute',
    color && `bg-${color}`,
    isShown && isFaded && 'show',
    stacking && 'stacking-toast',
    className
  );

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (position) {
      const positionY = position.split('-')[0];
      const positionX = position.split('-')[1];
      const oppositeY = positionY === 'top' ? 'bottom' : 'top';
      const oppositeX = positionX === 'left' ? 'right' : 'left';

      if (positionX === 'center') {
        setPlacement({
          [positionY]: `${offset !== undefined ? offset + verticalOffset : verticalOffset}px`,
          left: '50%',
          [oppositeY]: 'unset',
          transform: 'translate(-50%)',
        });
      } else {
        setPlacement({
          [positionY]: `${offset !== undefined ? offset + verticalOffset : verticalOffset}px`,
          [positionX]: `${offset}px`,
          [oppositeY]: 'unset',
          [oppositeX]: 'unset',
          transform: 'unset',
        });
      }
    }
  }, [offset, position, verticalOffset]);

  const handleCloseBtn = () => {
    setIsShown(false);
  };

  useEffect(() => {
    if (stacking) {
      if (isShown) {
        const toasts = document.querySelectorAll(`.toast-${position}`);
        let vOffset = 0;

        const toastPosition = containerRef ? 'toast-absolute' : 'toast-fixed';

        const selectedToasts = Array.from(toasts).filter(
          (el: any) =>
            el.classList.contains('show') &&
            el !== toastReference.current &&
            el.classList.contains(toastPosition) &&
            el.classList.contains('stacking-toast')
        );

        if (selectedToasts.length > 0) {
          const posY = position?.split('-')[0];
          let offsetValue;

          if (posY === 'top') {
            offsetValue =
              (selectedToasts[selectedToasts.length - 1] as HTMLElement).offsetTop +
              (selectedToasts[selectedToasts.length - 1] as HTMLElement).offsetHeight;
          } else {
            offsetValue =
              parseInt((selectedToasts[selectedToasts.length - 1] as HTMLElement).style.bottom) +
              (selectedToasts[selectedToasts.length - 1] as HTMLElement).offsetHeight;
          }

          if (offset) {
            vOffset = offsetValue + offset;
          } else {
            vOffset = offsetValue;
          }
        }

        setVerticalOffset(vOffset);
      }
    }
  }, [stacking, isShown, toastReference, verticalOffset, offset, position, containerRef]);

  const handleTriggerClick = useCallback(() => {
    setIsShown(true);
  }, []);

  useEffect(() => {
    if (isShown) {
      setToastDisplay('block');
    }

    if (!isShown && !isFaded) {
      setToastDisplay('none');
      if (!firstRender) {
        onHide?.();
      }
    }
    // eslint-disable-next-line
  }, [isShown, isFaded, onHide]);

  useEffect(() => {
    setIsShown(show);
  }, [show]);

  useEffect(() => {
    if (triggerRef !== null && triggerRef !== undefined) {
      const trigger = triggerRef.current;

      triggerRef.current.addEventListener('click', handleTriggerClick);

      return () => {
        trigger.removeEventListener('click', handleTriggerClick);
      };
    }
  }, [triggerRef, handleTriggerClick]);

  useEffect(() => {
    if (containerRef !== null && containerRef !== undefined) {
      containerRef.current.classList.add('parent-toast-relative');
    }
  }, [containerRef]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (autohide && isShown) {
      timer = setTimeout(() => {
        setIsShown(false);
      }, delay);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [autohide, isShown, delay]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let secondTimer: ReturnType<typeof setTimeout>;

    if (isShown) {
      onShow?.();
      timer = setTimeout(() => {
        setIsFaded(true);
      }, 100);
    } else if (!isShown) {
      secondTimer = setTimeout(() => {
        setIsFaded(false);
      }, 100);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [isShown, autohide, onShow]);

  const toastContent = (
    <div
      className={toastClasses}
      ref={toastReference}
      style={{ ...placement, width: width === 'unset' ? width : `${width}px`, display: toastDisplay }}
      {...props}
    >
      {headerContent && (
        <MDBToastHeader className={headerClasses} color={color}>
          {headerContent}
          <MDBToastClose
            onClick={handleCloseBtn}
            className={closeBtnClasses}
            white={color && color !== 'light' ? true : false}
          />
        </MDBToastHeader>
      )}
      <MDBToastBody className={bodyClasses} color={color}>
        {bodyContent}
      </MDBToastBody>
    </div>
  );

  if (isShown || isFaded) {
    return appendToBody ? ReactDOM.createPortal(toastContent, document.body) : toastContent;
  } else {
    return <></>;
  }
};

export default MDBToast;
