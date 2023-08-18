import clsx from 'clsx';
import React, { useEffect, useState, useCallback } from 'react';
import type { PopconfirmProps } from './types';
import ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import MDBBtn from '../../../free/components/Button/Button';

const MDBPopconfirm: React.FC<PopconfirmProps> = ({
  className,
  btnClassName,
  btnChildren,
  confirmBtnText = 'Ok',
  cancelBtnClasses,
  confirmBtnClasses,
  cancelBtnText = 'Cancel',
  placement = 'top',
  children,
  modal = false,
  onClick,
  onConfirm,
  onCancel,
  options,
  popperTag: PopperTag = 'div',
  ...props
}): JSX.Element => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement>();
  const [popperElement, setPopperElement] = useState<HTMLElement>();

  const [isOpen, setIsOpen] = useState(false);

  const [show, setShow] = useState(false);
  const [attachElements, setAttachElements] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, { placement, ...options });

  const classes = clsx(modal ? 'popconfirm-modal' : 'popconfirm-popover', 'shadow-4', className);

  const popconfirmClasses = clsx('popconfirm', !modal && 'fade', show && 'show');

  const handleBtnClick = (e: any) => {
    setIsOpen(true);

    onClick && onClick(e);
  };

  const handleClickOutside = useCallback(
    (event: any) => {
      const isButton = referenceElement === event.target;
      const isPopover = event.target === popperElement;
      const isPopoverContent = popperElement && popperElement.contains(event.target);
      const isButtonContent = referenceElement?.contains(event.target);

      if (!isButton && !isPopover && !isPopoverContent && !isButtonContent) {
        setIsOpen(false);
      }
    },
    [popperElement, referenceElement]
  );

  useEffect(() => {
    if (isOpen) {
      setAttachElements(true);
      setTimeout(() => {
        setShow(true);
      }, 0);
    } else {
      setShow(false);
      modal
        ? setAttachElements(false)
        : setTimeout(() => {
            setAttachElements(false);
          }, 150);
    }
  }, [isOpen, modal]);

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleConfirm = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
    onConfirm?.(e);
    setIsOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
    onCancel?.(e);
    setIsOpen(false);
  };

  const popconfirmBody = (
    <div className={popconfirmClasses}>
      {children}
      <div className='popconfirm-buttons-container'>
        <MDBBtn className={cancelBtnClasses} onClick={handleCancel} size='sm'>
          {cancelBtnText}
        </MDBBtn>
        <MDBBtn className={confirmBtnClasses} onClick={handleConfirm} size='sm'>
          {confirmBtnText}
        </MDBBtn>
      </div>
    </div>
  );

  return (
    <>
      <MDBBtn onClick={handleBtnClick} className={btnClassName} {...props} ref={setReferenceElement as any}>
        {btnChildren}
      </MDBBtn>

      {attachElements &&
        ReactDOM.createPortal(
          <>
            {modal ? (
              <div className='popconfirm-backdrop'>
                <PopperTag ref={setPopperElement} className={classes}>
                  {popconfirmBody}
                </PopperTag>
              </div>
            ) : (
              <PopperTag className={classes} ref={setPopperElement} style={{ ...styles.popper }} {...attributes.popper}>
                {popconfirmBody}
              </PopperTag>
            )}
          </>,
          document.body
        )}
    </>
  );
};

export default MDBPopconfirm;
