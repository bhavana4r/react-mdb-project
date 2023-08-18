import { Dispatch, SetStateAction } from 'react';
type DatepickerDayProps = {
  filter?: (date: Date) => boolean;
  startWeekdays: Array<string>;
  startDay: number;
  inlineDayClick: (date: Date) => void;
  setOpenPicker: Dispatch<SetStateAction<'date' | 'time' | null>>;
};

export { DatepickerDayProps };
