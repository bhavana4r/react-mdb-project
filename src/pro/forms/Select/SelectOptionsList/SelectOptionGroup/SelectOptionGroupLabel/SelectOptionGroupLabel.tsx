import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import type { SelectOptionGroupLabelProps } from './types';

const MDBSelectOptionGroupLabel: React.FC<SelectOptionGroupLabelProps> = ({
  className,
  tag: Tag = 'div',
  children,
  height,
  ...props
}): JSX.Element => {
  const classes = clsx('select-option-group-label', className);
  const [heightOption, setHeightOption] = useState(height);

  useEffect(() => {
    if (height === undefined) {
      setHeightOption(38);
    }
  }, [height]);

  return (
    <Tag className={classes} style={{ height: heightOption }} {...props}>
      {children}
    </Tag>
  );
};

export default MDBSelectOptionGroupLabel;
