import React from 'react';
import { BaseComponent } from '../../../types/baseComponent';
import { backgroundColor } from '../../../types/colors';

interface LoadingManagementProps extends BaseComponent {
  backdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  color?: backgroundColor;
  loadingText?: React.ReactNode;
  isOpen?: boolean;
  fullScreen?: boolean;
  overflow?: boolean;
  parentRef?: React.RefObject<any>;
  ref?: React.ForwardedRef<HTMLAllCollection>;
  spinnerElement?: React.ReactNode;
  textClassName?: string;
  textStyles?: React.CSSProperties;
  tag?: React.ComponentProps<any>;
}

export { LoadingManagementProps };
