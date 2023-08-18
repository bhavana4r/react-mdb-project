import { useEffect, useState } from 'react';

type UseAutocompleteAnimationProps = {
  show: boolean;
};

const useAutocompleteAnimation = ({ show }: UseAutocompleteAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (show) {
      setIsVisible(true);
    } else {
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  return isVisible;
};

export default useAutocompleteAnimation;
