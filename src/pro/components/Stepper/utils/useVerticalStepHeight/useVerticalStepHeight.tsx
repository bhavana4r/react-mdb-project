import { useCallback, useEffect, useRef } from 'react';
import { useStepVerticalHeight } from './types';

export const useVerticalStepHeight = ({ stepRef, show, isValidated }: useStepVerticalHeight): void => {
  const stepPadding = useRef({ paddingTop: 0, paddingBottom: 0 });

  const handleResize = useCallback(() => {
    const stepContent = stepRef.current;

    if (!stepContent) return;

    let stepHeight;

    if (show) {
      stepContent.style.height = '';
      stepHeight = stepContent.scrollHeight;
    } else {
      const { paddingBottom, paddingTop } = stepPadding.current;
      stepHeight = stepContent.scrollHeight + paddingBottom + paddingTop;
    }

    stepContent.style.height = `${stepHeight}px`;
  }, [stepRef, stepPadding, show]);

  useEffect(() => {
    const stepElement = stepRef.current;

    if (!stepElement) return;

    const stepComputed = window.getComputedStyle(stepElement);
    const { paddingTop, paddingBottom } = stepComputed;

    stepPadding.current = { paddingBottom: parseFloat(paddingBottom), paddingTop: parseFloat(paddingTop) };

    stepElement.style.height = `${stepElement.scrollHeight}px`;
  }, [stepRef]);

  useEffect(() => {
    if (isValidated) {
      setTimeout(() => {
        handleResize();
      }, 210);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, isValidated]);
};

export default useVerticalStepHeight;
