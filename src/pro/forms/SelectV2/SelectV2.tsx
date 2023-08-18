import clsx from 'clsx';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import MDBInput from '../../../free/forms/Input/Input';
import SelectV2OptionsList from './SelectV2OptionsList/SelectV2OptionsList';
import type { SelectV2Props, ExtendedSelectData } from './types';
import { UP_ARROW, DOWN_ARROW, ENTER, TAB, ESCAPE } from './keycodes';
import { isArraysEqual } from './utils';

const selectAllIndex = -1;

const MDBSelectV2: React.FC<SelectV2Props> = ({
  data,
  className,
  inputClassName,
  optionHeight = 38,
  visibleOptions = 5,
  disabled,
  placeholder,
  label,
  clearBtn,
  children,
  multiple,
  displayedLabels = 5,
  optionsSelectedLabel = 'options selected',
  selectAll = true,
  selectAllLabel = 'Select all',
  size,
  showRef,
  contrast = false,
  onOpen,
  onClose,
  onValueChange,
  search = false,
  searchLabel = 'Search...',
  autoSelect = false,
  noResultsText = 'No results',
  validation = false,
  validFeedback = 'Valid',
  invalidFeedback = 'Invalid',
  preventFirstSelection = false,
  value,
  ...props
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [fakeValue, setFakeValue] = useState<null | string>(null);

  const [referenceElement, setReferenceElement] = useState<HTMLElement>();
  const [popperElement, setPopperElement] = useState<HTMLElement>();

  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');

  const [activeElementIndex, setActiveElementIndex] = useState(() => {
    if (selectAll) {
      return selectAllIndex;
    } else {
      return data.findIndex((el) => !el.disabled);
    }
  });
  const [selectedElements, setSelectedElements] = useState<number[]>([]);

  const [selectData, setSelectData] = useState<ExtendedSelectData[]>([]);

  const [inputWidth, setInputWidth] = useState('');
  const [maxDropdownHeight, setMaxDropdownHeight] = useState(0);

  const [isRendered, setIsRendered] = useState(false);

  const classes = clsx('select-wrapper', className);
  const inputClasses = clsx('select-input', placeholder && 'placeholder-active', isOpen && 'focused', inputClassName);
  const labelClasses = clsx(isOpen || (fakeValue && label) ? 'active' : '', label && 'select-label');
  const selectDropdownClasses = clsx('select-dropdown', isOpen && isFaded && 'open');

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const combinedVisibleOptions = useMemo(
    () => (multiple && selectAll ? visibleOptions + 1 : visibleOptions),
    [selectAll, visibleOptions, multiple]
  );

  const filteredData = useMemo(() => {
    return selectData.filter(
      (item) => item.text?.toLocaleLowerCase().includes(query.toLocaleLowerCase()) || item.optgroup
    );
  }, [query, selectData]);

  // validation

  useEffect(() => {
    if (!validation) return;

    const hasSelectedAnOption = selectedElements.every((index) => selectData[index].value);
    const isEverySelectedNotDisabled = selectedElements.every((index) => !selectData[index].disabled);
    const areOptionsSelected = selectedElements.length > 0;

    const combinedBasicStatements =
      !multiple && (!areOptionsSelected || !hasSelectedAnOption || !isEverySelectedNotDisabled);
    const combinedMultipleStatements = multiple && (!areOptionsSelected || !isEverySelectedNotDisabled);

    if (combinedBasicStatements) {
      (referenceElement as HTMLInputElement)?.setCustomValidity(invalidFeedback);
    } else if (combinedMultipleStatements) {
      (referenceElement as HTMLInputElement)?.setCustomValidity(invalidFeedback);
    } else {
      (referenceElement as HTMLInputElement)?.setCustomValidity('');
    }
  }, [validation, invalidFeedback, selectedElements, referenceElement, selectData, inputValue, multiple]);

  const scrollOptions = (index: number) => {
    if (selectData.length === 0) return;

    const list = dropdownWrapperRef.current as HTMLElement;
    const listHeight = list.offsetHeight;
    const scrollTop = list.scrollTop;

    const hiddenOptionsCount = selectData.filter((el) => el.hidden && el.elementPosition < index).length;
    const indexCount = multiple && selectAll ? index + 1 : index;
    const firstIndex = multiple && selectAll ? -2 : -1;

    if (index > firstIndex) {
      const optionOffset = (indexCount - hiddenOptionsCount) * optionHeight;
      const isBelow = optionOffset + optionHeight > scrollTop + listHeight;
      const isAbove = optionOffset < scrollTop;

      if (isAbove) {
        list.scrollTop = optionOffset;
      } else if (isBelow) {
        list.scrollTop = optionOffset - listHeight + optionHeight;
      } else {
        list.scrollTop = scrollTop;
      }
    }
  };

  const setNextOptionActive = (): number => {
    const findOptionIndexInFilteredData = (index: number) => {
      return filteredData.findIndex((option) => option.elementPosition == index);
    };
    let index = activeElementIndex;

    while (index < selectData.length - 1) {
      index++;
      const isOptionInFilteredData = findOptionIndexInFilteredData(index) != -1;
      const isOptionDisabledOrHidden = selectData[index].disabled || selectData[index].hidden;
      const isPrevOptionIsLastInFilteredData =
        filteredData[findOptionIndexInFilteredData(index - 1)] === filteredData[filteredData.length - 1];

      if (
        (index === selectData.length && (!isOptionInFilteredData || isOptionDisabledOrHidden)) ||
        isPrevOptionIsLastInFilteredData
      ) {
        return activeElementIndex;
      } else if (isOptionInFilteredData && !isOptionDisabledOrHidden) {
        break;
      }
    }
    return index;
  };

  const setPreviousOptionActive = (): number => {
    let index = activeElementIndex;

    while (index >= 0) {
      index -= 1;
      const isActiveElementInFilteredData = filteredData.findIndex((option) => option.elementPosition == index) != -1;
      const isOptionDisabledOrHidden = index >= 0 && (selectData[index].disabled || selectData[index].hidden);

      if (index <= 0 && (!isActiveElementInFilteredData || isOptionDisabledOrHidden)) {
        return multiple && selectAll ? (index = -1) : activeElementIndex;
      } else if (isActiveElementInFilteredData && !isOptionDisabledOrHidden) {
        break;
      }
    }
    return index;
  };

  const handleKeyboard = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (![UP_ARROW, DOWN_ARROW, ENTER, TAB, ESCAPE].includes(key)) return;

    if (key === TAB) {
      autoSelect && handleOptionClick(filteredData[activeElementIndex]);
      referenceElement?.focus();

      return setIsOpen(false);
    }

    e.preventDefault();

    if (key === DOWN_ARROW) {
      const newIndex = setNextOptionActive();
      if (!isOpen) {
        return multiple ? setIsOpen(true) : setSelectedElements([newIndex]);
      }
      scrollOptions(newIndex);
      return setActiveElementIndex(newIndex);
    }

    if (key === UP_ARROW) {
      const newIndex = setPreviousOptionActive();
      if (!isOpen) {
        return multiple ? setIsOpen(true) : setSelectedElements([newIndex]);
      }
      scrollOptions(newIndex);
      return setActiveElementIndex(newIndex);
    }

    if (key === ENTER) {
      const selectedOptionIndex = filteredData.findIndex((option) => option.elementPosition == activeElementIndex);

      if (!isOpen) return setIsOpen(true);

      return activeElementIndex === selectAllIndex
        ? handleSelectAll()
        : handleOptionClick(filteredData[selectedOptionIndex]);
    }

    if (key === ESCAPE) {
      setIsOpen(false);

      return referenceElement?.focus();
    }
  };

  const toggleOpen = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (showRef && showRef.current === e.target) {
        return;
      }

      const popperExist = popperElement && popperElement !== null;
      const referenceExist = referenceElement && referenceElement !== null;
      const isOutsideSelect =
        !popperElement?.contains(e.target as Node) && !referenceElement?.contains(e.target as Node);
      const isArrow = (e.target as Node) === arrowRef.current;

      if (popperExist && isOpen && referenceExist) {
        if (isOutsideSelect && !isArrow) {
          setIsOpen(false);
        }
      }
    },
    [popperElement, referenceElement, isOpen, showRef]
  );

  useEffect(() => {
    const preparedData = data.map((el, index) => {
      return { ...el, elementPosition: index };
    });

    if (isArraysEqual(preparedData, selectData)) {
      return;
    }

    setSelectData(preparedData);
  }, [data, selectData]);

  const handleResize = useCallback(() => {
    isOpen && setInputWidth(`${referenceElement?.offsetWidth}px`);
  }, [referenceElement, isOpen]);

  const handleSelectAll = () => {
    if (!multiple || !selectAll) {
      return;
    }
    if (selectedElements.length === data.filter((el) => !el.disabled && !el.optgroup).length) {
      setSelectedElements([]);
      onValueChange?.([]);

      return updateMultipleInput([]);
    }

    const dataIndexes = selectData?.filter((el) => !el.disabled && !el.optgroup).map((el) => el.elementPosition);
    setSelectedElements(dataIndexes);
    onValueChange?.(data.filter((el) => !el.disabled));

    return updateMultipleInput(dataIndexes);
  };

  const updateInput = useCallback(() => {
    if (selectData.length === 0) return;

    let selectedOptionIndex: number | undefined = selectedElements[0];
    const noSelectedOption: boolean = selectedOptionIndex === undefined;
    if (isRendered && !multiple) {
      if ((noSelectedOption && preventFirstSelection) || !isRendered || multiple) {
        return;
      } else if (noSelectedOption) {
        selectedOptionIndex = 0;
      }

      const optionValue = selectData[selectedOptionIndex].value;
      const optionText = String(selectData[selectedOptionIndex].text);

      if (!optionText) {
        setFakeValue(null);
        setInputValue(optionValue ? ' ' : '');
      } else {
        setFakeValue(optionValue ? null : optionText);
        setInputValue(optionValue ? optionText : '');
      }
    }
  }, [multiple, isRendered, selectedElements, selectData, preventFirstSelection]);

  const updateMultipleInput = useCallback(
    (newData: number[]) => {
      const isTextExtended = displayedLabels === -1 || newData.length > displayedLabels;

      if (newData.length <= 0) {
        setFakeValue(null);
        setInputValue('');
      }

      if (isTextExtended) {
        setFakeValue(null);
        return setInputValue(`${newData.length} ${optionsSelectedLabel}`);
      }

      const selectedOptionsTextArray = newData
        .map((itemIndex: number) => selectData[itemIndex].text || '')
        .filter((value: any) => value !== '');

      const selectedOptionsValuesArray = newData
        .map((itemIndex: number) => selectData[itemIndex].value || '')
        .filter((value: any) => value !== '');

      const isEveryOptionTextEmpty = selectedOptionsTextArray.findIndex((text: string) => text !== '') === -1;
      const isAnyOptionWithValue = selectedOptionsValuesArray.length > 0;
      const optionsTextCombined = selectedOptionsTextArray.join(', ');

      if (isEveryOptionTextEmpty) {
        setFakeValue(null);
        isAnyOptionWithValue ? setInputValue(' ') : setInputValue('');
      } else {
        isAnyOptionWithValue
          ? (setInputValue(optionsTextCombined), setFakeValue(null))
          : (setInputValue(''), setFakeValue(optionsTextCombined));
      }
    },
    [displayedLabels, optionsSelectedLabel, selectData]
  );

  useEffect(() => {
    updateInput();
  }, [selectedElements, updateInput]);

  const handleOptionClick = (el: ExtendedSelectData) => {
    if (!el || el.disabled) {
      return;
    }
    const { elementPosition } = el;

    if (multiple) {
      const isSelected = selectedElements.includes(elementPosition);

      const newData = isSelected
        ? selectedElements.filter((itemIndex: number) => itemIndex !== elementPosition)
        : [...selectedElements, elementPosition];
      setSelectedElements(newData);
      onValueChange?.(newData.map((itemIndex) => data[itemIndex]));

      return updateMultipleInput(newData);
    }
    setSelectedElements([elementPosition]);

    onValueChange?.(data[elementPosition]);
    setIsOpen(false);

    return referenceElement?.focus();
  };

  useEffect(() => {
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if (multiple) {
      const selectedItems = selectData.filter((el) => el.defaultSelected).map((el) => el.elementPosition);
      updateMultipleInput(selectedItems);

      return setSelectedElements(selectedItems);
    }
    let selectedIndex = selectData.findIndex((el) => el.defaultSelected);

    // if there's no default selected item - get first not disabled one
    if (selectedIndex === selectAllIndex && !preventFirstSelection) {
      selectedIndex = selectData.findIndex((el) => !el.disabled && !el.hidden);
    }

    // additional check if all elements are disabled
    // and there's no default selected element
    if (selectedIndex !== selectAllIndex) {
      setSelectedElements([selectedIndex]);
    }
  }, [selectData, updateMultipleInput, multiple, preventFirstSelection]);

  useEffect(() => {
    if (isOpen && search && selectedElements.length === 0) {
      return setActiveElementIndex(selectAllIndex);
    }
    if (!isOpen) {
      selectedElements.length > 0 ? setActiveElementIndex(Math.max(...selectedElements)) : setActiveElementIndex(0);
    }
  }, [filteredData, isOpen, search, selectedElements]);

  useEffect(() => {
    setMaxDropdownHeight(combinedVisibleOptions * optionHeight);
  }, [combinedVisibleOptions, optionHeight]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleClickOutside, handleResize, isOpen]);

  useEffect(() => {
    if (isFaded) {
      isRendered && onOpen?.();
      search && searchRef.current?.focus();
    } else {
      isRendered && onClose?.();
      search && setQuery('');
    }
  }, [isFaded, onOpen, onClose, search, selectData, isRendered]);

  useEffect(() => {
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setIsFaded(isOpen);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (showRef) {
      const selector = showRef.current;
      selector?.addEventListener('click', toggleOpen);

      return () => {
        selector?.removeEventListener('click', toggleOpen);
      };
    }
  }, [showRef, toggleOpen]);

  useEffect(() => {
    if (!value) return;

    const selectValuesArray = Array.isArray(value) ? value : [value];

    const selectedOptionsIndexes = selectData
      .filter((el) => el.value && selectValuesArray.includes(el.value))
      .map((el) => el.elementPosition);

    if (selectedOptionsIndexes.toString() === selectedElements.toString()) return;

    const dataToReturn = multiple
      ? selectedOptionsIndexes.map((itemIndex) => selectData[itemIndex])
      : selectData[selectedOptionsIndexes[0]];

    onValueChange?.(dataToReturn);
    setSelectedElements(selectedOptionsIndexes);

    multiple ? updateMultipleInput(selectedOptionsIndexes) : updateInput();
  }, [value, selectData, multiple, onValueChange, selectedElements, updateInput, updateMultipleInput]);

  return (
    <div className={classes} {...props}>
      <>
        <MDBInput
          ref={setReferenceElement as any}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyboard}
          className={inputClasses}
          value={inputValue}
          readonly={!validation}
          required={validation}
          disabled={disabled}
          placeholder={fakeValue ? undefined : placeholder}
          label={label}
          labelClass={labelClasses}
          size={size}
          contrast={contrast}
        >
          {validation && (
            <>
              <div className='invalid-feedback'>{invalidFeedback}</div>
              <div className='valid-feedback'>{validFeedback}</div>
            </>
          )}
          {fakeValue && <div className='form-label select-fake-value active'>{fakeValue}</div>}

          {clearBtn && (inputValue.length > 0 || fakeValue) && (
            <span
              tabIndex={0}
              className='select-clear-btn d-block'
              role='button'
              onClick={() => {
                setInputValue('');
                setSelectedElements([]);
                onValueChange?.(multiple ? [] : {});
              }}
            >
              ✕
            </span>
          )}
          <span
            className='select-arrow'
            ref={arrowRef}
            onClick={() => {
              if (disabled) return;
              setIsOpen(!isOpen);
              referenceElement?.focus();
            }}
            style={{ cursor: 'pointer' }}
          ></span>
        </MDBInput>

        {data?.length > 0 &&
          (isOpen || isFaded) &&
          createPortal(
            <div
              style={{ ...styles.popper, width: inputWidth, zIndex: 1070 }}
              {...attributes.popper}
              ref={setPopperElement as any}
              className='select-dropdown-container'
            >
              <div tabIndex={0} className={selectDropdownClasses}>
                {search && (
                  <div className='input-group'>
                    <input
                      onKeyDown={handleKeyboard}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                      ref={searchRef}
                      type='text'
                      className='form-control select-filter-input'
                      role='searchbox'
                      placeholder={searchLabel}
                    />
                  </div>
                )}
                <div
                  className='select-options-wrapper'
                  ref={dropdownWrapperRef}
                  style={{ maxHeight: `${maxDropdownHeight}px` }}
                >
                  <SelectV2OptionsList
                    data={data}
                    selectData={filteredData}
                    selectedElements={selectedElements}
                    optionHeight={optionHeight}
                    visibleOptions={combinedVisibleOptions}
                    handleOptionClick={handleOptionClick}
                    handleSelectAll={handleSelectAll}
                    selectAll={selectAll}
                    selectAllLabel={selectAllLabel}
                    multiple={multiple}
                    activeElementIndex={activeElementIndex}
                    noResults={noResultsText}
                    search={search}
                  />
                </div>
                {children && <div className='select-custom-content'>{children}</div>}
              </div>
            </div>,
            document.body
          )}
      </>
    </div>
  );
};

export default MDBSelectV2;
