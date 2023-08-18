import clsx from 'clsx';
import React, { CSSProperties, ReactNode } from 'react';
import { AdvancedBodyProps } from './types';

const AdvancedBody: React.FC<AdvancedBodyProps> = ({ row, dataColumns, format, editable }) => {
  return (
    <>
      {dataColumns.map((column, j) => {
        const { field, fixed, width, fixedValue, columnSelector } = column;

        const rowElement = row[field] as ReactNode;
        const isRowANumber = Number(rowElement);

        const formatStyle = format?.(field, isRowANumber ? Number(rowElement) : String(rowElement));
        const fixedStyle = {
          minWidth: width,
          maxWidth: width,
          left: fixed === 'left' && (fixedValue ? fixedValue : 0),
          right: fixed === 'right' && (fixedValue ? fixedValue : 0),
        };

        const mixedStyles = { ...fixedStyle, ...formatStyle };

        const tdClass = clsx(fixed && 'fixed-cell', columnSelector && `mdb-datatable-${columnSelector}`);

        return (
          <td contentEditable={editable} className={tdClass} style={mixedStyles as CSSProperties} key={j}>
            {rowElement}
          </td>
        );
      })}
    </>
  );
};

export default AdvancedBody;
