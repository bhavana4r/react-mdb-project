import { ReactNode } from 'react';

type AutocompleteItemProps = {
  className?: string;
  isActive: boolean;
  children: ReactNode;
  onSelect: (value: string) => void;
  value: string;
};

export { AutocompleteItemProps };
