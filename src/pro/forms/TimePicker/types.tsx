type TimepickerProps = {
  amLabel?: string;
  pmLabel?: string;
  btnIcon?: boolean;
  customValue?: string;
  className?: string;
  clearLabel?: string;
  customIconSize?:
    | 'sm'
    | '1x'
    | '2x'
    | '3x'
    | '4x'
    | '5x'
    | '6x'
    | '7x'
    | '8x'
    | '9x'
    | '10x'
    | '2xs'
    | 'xs'
    | 'lg'
    | 'xl'
    | '2xl';
  customIcon?: string;
  cancelLabel?: string;
  defaultValue?: string | Date;
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
  disablePast?: boolean;
  disableFuture?: boolean;
  disabled?: boolean;
  switchHoursToMinutesOnClick?: boolean;
  headId?: string;
  bodyId?: string;
  [rest: string]: any;
};

export { TimepickerProps };
