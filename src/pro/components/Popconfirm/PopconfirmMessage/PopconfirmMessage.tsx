import clsx from 'clsx';
import React from 'react';
import type { PopconfirmMessageProps } from './types';

const MDBPopconfirmMessage: React.FC<PopconfirmMessageProps> = React.forwardRef<
  HTMLAllCollection,
  PopconfirmMessageProps
>(({ className, icon, tag: Tag = 'p', children, ...props }, ref) => {
  const classes = clsx('popconfirm-message', className);

  return (
    <Tag className={classes} ref={ref} {...props}>
      {icon && <span className='popconfirm-icon-container'>{icon}</span>}
      <span className='popconfirm-message-text'>{children}</span>
    </Tag>
  );
});

export default MDBPopconfirmMessage;
