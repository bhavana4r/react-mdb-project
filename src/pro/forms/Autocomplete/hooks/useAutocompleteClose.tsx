import { Dispatch, RefObject, SetStateAction, useCallback, useEffect } from 'react';

type UseAutocompleteClosesProps = {
  dropdownRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const useAutocompleteClose = ({ inputRef, dropdownRef, setIsOpen }: UseAutocompleteClosesProps) => {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const isInput = inputRef.current === e.target;
      const isDropdown = dropdownRef.current === e.target;
      const isDropdownContent = dropdownRef.current?.contains(e.target as Node);

      if (!isInput && !isDropdown && !isDropdownContent) {
        setIsOpen(false);
      }
    },
    [setIsOpen, dropdownRef, inputRef]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useAutocompleteClose;
