import React from 'react';
import { BaseComponent } from '../../../../types/baseComponent';

interface PopconfirmMessageProps extends BaseComponent {
  icon?: React.ReactNode;
  ref?: React.ForwardedRef<HTMLAllCollection>;
  tag?: React.ComponentProps<any>;
}

export { PopconfirmMessageProps };
