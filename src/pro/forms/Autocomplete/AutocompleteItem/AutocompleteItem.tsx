import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import type { AutocompleteItemProps } from './types';

const MDBAutocompleteItem: React.FC<AutocompleteItemProps> = ({
  className,
  isActive,
  children,
  onSelect,
  value,
  ...props
}) => {
  const classes = clsx('autocomplete-item', isActive && 'active', className);

  const innerRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!isActive || !innerRef.current) return;

    (innerRef.current as any).scrollIntoViewIfNeeded();
  }, [isActive]);

  return (
    <li className={classes} onClick={() => onSelect(value)} ref={innerRef} {...props}>
      {children}
    </li>
  );
};

export default MDBAutocompleteItem;
