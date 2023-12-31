import { BaseComponent } from '../../../types/baseComponent';
import { backgroundColor } from '../../../types/colors';

interface SideNavProps extends BaseComponent {
  color?: backgroundColor;
  bgColor?: string;
  isOpen?: boolean;
  light?: boolean;
  relative?: boolean;
  absolute?: boolean;
  right?: boolean;
  slim?: boolean;
  slimCollapsed?: boolean;
  backdrop?: boolean;
  mode?: 'over' | 'side' | 'push' | string;
  accordion?: boolean;
  closeOnEsc?: boolean;
  constant?: boolean;
  contentRef?: HTMLElement;
  getOpenState?: React.Dispatch<React.SetStateAction<any>>;
  nonInvasive?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export { SideNavProps };
