import { ReactNode } from 'react';
import { BaseComponent } from '../../../types/baseComponent';

interface DatepickerProps extends BaseComponent {
  cancelBtnText?: string;
  clearBtnText?: ReactNode;
  customIcon?: string;
  customHeader?: ReactNode;
  disablePast?: boolean;
  disableFuture?: boolean;
  defaultValue?: string;
  icon?: string;
  inputId?: string;
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
  getFormattedDateValues?: (event: {
    dayNumber: string;
    weekdayShort: string;
    weekdayFull: string;
    monthShort: string;
    monthFull: string;
    yearShort: string;
    yearFull: string;
  }) => void;
  value?: string;
  wrapperClass?: string;
  selectOnClick?: boolean;
  [rest: string]: any;
}

const defaultDatepickerProps = {
  closeOnEsc: true,
  title: 'Select date',
  okBtnText: 'Ok',
  clearBtnText: 'Clear',
  cancelBtnText: 'Cancel',
  customIcon: 'far fa-calendar',
  customHeader: '',
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
