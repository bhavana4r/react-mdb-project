import { BaseComponent } from '../../../types/baseComponent';
import { backgroundColor } from '../../../types/colors';

interface AlertProps extends BaseComponent {
  appendToBody?: boolean;
  alertRef?: React.MutableRefObject<any>;
  autohide?: boolean;
  color?: backgroundColor;
  containerRef?: React.MutableRefObject<any>;
  delay?: number;
  onShow?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  offset?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  show?: boolean;
  stacking?: boolean;
  triggerRef?: React.MutableRefObject<any>;
  width?: number | string;
}

export { AlertProps };
