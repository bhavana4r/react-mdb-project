import React from 'react';
import { BaseComponent } from '../../../../types/baseComponent';

interface StepperStepProps extends BaseComponent {
  customValidation?: (input: HTMLInputElement) => boolean;
  headClassName?: string;
  contentClassName?: string;
  headStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  itemId: number;
  headIcon?: React.ReactNode;
  headText?: React.ReactNode;
}

export { StepperStepProps };
