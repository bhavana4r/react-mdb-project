import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import type { AlertProps } from './types';
const MDBAlert: React.FC<AlertProps> = ({
  className,
  alertRef,
  position,
  delay = 1000,
  autohide,
  width = 'unset',
  containerRef,
  offset = 10,
  appendToBody,
  color,
  children,
  triggerRef,
  show = false,
  stacking = false,
  onClose,
  onClosed,
  onShow,
  ...props
}) => {
  const [isShown, setIsShown] = useState(show);
  const [isFaded, setIsFaded] = useState(show);
  const [placement, setPlacement] = useState({});
  const [alertDisplay, setAlertDisplay] = useState(isShown ? 'block' : 'none');
  const [verticalOffset, setVerticalOffset] = useState(0);

  const thisAlert = useRef<HTMLDivElement>(null);
  const alertReference = alertRef ? alertRef : thisAlert;

  const alertClasses = clsx(
    'alert',
    'fade',
    position && !containerRef && 'alert-fixed',
    position && `alert-${position}`,
    containerRef && 'alert-absolute',
    color ? `alert-${color}` : 'alert-primary',
    isShown && isFaded && 'show',
    stacking && 'stacking-alert',
    className
  );

  useEffect(() => {
    if (isShown) {
      setAlertDisplay('block');
    }

    if (!isShown && !isFaded) {
      setAlertDisplay('none');
    }
  }, [isShown, isFaded, alertReference]);

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

  const handleTriggerClick = useCallback(() => {
    setIsShown(true);
    onShow && onShow();
  }, [onShow]);

  useEffect(() => {
    setIsShown(show);
    onShow && show && onShow();
  }, [show, onShow]);

  useEffect(() => {
    if (stacking) {
      if (isShown) {
        const alerts = document.querySelectorAll(`.alert-${position}`);
        let vOffset = 0;

        const alertPosition = containerRef ? 'alert-absolute' : 'alert-fixed';

        const selectedAlerts = Array.from(alerts).filter(
          (el: any) =>
            el.classList.contains('show') &&
            el !== alertReference.current &&
            el.classList.contains(alertPosition) &&
            el.classList.contains('stacking-alert')
        );

        if (selectedAlerts.length > 0) {
          const posY = position?.split('-')[0];
          let offsetValue;

          if (posY === 'top') {
            offsetValue =
              (selectedAlerts[selectedAlerts.length - 1] as HTMLElement).offsetTop +
              (selectedAlerts[selectedAlerts.length - 1] as HTMLElement).offsetHeight;
          } else {
            offsetValue =
              parseInt((selectedAlerts[selectedAlerts.length - 1] as HTMLElement).style.bottom) +
              (selectedAlerts[selectedAlerts.length - 1] as HTMLElement).offsetHeight;
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
  }, [stacking, isShown, alertReference, verticalOffset, offset, position, containerRef]);

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
      containerRef.current.classList.add('parent-alert-relative');
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
      timer = setTimeout(() => {
        setIsFaded(true);
      }, 100);
    } else if (!isShown) {
      isFaded && onClose?.();
      secondTimer = setTimeout(() => {
        isFaded && onClosed?.();
        setIsFaded(false);
      }, 100);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [isShown, autohide, onClosed, onClose, isFaded]);

  const alertContent = (
    <div
      className={alertClasses}
      ref={alertReference}
      style={{ ...placement, width: width === 'unset' ? width : `${width}px`, display: alertDisplay }}
      {...props}
    >
      {children}
    </div>
  );

  if (isShown || isFaded) {
    return appendToBody ? ReactDOM.createPortal(alertContent, document.body) : alertContent;
  } else {
    return <></>;
  }
};

export default MDBAlert;
