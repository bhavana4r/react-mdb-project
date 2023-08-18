import React, { ChangeEvent, useImperativeHandle, useRef, useState, KeyboardEvent } from 'react';
import type { AutocompleteProps } from './types';
import clsx from 'clsx';
import MDBInput from '../../../free/forms/Input/Input';
import AutocompleteDropdown from './AutocompleteDropdown/AutocompleteDropdown';
import AutocompleteItem from './AutocompleteItem/AutocompleteItem';
import useAutocompleteKeydown from './hooks/useAutocompleteKeydowns';

const MDBAutocomplete: React.FC<AutocompleteProps> = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      autoSelect,
      className,
      customContent,
      data = [],
      displayValue,
      isLoading,
      listHeight,
      noResults = 'No results found',
      itemContent,
      onSelect,
      onSearch,
      onChange,
      onClose,
      onOpen,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const activeElement = useAutocompleteKeydown({ isOpen, setIsOpen, length: data.length });

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const classes = clsx(isOpen && 'focused', 'autocomplete-input', className);
    const labelClasses = clsx((isOpen || innerRef.current?.value) && 'active', 'autocomplete-label');

    const onFocus = () => {
      setIsOpen(true);
      onOpen?.();

      if (!innerRef.current) return;

      !innerRef.current.value && onSearch?.('');
    };

    const selectValue = (item: string | Record<string, unknown>) => {
      return displayValue ? displayValue(item as Record<string, string | number>) : item;
    };

    const onSelectOption = (option: string) => {
      setIsOpen(false);

      if (!innerRef.current) return;

      innerRef.current.value = option;
      onSearch?.(option);
      onSelect?.(option);
      onChange?.(option);
      onClose?.();
    };

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      onSearch?.(e.target.value);
      onChange?.(e.target.value);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      const isEnter = e.key === 'Enter';
      const isTab = e.key === 'Tab';

      if (!isOpen) return setIsOpen(true);

      if (activeElement === -1) return;

      if (isEnter || (autoSelect && isTab)) onSelectOption(selectValue(data[activeElement]) as string);
    };

    return (
      <>
        <MDBInput
          autoComplete='off'
          onKeyDown={onKeyDown}
          onChange={onChangeValue}
          onFocus={onFocus}
          className={classes}
          labelClass={labelClasses}
          ref={innerRef}
          role='combobox'
          {...props}
        >
          {isLoading && (
            <div className='autocomplete-loader spinner-border'>
              <span className='sr-only'>Loading...</span>
            </div>
          )}
        </MDBInput>
        <AutocompleteDropdown
          show={isOpen}
          inputRef={innerRef}
          setIsOpen={setIsOpen}
          customContent={customContent}
          listHeight={listHeight}
        >
          {data.length === 0 && <li className='autocomplete-item autocomplete-no-results'>{noResults}</li>}
          {data.map((item, i) => (
            <AutocompleteItem
              isActive={activeElement === i}
              value={selectValue(item)}
              onSelect={onSelectOption}
              key={i}
            >
              {itemContent ? itemContent(item as Record<string, string | number>) : selectValue(item)}
            </AutocompleteItem>
          ))}
        </AutocompleteDropdown>
      </>
    );
  }
);

export default MDBAutocomplete;
