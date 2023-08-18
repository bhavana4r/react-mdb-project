import React, { ReactNode } from 'react';
import { BasicBodyProps } from './types';

const BasicBody: React.FC<BasicBodyProps> = ({ row, editable }) => (
  <>
    {row.map((cell, j) => (
      <td contentEditable={editable} key={j}>
        {cell as ReactNode}
      </td>
    ))}
  </>
);

export default BasicBody;
