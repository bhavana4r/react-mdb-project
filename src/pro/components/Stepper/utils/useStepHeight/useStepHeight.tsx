import { useCallback, useEffect } from 'react';
import { useStepHeightProps } from './types';

export const useStepHeight = ({
  stepRef,
  setHeight,
  isActive,
  isValidated,
  isMobile,
  children,
}: useStepHeightProps): void => {
  const setStepHeight = useCallback(() => {
    const element = stepRef.current;

    const stepContent = element?.querySelector('.stepper-content') as any;
    const contentStyle = stepContent && getComputedStyle(stepContent);
    const stepFooter = element?.parentNode?.querySelector(`.stepper-mobile-footer`) as any;
    const footerStyle = stepFooter ? getComputedStyle(stepFooter) : '';
    let stepHead;

    if (isMobile) {
      stepHead = element?.parentNode?.querySelector('.stepper-mobile-head');
    } else {
      stepHead = element?.querySelector('.stepper-head') as any;
    }

    const headStyle = stepHead && getComputedStyle(stepHead);

    const stepContentHeight =
      stepContent?.offsetHeight + parseFloat(contentStyle?.marginTop) + parseFloat(contentStyle?.marginBottom);

    const stepHeadHeight =
      stepHead?.offsetHeight + parseFloat(headStyle?.marginTop) + parseFloat(headStyle?.marginBottom);

    const stepFooterHeight = footerStyle
      ? stepFooter?.offsetHeight + parseFloat(footerStyle?.marginTop) + parseFloat(footerStyle?.marginBottom)
      : 0;

    setHeight(stepHeadHeight + stepContentHeight + stepFooterHeight);
  }, [setHeight, stepRef, isMobile]);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => {
        setStepHeight();
      }, 10);

      if (isValidated) {
        setTimeout(() => {
          setStepHeight();
        }, 210);
      }

      window.addEventListener('resize', setStepHeight);

      return () => {
        window.removeEventListener('resize', setStepHeight);
      };
    }
  }, [isActive, setStepHeight, isValidated]);

  useEffect(() => {
    setStepHeight();
  }, [children, setStepHeight]);
};

export default useStepHeight;
