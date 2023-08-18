import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useAnimatedRefProps, StartType } from './types';

export const useAnimatedRef = <T extends HTMLElement>({
  animation = 'slide-right',
  delay,
  infinite,
  duration = 500,
  repeatOnScroll,
  reset,
  start = 'onClick',
  externalElement,
}: useAnimatedRefProps): MutableRefObject<any> => {
  const el = useRef<T>(null);
  const isInViewport = useRef(false);

  const isOnScreen = useCallback(() => {
    if (!el.current) return;

    const rect = el.current.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.right <= (innerWidth || document.documentElement.clientWidth) &&
      rect.bottom <= (innerHeight || document.documentElement.clientHeight);

    isInViewport.current = inViewport;
  }, [el]);

  useEffect(() => {
    isOnScreen(); // Check if element is in viewport on first render

    addEventListener('scroll', isOnScreen);

    return () => removeEventListener('scroll', isOnScreen);
  }, [isOnScreen]);

  const addElementStyles = useCallback(() => {
    if (!el.current) return;

    delay && (el.current.style.animationDelay = delay.toString() + 'ms');

    duration && (el.current.style.animationDuration = duration.toString() + 'ms');

    infinite && (el.current.style.animationIterationCount = 'infinite');

    el.current.classList.add(animation, 'animation');
  }, [delay, duration, el, infinite, animation]);

  const removeElementStyles = useCallback(() => {
    if (!el.current) return;

    el.current.style.animationDelay = '';
    el.current.style.animationDuration = '';
    el.current.style.animationIterationCount = '';
    el.current.classList.remove(animation, 'animation');
  }, [animation, el]);

  const repeatAnimation = useCallback(() => {
    if (!reset) return;

    el.current?.addEventListener('animationend', removeElementStyles);
  }, [el, removeElementStyles, reset]);

  const animate = useCallback(
    (when: StartType) => {
      if (when === 'onLoad') {
        repeatAnimation();
        addElementStyles();
        return;
      }

      if (when === 'onClick') {
        repeatAnimation();
        externalElement
          ? externalElement.current?.addEventListener('click', addElementStyles)
          : el.current?.addEventListener('click', addElementStyles);
        return;
      }

      if (when === 'onHover') {
        repeatAnimation();
        externalElement
          ? externalElement.current?.addEventListener('mouseenter', addElementStyles)
          : el.current?.addEventListener('mouseenter', addElementStyles);
        return;
      }

      if (when === 'onScroll') {
        addEventListener('scroll', () => {
          if (el.current?.classList.contains(animation) && !repeatOnScroll) return;

          if (isInViewport.current) {
            addElementStyles();
            return;
          }
          // Remove animation styles when element is not in viewport
          removeElementStyles();
        });
      }
    },
    [
      addElementStyles,
      isInViewport,
      el,
      removeElementStyles,
      repeatAnimation,
      animation,
      repeatOnScroll,
      externalElement,
    ]
  );

  useEffect(() => animate(start), [animate, start]); // Start the animations

  return el;
};

export default useAnimatedRef;
