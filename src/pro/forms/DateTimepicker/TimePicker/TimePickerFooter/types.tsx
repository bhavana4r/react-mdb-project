import React from 'react';

type TimePickerFooterProps = {
  className?: string;
  setOpenPicker: React.Dispatch<React.SetStateAction<'date' | 'time' | null>>;
  [rest: string]: any;
};

export { TimePickerFooterProps };
