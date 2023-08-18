import { ColumnsType, RowsType } from '../../types';

interface useActiveDataProps {
  dataColumns: ColumnsType;
  dataRows: RowsType;
  sort: { column: string; option: '' | 'asc' | 'desc' };
  searchValue: string;
  advancedSearch?: (phrase: string) => { phrase: string; columns?: string[] | string };
  advancedSearchValue: { phrase: string; columns?: string[] | string };
}

export { useActiveDataProps };
