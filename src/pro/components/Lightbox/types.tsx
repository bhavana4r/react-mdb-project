import React from 'react';
import { BaseComponent } from '../../../types/baseComponent';

interface LightboxProps extends BaseComponent {
  fontAwesome?: 'pro' | 'free';
  zoomLevel?: number;
  lightboxRef?: React.MutableRefObject<any>;
  tag?: React.ComponentProps<any>;
  onOpen?: () => void;
  onClose?: () => void;
  onSlide?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export { LightboxProps };
