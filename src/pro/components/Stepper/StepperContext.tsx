import React from 'react';

interface StepperProps {
  activeItem: number;
  setActiveItem: React.SetStateAction<any>;
  prevActive: React.MutableRefObject<number>;
  setHeight: React.SetStateAction<any>;
  completed: number[];
  noEditable?: boolean;
  isAnimating: React.MutableRefObject<boolean>;
  linear?: boolean;
  formRef: React.MutableRefObject<any>;
  validate: { target: number; after: number };
  setValidate: React.SetStateAction<any>;
  type?: 'vertical' | 'horizontal' | 'mobile';
  stepsLength: number;
  onValid?: (id: number) => void;
  onInvalid?: (id: number) => void;
  mobileProgress?: boolean;
  disableHeadSteps?: boolean;
  animations?: boolean;
}

const StepperContext = React.createContext<StepperProps>({
  activeItem: 1,
  setActiveItem: null,
  prevActive: { current: 1 },
  setHeight: null,
  completed: [],
  noEditable: false,
  isAnimating: { current: false },
  linear: false,
  formRef: { current: null },
  validate: { target: 0, after: 0 },
  setValidate: null,
  type: 'horizontal',
  stepsLength: 0,
  onValid: undefined,
  onInvalid: undefined,
  mobileProgress: false,
  disableHeadSteps: false,
  animations: true,
});

export { StepperContext };
