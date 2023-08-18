import { Dispatch, SetStateAction } from 'react';

type TimePickerHeaderProps = {
  className?: string;
  setOpenPicker: Dispatch<SetStateAction<'date' | 'time' | null>>;
  [rest: string]: any;
};

export { TimePickerHeaderProps };
