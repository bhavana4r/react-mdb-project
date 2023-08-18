import React from 'react';

type SelectData = {
  disabled?: boolean;
  hidden?: boolean;
  text?: string;
  defaultSelected?: boolean;
  secondaryText?: React.ReactNode;
  value?: string | number;
  icon?: string;
  active?: boolean;
  optgroup?: string;
};

interface ExtendedSelectData extends SelectData {
  elementPosition: number;
}

interface SelectV2Props extends Omit<React.AllHTMLAttributes<HTMLElement>, 'size' | 'data'> {
  preventFirstSelection?: boolean;
  clearBtn?: boolean;
  disabled?: boolean;
  label?: string;
  optionHeight?: number;
  data: SelectData[];
  inputClassName?: string;
  ref?: React.Ref<any>;
  showRef?: React.RefObject<any>;
  visibleOptions?: number;
  multiple?: boolean;
  optionsSelectedLabel?: string;
  optionGroups?: string[];
  displayedLabels?: number;
  selectAll?: boolean;
  selectAllLabel?: string;
  size?: 'sm' | 'lg';
  contrast?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onValueChange?: (data: SelectData[] | SelectData) => void;
  search?: boolean;
  searchLabel?: string;
  autoSelect?: boolean;
  noResultsText?: string;
  toggleElement?: React.MutableRefObject<any>;
  validation?: boolean;
  validFeedback?: string;
  invalidFeedback?: string;
  selectValue?: Array<string | number> | string | number;
}

export { SelectV2Props, SelectData, ExtendedSelectData };
