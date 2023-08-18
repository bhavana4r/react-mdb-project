import React, { useState, ChangeEvent, useEffect } from 'react';
import type { DatatableProps } from './types';
import DatatablePagination from './DatatablePagination/DatatablePagination';

import Table from '../../../free/data/Tables/Table';
import TableHead from '../../../free/data/Tables/TableHead/TableHead';

import Checkbox from '../../../free/forms/Checkbox/Checkbox';
import clsx from 'clsx';
import { isAdvancedColumn, isSimpleColumn } from './utils/utils';
import { DatatableContext } from './utils/DatatableContext';
import MDBDatatableSearch from './DatatableSearch/DatatableSearch';
import BasicHeader from './DatatableHeaders/BasicHeader';
import AdvancedHeader from './DatatableHeaders/AdvancedHeader';
import DatableBody from './DatatableBody/DatatableBody';
import MDBScrollbar from '../../methods/PerfectScrollbar/PerfectScrollbar';
import useActiveData from './utils/useActiveData/useActiveData';

const MDBDatatable: React.FC<DatatableProps> = React.forwardRef<HTMLDivElement, DatatableProps>(
  (
    {
      advancedSearch,
      allText,
      className,
      bordered,
      borderless,
      borderColor = '',
      color = '',
      dark,
      entries = 10,
      editable,
      entriesOptions,
      fixedHeader,
      fullPagination,
      hover,
      format,
      loaderClass = 'bg-primary',
      isLoading,
      loadingMessage = 'Loading results...',
      maxWidth = '',
      maxHeight = '',
      multi,
      noFoundMessage = 'No matching results found',
      pagination = true,
      selectable,
      sortField = '',
      searchInputProps,
      sortOrder = 'asc',
      sm,
      striped,
      rowsText,
      data = {
        columns: [],
        rows: [],
      },
      search,
      onSelectRow,
      onRowClick,
      searchLabel,
      ofText,
      ...props
    },
    ref
  ) => {
    const [activePage, setActivePage] = useState(0);
    const [selectValue, setSelectValue] = useState(entries);
    const [sort, setSort] = useState<{ column: string; option: 'asc' | 'desc' | '' }>({ column: '', option: '' });
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const [searchValue, setSearchValue] = useState('');
    const [advancedSearchValue, setAdvancedSearchValue] = useState<{ phrase: string; columns?: string[] | string }>({
      phrase: '',
      columns: '',
    });

    const activeData = useActiveData({
      dataColumns: data.columns,
      dataRows: data.rows,
      sort,
      searchValue,
      advancedSearch,
      advancedSearchValue,
    });

    const classes = clsx(
      'datatable',
      hover && 'datatable-hover',
      color && `bg-${color}`,
      dark && 'datatable-dark',
      bordered && 'datatable-bordered',
      borderless && 'datatable-borderless',
      borderColor && `border-${borderColor}`,
      striped && 'datatable-striped',
      sm && 'datatable-sm',
      isLoading && 'datatable-loading',
      className
    );

    const isOnThePage = (i: number) => activePage * selectValue <= i && i < (activePage + 1) * selectValue;

    const handleSort = (newColumn: string) => {
      const { column, option } = sort;

      if (column === newColumn) {
        if (option === 'asc') {
          setSort({ ...sort, option: 'desc' });
        } else {
          setSort({ column: '', option: '' });
        }
      } else {
        setSort({ column: newColumn, option: 'asc' });
      }
    };

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
      const checkboxElement = e.currentTarget;
      const isChecked = checkboxElement.checked;
      const newSelection = isChecked ? Array.from({ length: data.rows.length }, (x, i) => i) : [];

      const dataRows = newSelection.map((index) => activeData[index]);

      onSelectRow?.(dataRows, newSelection, isChecked);
      setSelectedRows(newSelection);
    };

    const handleRowSelect = (rowIndex: number) => {
      const includesRow = selectedRows.includes(rowIndex);
      let newSelection: number[];

      if (multi) {
        includesRow
          ? (newSelection = selectedRows.filter((i) => i !== rowIndex))
          : (newSelection = [...selectedRows, rowIndex]);
      } else {
        includesRow ? (newSelection = []) : (newSelection = [rowIndex]);
      }

      const dataRows = newSelection.map((index) => activeData[index]);
      const allSelected = newSelection.length === data.rows.length;

      onSelectRow?.(dataRows, newSelection, allSelected);

      setSelectedRows(newSelection);
    };

    useEffect(() => {
      const order = sortOrder as 'asc' | 'desc' | '';

      sortField && setSort({ column: sortField, option: order });
    }, [sortField, sortOrder]);

    useEffect(() => {
      setActivePage(0);
    }, [searchValue]);

    return (
      <DatatableContext.Provider
        value={{
          isLoading,
          activePage,
          setActivePage,
          sort,
          fixedHeader,
          handleSort,
        }}
      >
        <MDBDatatableSearch
          search={search}
          advancedSearch={advancedSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchInputProps={searchInputProps}
          label={searchLabel}
          setAdvancedSearchValue={setAdvancedSearchValue}
        />
        <div className={classes} ref={ref} style={{ maxWidth }} {...props}>
          <MDBScrollbar
            className='datatable-inner table-responsive ps'
            style={{ overflow: 'auto', position: 'relative', maxWidth, maxHeight }}
          >
            <Table className='datatable-table'>
              <TableHead className='datatable-header'>
                <tr>
                  {selectable && (
                    <th className={fixedHeader ? 'fixed-cell' : ''}>
                      {multi && (
                        <Checkbox checked={selectedRows.length === data.rows.length} onChange={handleSelectAll} />
                      )}
                    </th>
                  )}
                  {isSimpleColumn(data.columns) && <BasicHeader dataColumns={data.columns} />}
                  {isAdvancedColumn(data.columns) && <AdvancedHeader dataColumns={data.columns} />}
                </tr>
              </TableHead>
              <DatableBody
                activeData={activeData}
                dataColumns={data.columns}
                dataRows={data.rows}
                isOnThePage={isOnThePage}
                onRowClick={onRowClick}
                format={format}
                handleRowSelect={handleRowSelect}
                selectedRows={selectedRows}
                selectable={selectable}
                noFoundMessage={noFoundMessage}
                editable={editable}
              />
            </Table>
          </MDBScrollbar>
          {isLoading && (
            <>
              <div className='datatable-loader bg-light}'>
                <span className='datatable-loader-inner'>
                  <span className={clsx('datatable-progress', loaderClass)}></span>
                </span>
              </div>
              <p className='text-center text-muted my-4'>{loadingMessage}</p>
            </>
          )}
          {pagination && (
            <DatatablePagination
              fullPagination={fullPagination}
              selectValue={selectValue}
              setSelectValue={setSelectValue}
              activeDataLength={activeData.length}
              rowsText={rowsText}
              entriesOptions={entriesOptions}
              fullDataLength={data.rows.length}
              allText={allText}
              ofText={ofText}
            />
          )}
        </div>
      </DatatableContext.Provider>
    );
  }
);

export default MDBDatatable;
