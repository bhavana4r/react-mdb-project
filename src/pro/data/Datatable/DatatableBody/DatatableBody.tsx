import React, { useContext } from 'react';
import { isAdvancedColumn, isAdvancedRow, isSimpleRow } from '../utils/utils';
import { DatatableContext } from '../utils/DatatableContext';
import { DatableBodyProps } from './types';
import TableBody from '../../../../free/data/Tables/TableBody/TableBody';
import Checkbox from '../../../../free/forms/Checkbox/Checkbox';
import AdvancedBody from './DatatableAdvancedBody';
import BasicBody from './DatatableBasicBody';
import { RecordsType } from '../types';
import clsx from 'clsx';

const DatableBody: React.FC<DatableBodyProps> = ({
  activeData,
  dataRows,
  isOnThePage,
  noFoundMessage,
  dataColumns,
  onRowClick,
  selectable,
  handleRowSelect,
  selectedRows,
  format,
  editable,
}) => {
  const { isLoading } = useContext(DatatableContext);
  const rowsLength = activeData.length;
  const columnsLength = dataColumns.length;

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: RecordsType) => {
    const trElement = e.target as HTMLInputElement;

    if (trElement.nodeName !== 'INPUT') {
      onRowClick?.(row);
    }
  };

  return (
    <TableBody className='datatable-body'>
      {activeData.map((row, i) => {
        const rowIndex = dataRows.indexOf(row);
        const isSelected = selectedRows.includes(rowIndex);
        const trClass = clsx(
          isSelected && 'active',
          isAdvancedRow(row) && row.rowSelector && `mdb-datatable-${row.rowSelector}`
        );

        if (isOnThePage(i)) {
          return (
            <tr
              onClick={(e) => handleRowClick(e, row)}
              className={trClass}
              key={i}
              style={{ cursor: onRowClick && 'pointer' }}
            >
              {selectable && (
                <td>
                  <Checkbox checked={isSelected} onChange={() => handleRowSelect(rowIndex)} />
                </td>
              )}
              {isSimpleRow(row) && <BasicBody editable={editable} row={row} />}
              {isAdvancedRow(row) && isAdvancedColumn(dataColumns) && (
                <AdvancedBody editable={editable} row={row} dataColumns={dataColumns} format={format} />
              )}
            </tr>
          );
        }
      })}
      {!rowsLength && !isLoading && (
        <tr className='datatable-results-info'>
          <td colSpan={columnsLength} className='text-center'>
            {noFoundMessage}
          </td>
        </tr>
      )}
    </TableBody>
  );
};

export default DatableBody;
