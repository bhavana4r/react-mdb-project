import React, { Dispatch, SetStateAction } from 'react';

interface DatepickerProps {
  view: 'days' | 'years' | 'months';
  setView: React.SetStateAction<any>;
  activeDate: Date;
  setActiveDate: React.SetStateAction<any>;
  selectedDate?: Date;
  setSelectedDate: React.SetStateAction<any>;
  weekdaysShort: Array<string>;
  monthsShort: Array<string>;
  monthsFull: Array<string>;
  min?: Date;
  max?: Date;
  setIsClosing: React.SetStateAction<any>;
  weekdaysFull: Array<string>;
  yearScope: Array<number>;
  tabCount: number;
  inline?: boolean;
  isClosing: boolean;
  setOpenPicker: Dispatch<SetStateAction<'date' | 'time' | null>>;
}

const DatepickerContext = React.createContext<DatepickerProps>({
  view: 'days',
  setView: null,
  activeDate: new Date(),
  setActiveDate: null,
  selectedDate: new Date(),
  setSelectedDate: null,
  weekdaysShort: [],
  monthsShort: [],
  monthsFull: [],
  min: undefined,
  max: undefined,
  setIsClosing: null,
  weekdaysFull: [],
  yearScope: [],
  tabCount: 0,
  inline: false,
  isClosing: false,
  setOpenPicker: () => 'date',
});

export { DatepickerContext };
