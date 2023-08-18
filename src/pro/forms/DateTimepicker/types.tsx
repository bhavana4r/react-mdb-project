import { BaseComponent } from '../../../types/baseComponent';
import { CSSProperties, RefObject } from 'react';

export interface DateTimepickerProps extends BaseComponent {
  label?: string;
  labelStyle?: CSSProperties;
  labelClass?: string;
  labelRef?: RefObject<HTMLLabelElement>;
  inputRef?: RefObject<HTMLInputElement>;
  inline?: boolean;
  disabled?: boolean;
  defaultTime?: string;
  defaultDate?: string;
  invalidLabel?: string;
  inputToggle?: boolean;
  timepickerOptions?: { [key: string]: any };
  datepickerOptions?: { [key: string]: any };
  showFormat?: boolean;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  appendValidationInfo?: boolean;
  onChange?: (val?: string) => any;
  onOpen?: () => any;
  onClose?: () => any;
}
