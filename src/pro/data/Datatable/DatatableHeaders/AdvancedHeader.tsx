import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import Icon from '../../../../free/styles/Icon/Icon';
import clsx from 'clsx';
import { DatatableContext } from '../utils/DatatableContext';
import { AdvancedHeaderProps } from './types';

const AdvancedHeader: React.FC<AdvancedHeaderProps> = ({ dataColumns }) => {
  const [iconStyle, setIconStyle] = useState<'rotate(0deg)' | 'rotate(180deg)'>('rotate(0deg)');
  const { sort, fixedHeader, handleSort, isLoading } = useContext(DatatableContext);

  const getIconClass = (column: string) => clsx('datatable-sort-icon', `${column === sort.column && 'active'}`);

  useEffect(() => {
    const newStyle = sort.option === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)';

    setIconStyle(newStyle);
  }, [sort.option]);

  return (
    <>
      {dataColumns.map((column, i) => {
        const { fixedValue, fixed, label } = column;
        const shouldSort = column.sort !== false && !isLoading;

        const cursorStyle = { cursor: clsx(shouldSort && 'pointer') };
        const fixedStyle = {
          left: fixed === 'left' ? (fixedValue ? fixedValue : 0) : undefined,
          right: fixed === 'right' ? (fixedValue ? fixedValue : 0) : undefined,
        };
        const mixedStyle: CSSProperties = { ...cursorStyle, ...fixedStyle };
        const headClass = clsx((fixedHeader || fixed) && 'fixed-cell');

        return (
          <th
            className={headClass}
            key={i}
            style={mixedStyle}
            scope='row'
            onClick={() => shouldSort && handleSort(label)}
          >
            {shouldSort && (
              <Icon
                fas
                icon='arrow-up'
                className={getIconClass(label)}
                style={{ transform: sort.column === label ? iconStyle : 'rotate(0deg)' }}
              />
            )}
            {label}
          </th>
        );
      })}
    </>
  );
};

export default AdvancedHeader;
