import { CSSProperties, ReactNode } from 'react';
import { AdvancedHeader, AdvancedRecord, ColumnsType, RecordsType, RowsType } from '../types';

type DatableBodyProps = {
  activeData: RowsType;
  dataRows: RowsType;
  dataColumns: ColumnsType;
  isOnThePage: (index: number) => boolean;
  noFoundMessage?: ReactNode;
  onRowClick?: (row: RecordsType) => void;
  format?: (field: string | number | symbol, value: string | number) => CSSProperties | undefined;
  selectable?: boolean;
  handleRowSelect: (rowIndex: number) => void;
  selectedRows: number[];
  editable?: boolean;
};

type BasicBodyProps = {
  row: unknown[];
  editable?: boolean;
};

type AdvancedBodyProps = {
  row: AdvancedRecord;
  dataColumns: AdvancedHeader[];
  format?: (field: string | number | symbol, value: string | number) => CSSProperties | undefined;
  editable?: boolean;
};

export { DatableBodyProps, BasicBodyProps, AdvancedBodyProps };
