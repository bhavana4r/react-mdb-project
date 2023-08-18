import { useEffect, useState } from 'react';
import { RowsType } from '../../types';
import { isAdvancedColumn, isSimpleColumn, searchFilter, sortData } from '../utils';
import { useActiveDataProps } from './types';

export const useActiveData = ({
  dataColumns,
  dataRows,
  sort,
  searchValue,
  advancedSearch,
  advancedSearchValue,
}: useActiveDataProps): RowsType => {
  const [activeData, setActiveData] = useState(dataRows);

  useEffect(() => {
    const { column, option } = sort;
    const { phrase, columns } = advancedSearchValue;
    let newData;

    if (column) {
      let advancedIndex;
      let simpleIndex = 0;

      if (isAdvancedColumn(dataColumns)) {
        advancedIndex = dataColumns.find((row) => row.label === column);
      }

      if (isSimpleColumn(dataColumns)) {
        simpleIndex = dataColumns.indexOf(column);
      }

      newData = sortData(dataRows, advancedIndex ? advancedIndex.field : simpleIndex, option);
    }

    if (searchValue && !advancedSearch) {
      newData = searchFilter(newData ? newData : dataRows, searchValue, undefined);
    }

    if (phrase) {
      newData = searchFilter(newData ? newData : dataRows, phrase, columns);
    }

    if (!newData) {
      setActiveData(dataRows);
    } else {
      setActiveData(newData);
    }
  }, [sort, dataRows, dataColumns, searchValue, advancedSearch, advancedSearchValue]);

  return activeData;
};

export default useActiveData;
