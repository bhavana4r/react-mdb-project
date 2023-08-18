import { CSSProperties, ReactNode } from 'react';
import { BaseComponent } from '../../../types/baseComponent';

type AdvancedRecord = Record<string, unknown> & { rowSelector?: string };

type AdvancedHeader = {
  label: string;
  field: keyof AdvancedRecord;
  sort?: boolean;
  width?: number;
  fixed?: string;
  fixedValue?: number;
  columnSelector?: string;
};

type HeaderType = string | AdvancedHeader;
type RecordsType = unknown[] | AdvancedRecord;

type ColumnsType = HeaderType[];
type RowsType = RecordsType[];

type DataType = {
  columns: ColumnsType;
  rows: RowsType;
};

interface DatatableProps extends BaseComponent {
  allText?: string;
  bordered?: boolean;
  borderless?: boolean;
  borderColor?: string;
  color?: string;
  data: DataType;
  dark?: boolean;
  entries?: number;
  entriesOptions?: number[];
  editable?: boolean;
  fixedHeader?: boolean;
  fullPagination?: boolean;
  hover?: boolean;
  loaderClass?: string;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  multi?: boolean;
  noFoundMessage?: ReactNode;
  ofText?: ReactNode;
  pagination?: boolean;
  rowsText?: string;
  selectable?: boolean;
  sm?: boolean;
  searchInputProps?: Record<string, unknown>;
  striped?: boolean;
  sortField?: string;
  sortOrder?: string;
  search?: boolean;
  onSelectRow?: (selectedRows: RowsType, selectedIndexes: number[], allSelected: boolean) => void;
  onRowClick?: (row: RecordsType) => void;
  format?: (field: string | number | symbol, value: string | number) => CSSProperties | undefined;
  advancedSearch?: (value: string) => { phrase: string; columns: string | string[] };
}

export { DatatableProps, AdvancedHeader, AdvancedRecord, RowsType, ColumnsType, RecordsType };
