import { Dispatch, ReactNode, SetStateAction, RefObject } from 'react';

type AutocompleteDropdownProps = {
  className?: string;
  customContent?: ReactNode;
  inputRef: RefObject<HTMLInputElement>;
  show: boolean;
  children: ReactNode;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  listHeight?: string;
};

export { AutocompleteDropdownProps };
