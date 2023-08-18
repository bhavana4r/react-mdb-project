import React, { useContext, useEffect, useState } from 'react';
import Icon from '../../../../free/styles/Icon/Icon';
import clsx from 'clsx';

import { DatatableContext } from '../utils/DatatableContext';
import { BasicHeaderProps } from './types';

const BasicHeader: React.FC<BasicHeaderProps> = ({ dataColumns }) => {
  const { sort, fixedHeader, handleSort } = useContext(DatatableContext);
  const [iconStyle, setIconStyle] = useState<'rotate(0deg)' | 'rotate(180deg)'>('rotate(0deg)');

  const getIconClass = (column: string) => clsx('datatable-sort-icon', `${column === sort.column && 'active'}`);

  useEffect(() => {
    const newStyle = sort.option === 'desc' ? 'rotate(180deg)' : 'rotate(0deg)';

    setIconStyle(newStyle);
  }, [sort.option]);

  return (
    <>
      {dataColumns.map((column, i) => (
        <th
          className={fixedHeader ? 'fixed-cell' : ''}
          key={i}
          style={{ cursor: 'pointer' }}
          scope='row'
          onClick={() => handleSort(column)}
        >
          <Icon
            fas
            icon='arrow-up'
            className={getIconClass(column)}
            style={{ transform: column === sort.column ? iconStyle : 'rotate(0deg)' }}
          />
          {column}
        </th>
      ))}
    </>
  );
};

export default BasicHeader;
