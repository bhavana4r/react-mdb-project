import { CSSProperties, Dispatch, SetStateAction } from 'react';

type TimepickerProps = {
  btnIcon?: boolean;
  customValue?: string;
  className?: string;
  clearLabel?: string;
  customIconSize?: string;
  customIcon?: string;
  cancelLabel?: string;
  defaultValue?: string;
  inputLabel?: string;
  inputClasses?: string;
  invalidLabel?: string;
  inline?: boolean;
  increment?: boolean;
  format?: '24h' | '12h';
  justInput?: boolean;
  noIcon?: boolean;
  minHour?: number;
  maxHour?: number;
  maxTime?: string;
  minTime?: string;
  onChange?: (value: string) => void;
  showRef?: React.RefObject<any>;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  submitLabel?: string;
  ref?: React.ForwardedRef<HTMLDivElement>;
  timePickerClasses?: string;
  inlinePickerTag?: React.ComponentProps<any>;
  onOpen?: () => void;
  onClose?: () => void;
  openPicker: 'date' | 'time' | null;
  setOpenPicker: Dispatch<SetStateAction<'time' | 'date' | null>>;
  setTimePickerValue: Dispatch<SetStateAction<string>>;
  timePickerValue: string;
  attributes: {
    [key: string]:
      | {
          [key: string]: string;
        }
      | undefined;
  };
  setPopperElement: Dispatch<SetStateAction<HTMLElement | null>>;
  styles: {
    [key: string]: CSSProperties;
  };
  [rest: string]: any;
};

export { TimepickerProps };
