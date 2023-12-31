import React from 'react';
import { SelectData, ExtendedSelectData } from '../types';

interface SelectV2OptionsListProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'size' | 'data'> {
  optionHeight?: number;
  data: SelectData[];
  selectData: ExtendedSelectData[];
  visibleOptions?: number;
  multiple?: boolean;
  selectAll?: boolean;
  selectAllLabel?: string;
  selectedElements: number[];
  activeElementIndex: number;
  noResults: string;
  search?: boolean;
  handleSelectAll: () => any;
  handleOptionClick: (el: any) => any;
}

export { SelectV2OptionsListProps, ExtendedSelectData };
