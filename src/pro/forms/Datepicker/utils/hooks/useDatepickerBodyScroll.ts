import { useEffect } from 'react';

type useDatepickerBodyScrollProps = {
  isOpen: boolean;
  inline?: boolean;
};

export const useDatepickerBodyScroll = ({ isOpen, inline }: useDatepickerBodyScrollProps): void => {
  useEffect(() => {
    const hasVScroll = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576;

    if (!inline) {
      if (isOpen && hasVScroll) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '17px';
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }

      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen, inline]);
};

export default useDatepickerBodyScroll;
