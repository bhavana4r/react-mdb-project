import { MutableRefObject, SetStateAction, useCallback, useEffect } from 'react';

type useDatepickerClickOutsideProps = {
  isOpen: boolean;
  inline?: boolean;
  popperElement: any;
  referenceElement: any;
  setIsClosing: SetStateAction<any>;
  backdropRef: MutableRefObject<HTMLDivElement | null>;
};

export const useDatepickerClickOutside = ({
  isOpen,
  inline,
  popperElement,
  referenceElement,
  setIsClosing,
  backdropRef,
}: useDatepickerClickOutsideProps): void => {
  const handleClickOutside = useCallback(
    (e: any) => {
      if (inline) {
        const shouldHidePicker =
          !popperElement?.contains(e.target as Node) &&
          !referenceElement?.parentNode?.contains(e.target as Node) &&
          !e.target.classList.contains('datepicker-view-change-button') &&
          !e.target.classList.contains('datepicker-large-cell-content');

        if (shouldHidePicker) {
          setIsClosing(true);
        }
      } else {
        if (e.target === backdropRef.current) {
          setIsClosing(true);
        }
      }
    },
    [popperElement, referenceElement, backdropRef, inline, setIsClosing]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, isOpen]);
};

export default useDatepickerClickOutside;
