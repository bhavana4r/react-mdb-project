import { useEffect } from 'react';

type useDatepickerBodyScrollProps = {
  openPicker: 'date' | 'time' | null;
  inline?: boolean;
};

export const useDatepickerBodyScroll = ({ openPicker, inline }: useDatepickerBodyScrollProps): void => {
  useEffect(() => {
    const hasVScroll = window.innerWidth > document.documentElement.clientWidth && window.innerWidth >= 576;

    if (!inline) {
      if (openPicker === 'date' && hasVScroll) {
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
  }, [openPicker, inline]);
};

export default useDatepickerBodyScroll;
