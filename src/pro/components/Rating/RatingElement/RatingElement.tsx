import clsx from 'clsx';
import React, { useContext, useEffect } from 'react';
import MDBTooltip from '../../../../free/components/Tooltip/Tooltip';
import type { RatingElementProps } from './types';
import { RatingContext } from '../RatingContext';
import MDBIcon from '../../../../free/styles/Icon/Icon';
import MDBPopover from '../../../../free/components/Popover/Popover';
import MDBPopoverBody from '../../../../free/components/Popover/PopoverBody/PopoverBody';

const MDBRatingElement: React.FC<RatingElementProps> = ({
  className,
  color,
  itemId,
  iconClassName,
  insertAfter,
  insertBefore,
  icon,
  onClick,
  onMouseEnter,
  onMouseLeave,
  popover,
  size = 'sm',
  title,
  style,
  ...props
}) => {
  const { activeItem, setActiveItem, hoveredItem, setHoveredItem, dynamic, dynamicStyle, setDynamicStyle, readonly } =
    useContext(RatingContext);

  const isActive = (!hoveredItem && activeItem && activeItem >= itemId) || hoveredItem >= itemId;
  const iconClasses = clsx(isActive && 'active', !color && 'text-primary', iconClassName);

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (readonly) return;
    setActiveItem && setActiveItem(itemId);
    onClick && onClick(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (readonly) return;
    setActiveItem && setHoveredItem(itemId);
    onMouseEnter && onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (readonly) return;
    setActiveItem && setHoveredItem(0);
    onMouseLeave && onMouseLeave(e);
  };

  useEffect(() => {
    if (dynamic) {
      const dynamicValue = hoveredItem ? hoveredItem : activeItem;

      dynamicValue === itemId && setDynamicStyle({ color, icon });
    }
  }, [activeItem, itemId, color, icon, dynamic, setDynamicStyle, hoveredItem]);

  const ratingElement = (
    <>
      <li
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: readonly ? 'default' : 'pointer', ...style }}
        {...props}
      >
        {insertBefore}
        <MDBIcon
          far={!isActive}
          fas={isActive}
          icon={dynamicStyle.icon ? dynamicStyle.icon : icon}
          size={size}
          className={iconClasses}
          style={{ color: dynamicStyle.color ? dynamicStyle.color : color && color }}
        />
        {insertAfter}
      </li>
    </>
  );

  return (
    <>
      {title ? (
        <MDBTooltip tag='a' title={title}>
          {ratingElement}
        </MDBTooltip>
      ) : popover ? (
        <MDBPopover tag='a' btnChildren={ratingElement}>
          <MDBPopoverBody>{popover}</MDBPopoverBody>
        </MDBPopover>
      ) : (
        ratingElement
      )}
    </>
  );
};

export default MDBRatingElement;
