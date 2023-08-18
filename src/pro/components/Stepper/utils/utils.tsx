import clsx from 'clsx';

type animationList = 'slide-in-left' | 'slide-in-right' | 'slide-out-right' | 'slide-out-left' | '';
type CustomValidation = (input: HTMLInputElement) => boolean;

export const getAnimation = (hiding: boolean, prev: number, active: number): animationList => {
  let animation: animationList = '';

  const hideLshowR = active > prev;
  const hideRshowL = active < prev;

  if (hiding) {
    animation = clsx(hideLshowR && 'slide-out-left', hideRshowL && 'slide-out-right') as animationList;
  } else {
    animation = clsx(hideLshowR && 'slide-in-right', hideRshowL && 'slide-in-left') as animationList;
  }

  return animation;
};

export const checkValidStep = (stepElement: HTMLLIElement, customValidation?: CustomValidation): boolean => {
  const validateElements = Array.from(stepElement.querySelectorAll('input[required]'));

  return validateElements.every((el: any) => (customValidation ? customValidation(el) : el.checkValidity()));
};
