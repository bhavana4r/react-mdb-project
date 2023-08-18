import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import type { RatingProps } from './types';
import { RatingContext } from './RatingContext';

const MDBRating: React.FC<RatingProps> = ({
  className,
  readonly = false,
  defaultValue = 0,
  dynamic,
  children,
  onChange,
  ...props
}) => {
  const classes = clsx('rating', className);
  const [hovered, setHovered] = useState(0);
  const [dynamicStyle, setDynamicStyle] = useState({ color: '', icon: '' });
  const [active, setActive] = useState(defaultValue);

  useEffect(() => {
    onChange?.(active);
  }, [onChange, active]);

  return (
    <ul className={classes} {...props}>
      <RatingContext.Provider
        value={{
          readonly,
          activeItem: active,
          setActiveItem: setActive,
          hoveredItem: hovered,
          setHoveredItem: setHovered,
          dynamic: dynamic,
          dynamicStyle: dynamicStyle,
          setDynamicStyle: setDynamicStyle,
        }}
      >
        {children}
      </RatingContext.Provider>
    </ul>
  );
};

export default MDBRating;
