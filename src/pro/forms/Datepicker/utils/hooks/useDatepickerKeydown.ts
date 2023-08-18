import React, { useCallback, useEffect, useState, SetStateAction, useRef } from 'react';

import { handleDayView, handleMonthKeyDown, handleYearView } from '../key-utils';

type useDatepickerKeydownProps = {
  setIsClosing: SetStateAction<any>;
  closeOnEsc: boolean;
  isOpen: boolean;
  activeDate: Date;
  setActiveDate: SetStateAction<any>;
  min?: Date;
  max?: Date;
  view: 'months' | 'days' | 'years';
  setView?: SetStateAction<any>;
  setSelectedDate: SetStateAction<any>;
  filter?: (date: Date) => boolean;
  setInlineDate: (date: Date) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
};

export const useDatepickerKeydown = ({
  setIsClosing,
  closeOnEsc,
  isOpen,
  activeDate,
  setActiveDate,
  min,
  max,
  view,
  setView,
  setSelectedDate,
  filter,
  setInlineDate,
  disableFuture,
  disablePast,
}: useDatepickerKeydownProps): { tabCount: number; modalRef: React.MutableRefObject<HTMLDivElement | null> } => {
  const [tabCount, setTabCount] = useState(3);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        setIsClosing(true);
      }
      e.preventDefault();

      if (!e.shiftKey && e.key === 'Tab') {
        const focusableElemenets = modalRef.current?.querySelectorAll('[tabindex="0"]');
        if (focusableElemenets) {
          tabCount === focusableElemenets.length - 1 ? setTabCount(0) : setTabCount(tabCount + 1);
        }
      } else if (e.key === 'Enter') {
        if (tabCount !== 3) {
          document.activeElement && (document.activeElement as HTMLElement).click();
        }
      } else if (e.shiftKey && e.key === 'Tab') {
        const focusableElemenets = modalRef.current?.querySelectorAll('[tabindex="0"]');
        if (focusableElemenets) {
          tabCount === 0 ? setTabCount(focusableElemenets.length - 1) : setTabCount(tabCount - 1);
        }
      }

      const focused = modalRef.current?.querySelector('.focused');

      if (focused && tabCount !== 4) {
        if (view === 'days') {
          handleDayView(
            e.key,
            setActiveDate,
            activeDate,
            min,
            max,
            setSelectedDate,
            filter,
            setInlineDate,
            disableFuture,
            disablePast
          );
        } else if (view === 'years') {
          handleYearView(
            e.key,
            activeDate,
            setActiveDate,
            min,
            max,
            setView,
            setSelectedDate,
            disableFuture,
            disablePast
          );
        } else if (view === 'months') {
          handleMonthKeyDown(
            e.key,
            activeDate,
            setActiveDate,
            min,
            max,
            setView,
            setSelectedDate,
            filter,
            disableFuture,
            disablePast
          );
        }
      }
    },
    [
      activeDate,
      view,
      filter,
      max,
      min,
      closeOnEsc,
      tabCount,
      setIsClosing,
      setView,
      setActiveDate,
      setSelectedDate,
      setInlineDate,
      disableFuture,
      disablePast,
    ]
  );

  useEffect(() => {
    const focusableElemenets = modalRef.current?.querySelectorAll('[tabindex="0"]');
    if (focusableElemenets) {
      const focusedElement = focusableElemenets[tabCount];

      if (focusedElement.tagName !== 'TD') {
        (focusedElement as HTMLElement).focus();

        const focused = modalRef.current?.querySelector('.focused');
        focused?.classList.remove('focused');
      } else {
        (focusableElemenets[tabCount - 1] as HTMLElement).blur();
        focusedElement.classList.add('focused');
      }
    }
  }, [tabCount]);

  useEffect(() => {
    if (!isOpen) setTabCount(3);
  }, [isOpen]);

  useEffect(() => {
    setTabCount(3);
  }, [view]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
      return () => {
        document.removeEventListener('keydown', handleKeydown);
      };
    }
  }, [handleKeydown, isOpen]);

  return { tabCount, modalRef };
};

export default useDatepickerKeydown;
