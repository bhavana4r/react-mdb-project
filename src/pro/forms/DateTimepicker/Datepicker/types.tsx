import { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react';
import { BaseComponent } from 'src/types/baseComponent';

interface DatepickerProps extends BaseComponent {
  cancelBtnText?: string;
  clearBtnText?: ReactNode;
  customIcon?: string;
  defaultValue?: string;
  icon?: string;
  inputLabel?: ReactNode;
  inputToggle?: boolean;
  inline?: boolean;
  format?: string;
  filter?: (date: Date) => boolean;
  min?: Date;
  max?: Date;
  monthsShort?: Array<string>;
  monthsFull?: Array<string>;
  okBtnText?: ReactNode;
  startDay?: number;
  title?: string;
  views?: 'days' | 'months' | 'years';
  weekdaysShort?: Array<string>;
  weekdaysNarrow?: Array<string>;
  weekdaysFull?: Array<string>;
  onChange?: (value: string, date: Date) => void;
  onClose?: () => void;
  onOpen?: () => void;
  value?: string;
  wrapperClass?: string;
  openPicker: 'time' | 'date' | null;
  setOpenPicker: Dispatch<SetStateAction<'time' | 'date' | null>>;
  setDatePickerValue: Dispatch<SetStateAction<string>>;
  datePickerValue: string;
  referenceElement: HTMLDivElement | null;
  popperElement: HTMLElement | null;
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
}

const defaultDatepickerProps = {
  closeOnEsc: true,
  title: 'Select date',
  okBtnText: 'Ok',
  clearBtnText: 'Clear',
  cancelBtnText: 'Cancel',
  customIcon: 'far fa-calendar',
  inputLabel: 'Select a date',
  monthsFull: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  views: 'days' as 'days' | 'months' | 'years',
  format: 'dd/mm/yyyy',
  weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysNarrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  startDay: 0,
};

export { DatepickerProps, defaultDatepickerProps };
