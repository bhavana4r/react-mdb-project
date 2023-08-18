import React, { useContext } from 'react';
import Select from '../../../forms/SelectV2/SelectV2';
import { SelectData } from 'src/pro/forms/SelectV2/types';
import Icon from '../../../../free/styles/Icon/Icon';
import Button from '../../../../free/components/Button/Button';
import type { DatatablePaginationProps } from './types';
import { DatatableContext } from '../utils/DatatableContext';

const MDBDatatablePagination: React.FC<DatatablePaginationProps> = ({
  fullPagination,
  rowsText = 'Rows per page:',
  selectValue,
  setSelectValue,
  activeDataLength,
  entriesOptions = [10, 25, 50, 200],
  fullDataLength,
  allText = 'All',
  ofText = 'of',
}) => {
  const { isLoading, activePage, setActivePage } = useContext(DatatableContext);

  const isLeftArrowDisabled = activePage === 0 || isLoading;
  const isRightArrowDisabled = activeDataLength <= selectValue * (activePage + 1) || isLoading;
  const isFullRightArrowDisabled = activePage === Math.floor(activeDataLength / selectValue);

  const selectData = entriesOptions.map((option) => ({
    text: option.toString(),
    value: option,
    defaultSelected: selectValue === option,
  }));

  selectData.push({
    text: allText,
    value: fullDataLength,
    defaultSelected: selectValue === fullDataLength,
  });

  const handleSelectValueChange = (selectedOption: SelectData | SelectData[]) => {
    if (selectedOption instanceof Array) return;

    setSelectValue(selectedOption.value);
    setActivePage(0);
  };

  const paginationFooter = `${activePage * selectValue + 1} - ${
    (activePage + 1) * selectValue > activeDataLength ? activeDataLength : (activePage + 1) * selectValue
  } ${ofText} ${activeDataLength}`;

  return (
    <div className='datatable-pagination'>
      <div className='datatable-select-wrapper'>
        <p className='datatable-select-text'>{rowsText}</p>
        <Select onValueChange={handleSelectValueChange} data={selectData} disabled={isLoading} />
      </div>

      <div className='datatable-pagination-nav'>{paginationFooter}</div>
      <div className='datatable-pagination-buttons'>
        {fullPagination && (
          <Button
            disabled={isLeftArrowDisabled}
            onClick={() => setActivePage(0)}
            className='datatable-pagination-button datatable-pagination-start'
            color='link'
          >
            <Icon icon='angle-double-left' />
          </Button>
        )}

        <Button
          disabled={isLeftArrowDisabled}
          onClick={() => setActivePage(activePage - 1)}
          className='datatable-pagination-button datatable-pagination-left'
          color='link'
        >
          <Icon icon='chevron-left' />
        </Button>
        <Button
          disabled={isRightArrowDisabled}
          onClick={() => setActivePage(activePage + 1)}
          className='datatable-pagination-button datatable-pagination-right'
          color='link'
        >
          <Icon icon='chevron-right' />
        </Button>

        {fullPagination && (
          <Button
            disabled={isFullRightArrowDisabled}
            onClick={() => setActivePage(Math.floor(activeDataLength / selectValue))}
            className='datatable-pagination-button datatable-pagination-end'
            color='link'
          >
            <Icon icon='angle-double-right' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MDBDatatablePagination;
