import { Dispatch, SetStateAction, MouseEvent } from 'react';

const handleMinutesKeys = (
  setActiveMinute: Dispatch<SetStateAction<number>>,
  setMinuteAngle: Dispatch<SetStateAction<number>>,
  increment: boolean,
  activeMinute: number,
  isUp: boolean
): void => {
  const limit = increment ? 55 : 59;
  const addend = increment ? 5 : 1;
  let newValue;

  if (isUp) newValue = activeMinute >= limit ? 0 : activeMinute + addend;
  else newValue = activeMinute <= 0 ? limit : activeMinute - addend;

  setActiveMinute(newValue);
  setMinuteAngle(newValue * 6);
};

const handleHoursKeys = (
  format: '12h' | '24h',
  activeHour: number,
  setActiveHour: Dispatch<SetStateAction<number>>,
  setHourAngle: Dispatch<SetStateAction<number>>,
  isUp: boolean
): void => {
  const limit = format === '12h' ? 12 : 24;

  let newValue = activeHour === 1 ? limit : activeHour - 1;

  if (isUp) newValue = activeHour === limit ? 1 : activeHour + 1;
  else newValue = activeHour === 1 ? limit : activeHour - 1;

  setActiveHour(newValue);
  setHourAngle(newValue * 30);
};

const handleTab = (
  setTabCount: Dispatch<SetStateAction<number>>,
  tabCount: number,
  target?: HTMLDivElement | null
): void => {
  const focusableElemenets = target?.querySelectorAll('[tabindex="0"]');

  if (focusableElemenets && focusableElemenets[tabCount]) {
    (focusableElemenets[tabCount] as HTMLElement).focus();
    tabCount === focusableElemenets.length - 1 ? setTabCount(0) : setTabCount(tabCount + 1);
  }
};

const handleClickOutside = (
  e: MouseEvent<HTMLElement>,
  setIsPickerOpened: Dispatch<SetStateAction<boolean>>,
  inline: boolean,
  target: HTMLDivElement | null,
  inputTarget: HTMLInputElement | null
): void => {
  if (!inline && e.target === target) {
    setIsPickerOpened(false);
  }

  if (
    inline &&
    e.target !== target &&
    !target?.contains(e.target as Node) &&
    e.target !== inputTarget?.parentNode &&
    !inputTarget?.parentNode?.contains(e.target as Node)
  ) {
    setIsPickerOpened(false);
  }
};

export { handleHoursKeys, handleMinutesKeys, handleTab, handleClickOutside };
