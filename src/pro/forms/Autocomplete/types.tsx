import React, { ReactNode } from 'react';

import { InputProps } from '../../../free/forms/Input/types';

type AutocompleteProps = Omit<InputProps, 'onSelect' | 'onChange'> & {
  autoSelect?: boolean;
  customContent?: ReactNode;
  data?: string[] | Record<string, string | number>[];
  listHeight?: string;
  isLoading?: boolean;
  noResults?: string;
  ref?: React.Ref<HTMLInputElement>;
  displayValue?: (row: Record<string, string | number>) => any;
  itemContent?: (value: Record<string, string | number>) => ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  onSelect?: (value: string) => void;
  onSearch?: (data: string) => void;
  onChange?: (value: string) => void;
};

export { AutocompleteProps };
