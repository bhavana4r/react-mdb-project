import { AdvancedHeader, AdvancedRecord, ColumnsType, RecordsType, RowsType } from '../types';

export const searchFilter = (rows: RowsType, search: string, column?: string[] | string): RowsType => {
  const match = (entry: any) => {
    return entry.toString().toLowerCase().includes(search.toLowerCase());
  };

  return rows.filter((row: any) => {
    if (column && typeof column === 'string') {
      return match(row[column]);
    }

    let values = Object.values(row);

    if (column && Array.isArray(column)) {
      values = Object.keys(row)
        .filter((key) => column.includes(key))
        .map((key) => row[key]);
    }

    return (
      values.filter((value) => {
        return match(value);
      }).length > 0
    );
  });
};

export const sortData = (data: RowsType, field: number | string, order: string): RowsType => {
  const sorted = Object.assign([], data).sort((a: any, b: any) => {
    const fieldA = typeof a[field] === 'string' ? a[field].toLowerCase() : a[field];
    const fieldB = typeof b[field] === 'string' ? b[field].toLowerCase() : b[field];

    if (fieldA < fieldB) {
      return order === 'desc' ? 1 : -1;
    }
    if (fieldA > fieldB) {
      return order === 'desc' ? -1 : 1;
    }
    return 0;
  });

  return sorted;
};

export const isSimpleColumn = (columns: ColumnsType): columns is string[] =>
  columns.every((col) => typeof col === 'string');

export const isAdvancedColumn = (columns: ColumnsType): columns is AdvancedHeader[] =>
  !columns.every((col) => typeof col === 'string');

export const isSimpleRow = (row: RecordsType): row is unknown[] => Array.isArray(row);

export const isAdvancedRow = (row: RecordsType): row is AdvancedRecord => !Array.isArray(row);
