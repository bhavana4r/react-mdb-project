import clsx from 'clsx';
import React from 'react';
import type { LightboxItemProps } from './types';

const MDBLightboxItem: React.FC<LightboxItemProps> = React.forwardRef<HTMLImageElement, LightboxItemProps>(
  ({ className, fullscreenSrc, disabled, caption, ...props }, ref) => {
    const classes = clsx('lightbox-item', disabled && 'lightbox-disabled', className);

    return <img ref={ref} data-mdb-caption={caption} data-mdb-img={fullscreenSrc} className={classes} {...props} />;
  }
);

MDBLightboxItem.displayName = 'MDBLightboxItem';

export default MDBLightboxItem;
