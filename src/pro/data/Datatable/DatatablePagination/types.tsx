import { ReactNode, SetStateAction } from 'react';

type DatatablePaginationProps = {
  allText?: string;
  fullPagination?: boolean;
  rowsText?: ReactNode;
  selectValue: number;
  setSelectValue: SetStateAction<any>;
  activeDataLength: number;
  entriesOptions?: number[];
  fullDataLength: number;
  ofText?: ReactNode;
};

export { DatatablePaginationProps };
