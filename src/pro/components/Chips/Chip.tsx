import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import type { ChipProps } from './types';

const MDBChip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, closeIcon, tag: Tag = 'div', color, size, children, onDelete, ...props }, ref) => {
    const [show, setShow] = useState(true);
    const chipClasses = clsx('chip', size && `chip-${size}`, color && `chip-outline btn-outline-${color}`, className);

    const handleClick = () => {
      onDelete?.(children);
      setShow(false);
    };

    return show ? (
      <Tag ref={ref} className={chipClasses} {...props}>
        {children}
        {closeIcon && <i className='close fas fa-times' onClick={handleClick} />}
      </Tag>
    ) : null;
  }
);

export default MDBChip;
