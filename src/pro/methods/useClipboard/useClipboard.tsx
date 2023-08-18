import React, { useCallback, useEffect } from 'react';

const useClipboard = (text: string, trigger: React.MutableRefObject<any>): void => {
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(text);
  }, [text]);

  useEffect(() => {
    const target = trigger.current;

    target.addEventListener('click', handleClick);

    return () => {
      target.removeEventListener('click', handleClick);
    };
  }, [handleClick, trigger]);
};

export default useClipboard;
