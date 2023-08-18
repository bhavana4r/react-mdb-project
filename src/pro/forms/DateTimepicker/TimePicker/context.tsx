import React from 'react';

interface TimePickerProps {
  isPickerOpened: boolean;
  setIsPickerOpened: React.SetStateAction<any>;
  setTimePickerValue: React.SetStateAction<any>;
  setActiveHour: React.SetStateAction<any>;
  setActiveMinute: React.SetStateAction<any>;
  setPeriod: React.SetStateAction<any>;
  setMode: React.SetStateAction<any>;
  setHandAnimation: React.SetStateAction<any>;
  setMinuteAngle: React.SetStateAction<any>;
  setHourAngle: React.SetStateAction<any>;
  submitLabel: string;
  clearLabel: string;
  cancelLabel: string;
  activeHour: number;
  activeMinute: number;
  format: '12h' | '24h' | undefined;
  period: string;
  defaultValue: string | undefined;
  minHour: number | undefined;
  maxHour: number | undefined;
  minPeriod: string;
  maxPeriod: string;
  mode: string;
  handAnimation: boolean;
  maxMinute: number | undefined;
  minMinute: number | undefined;
  minuteAngle: number;
  hourAngle: number;
  inline: boolean | undefined;
  increment: boolean | undefined;
  onChange: ((value: string) => void) | undefined;
}

const TimePickerContext = React.createContext<TimePickerProps>({
  isPickerOpened: false,
  setIsPickerOpened: null,
  setTimePickerValue: null,
  setActiveHour: null,
  setActiveMinute: null,
  setPeriod: null,
  setMode: null,
  setHandAnimation: null,
  setMinuteAngle: null,
  setHourAngle: null,
  submitLabel: '',
  clearLabel: '',
  cancelLabel: '',
  activeHour: 12,
  activeMinute: 12,
  format: '12h',
  period: '',
  defaultValue: '',
  minHour: 0,
  maxHour: 23,
  minPeriod: '',
  maxPeriod: '',
  mode: 'hours',
  handAnimation: false,
  maxMinute: 59,
  minMinute: 0,
  minuteAngle: 360,
  hourAngle: 360,
  inline: false,
  increment: false,
  onChange: () => null,
});

export { TimePickerContext };
