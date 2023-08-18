import clsx from 'clsx';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { usePopper } from 'react-popper';
import MDBInput from '../../../free/forms/Input/Input';
import MDBSelectDropdown from './SelectDropdown/SelectDropdown';
import MDBSelectIconContainer from './SelectIconContainer/SelectIconContainer';
import MDBSelectOption from './SelectOptionsList/SelectOption/SelectOption';
import MDBSelectOptionIcon from './SelectIconContainer/SelectOptionIcon/SelectOptionIcon';
import MDBSelectOptionsList from './SelectOptionsList/SelectOptionsList';
import MDBSelectOptionsWrapper from './SelectOptionsWrapper/SelectOptionsWrapper';
import ReactDOM from 'react-dom';
import type { SelectProps, SelectData } from './types';
import './style.css';

const MDBSelect: React.FC<SelectProps> = ({
  children,
  className,
  clearBtn,
  data,
  tag: Tag = 'div',
  tagWrapper: TagWrapper = 'div',
  visibleOptions = 5,
  placeholder,
  disabled,
  search,
  getValue,
  multiple,
  optionSelected = '5',
  optionsSelectedLabel,
  label,
  getData,
  selectAllLabel = 'Select all',
  noResultLabel = 'No results',
  searchLabel = 'Search...',
  size = 'default',
  validation = false,
  validFeedback,
  invalidFeedback,
  inputClassName,
  searchAriaLabel = 'Search',
  ...props
}): JSX.Element => {
  const [focus, setFocus] = useState(false);
  const [widthInput, setWidthInput] = useState('');
  const [attachELements, setAttachELements] = useState(false);
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>('');
  const refWrapper = useRef<HTMLDivElement>(null);
  const [optionListMaxHeight, setOptionListMaxHeight] = useState<null | string | number>(null);
  const [filteredData, setFilteredData] = useState<SelectData[]>(data);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [activeClassLabel, setActiveClassLabel] = useState(false);
  const [textMultiple, setTextMultiple] = useState<any>([]);
  const [checkedToSelectAll, setCheckedToSelectAll] = useState(false);
  const [testData, setTestData] = useState<SelectData[]>(data);
  const [referenceElement, setReferenceElement] = useState<HTMLElement>();
  const [popperElement, setPopperElement] = useState<HTMLElement>();

  const [indexOption, setIndexOption] = useState(filteredData.findIndex((e: any) => !e.disabled && e.selected));
  const inputRef = useRef<HTMLDivElement>(null);
  const [isFoucsed, setIsFocused] = useState(false);
  const serchInputRef = useRef<HTMLInputElement>(null);
  const [arrowFocus, setArrowFocus] = useState<any>(0);

  const [arrowUpPress, setArrowUpPrees] = useState(false);
  const [arrowDownPress, setArrowDownPrees] = useState(false);

  const optionsWrapperRef = useRef<HTMLDivElement>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });

  const classes = clsx('select-wrapper', className);
  const inputClasses = clsx(
    'select-input',
    placeholder && 'placeholder-active',
    activeClassLabel && label && 'active',
    focus && 'focused',
    size !== 'default' && `form-control-${size}`,
    inputClassName
  );

  useEffect(() => {
    setFilteredData(data);
    setTestData(data);
    const selectedFiltered = data.filter((e: any) => e.selected === true && !e.disabled);

    if (selectedFiltered.length > 0) {
      setInputValue(selectedFiltered[0].text);
    }
  }, [data]);

  useEffect(() => {
    const selectVal: any = [];

    filteredData.forEach((item: any) => {
      if (item.selected) {
        selectVal.push({ text: item.text, value: item.value });
      }
    });

    getValue && selectVal && getValue(multiple ? selectVal : selectVal[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  useEffect(() => {
    if (attachELements && search) {
      setTimeout(() => {
        serchInputRef.current?.focus();
      }, 100);
    }
  }, [attachELements, search]);

  const handeResize = useCallback(() => {
    if (referenceElement === null || referenceElement === undefined) return;

    if (attachELements) {
      setTimeout(() => {
        // eslint-disable-next-line
        //@ts-ignore
        const style = referenceElement.parentNode?.parentNode.getBoundingClientRect();
        // eslint-disable-next-line
        //@ts-ignore
        setWidthInput(style.width);
        // eslint-disable-next-line
        //@ts-ignore
      }, 100);
    }
  }, [referenceElement, attachELements]);

  useEffect(() => {
    if (!validFeedback || !invalidFeedback) return;

    if (referenceElement) {
      if (validFeedback) {
        const validDiv = document.createElement('div');
        validDiv.classList.add('valid-feedback');
        validDiv.innerHTML = validFeedback;
        referenceElement.setAttribute('required', 'true');

        referenceElement.parentNode?.insertBefore(validDiv, referenceElement.nextSibling);
      }

      if (invalidFeedback) {
        const invalidDiv = document.createElement('div');
        invalidDiv.classList.add('invalid-feedback');
        invalidDiv.innerHTML = invalidFeedback;
        referenceElement.setAttribute('required', 'true');

        referenceElement.parentNode?.insertBefore(invalidDiv, referenceElement.nextSibling);
      }
    }
  }, [validFeedback, invalidFeedback, referenceElement]);

  useEffect(() => {
    handeResize();
  }, [handeResize]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (popperElement && popperElement !== null && focus && referenceElement && referenceElement !== null) {
        if (!popperElement.contains(e.target as Node) && !referenceElement.contains(e.target as Node)) {
          setFocus(false);
          setActiveClassLabel(false);
          if (search) {
            setTimeout(() => {
              setSearchInputValue('');
            }, 100);
          }
        } else {
          setActiveClassLabel(true);
        }
      }
    },
    [focus, popperElement, referenceElement, search]
  );

  const handleInputClick = useCallback(() => {
    setFocus(!focus);

    if (search) setSearchInputValue('');
  }, [focus, search]);

  const handleClearBtn = () => {
    setInputValue('');
    setActiveClassLabel(false);

    setFilteredData(
      data.map((e: any) => {
        return { ...e, active: false, selected: false };
      })
    );

    setTestData(
      data.map((e: any) => {
        return { ...e, active: false, selected: false };
      })
    );
  };

  const handleSelectAllClick = () => {
    setCheckedToSelectAll(!checkedToSelectAll);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isFoucsed && !attachELements && arrowFocus !== undefined) {
      if (!multiple) {
        const mappedFocusData = data.map((e: SelectData, index: number) => {
          if (index === arrowFocus) {
            return { ...e, selected: true, active: true };
          } else {
            return { ...e, selected: false, active: false };
          }
        });

        if (arrowFocus <= 0) {
          setInputValue(mappedFocusData[0].text);
        } else if (arrowFocus >= mappedFocusData.length - 1) {
          setInputValue(mappedFocusData[mappedFocusData.length - 1].text);
        } else {
          setInputValue(mappedFocusData[arrowFocus].text);
        }

        const merged = [];

        for (let i = 0; i < data.length; i++) {
          merged.push({
            // eslint-disable-next-line
            // @ts-ignore
            ...data[i],
            ...mappedFocusData.find((itm: any) => itm.text === data[i].text),
          });
        }

        getData && getData(merged);

        setTestData(merged);
        setFilteredData(merged);
      } else {
        setFocus(true);
      }
    }

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowFocus]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let secondTimer: ReturnType<typeof setTimeout>;

    if (focus) {
      setAttachELements(true);

      if (label) {
        setActiveClassLabel(true);
      }

      secondTimer = setTimeout(() => {
        setShow(true);
      }, 100);
    } else {
      timer = setTimeout(() => {
        setAttachELements(false);
      }, 100);

      if (label) {
        setActiveClassLabel(false);
      }
      setShow(false);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, [focus, label]);

  useEffect(() => {
    if (!multiple) return;
    if (checkedToSelectAll) {
      const newData = filteredData.map((e) => {
        return { ...e, selected: true, active: true };
      });
      setFilteredData(newData);
      const textSelected = newData.filter((e) => !e.disabled).map((e: any) => e.text);
      setTextMultiple(textSelected);
      setInputValue(`${textSelected.length} option${textSelected.length <= 1 ? '' : 's'} selected`);
    } else {
      setFilteredData(testData);
      const textSelected = testData.filter((e) => !e.disabled && e.selected).map((e: any) => e.text);
      setTextMultiple(textSelected);
      setInputValue(`${textSelected.length} option${textSelected.length <= 1 ? '' : 's'} selected`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedToSelectAll]);

  useEffect(() => {
    if (!multiple) return;

    if (textMultiple.length >= Number(optionSelected)) {
      if (optionsSelectedLabel) {
        setInputValue(optionsSelectedLabel);
      } else {
        setInputValue(`${textMultiple.length} option${textMultiple.length <= 1 ? '' : 's'} selected`);
      }
    } else {
      setInputValue(textMultiple.join(', '));
    }
  }, [textMultiple, multiple, optionSelected, optionsSelectedLabel]);

  useEffect(() => {
    if (!multiple) {
      const selectedData = filteredData.map((e: any) => {
        if (e.selected === undefined) {
          return { ...e, active: false, selected: false };
        } else {
          return { ...e, active: true };
        }
      });
      const selectedFiltered = selectedData.filter((e: any) => e.selected === true && !e.disabled);

      if (selectedFiltered.length > 0) {
        setFilteredData(selectedData);
        setInputValue(selectedFiltered[0].text);
      }
      getData && getData(selectedData);
    } else {
      const selectedData = data.map((e: any) => {
        if (e.selected === undefined) {
          return { ...e, active: false, selected: false };
        } else {
          return { ...e, active: true };
        }
      });
      setFilteredData(selectedData);
      const textSelected = testData.filter((e: any) => e.selected === true && !e.disabled).map((e) => e.text);
      setTextMultiple(textSelected);
      if (textMultiple.length >= Number(optionSelected)) {
        setInputValue(`${textMultiple.length} option${textMultiple.length <= 1 ? '' : 's'} selected`);
      } else {
        setInputValue(textMultiple.join(', '));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (attachELements) {
      window.addEventListener('resize', handeResize);
    }
    return () => {
      window.removeEventListener('resize', handeResize);
    };
  }, [handeResize, attachELements]);

  useEffect(() => {
    if (attachELements) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside, attachELements]);

  const handeStyleElements = useCallback(
    (array: any, arr: number[], visibile = visibleOptions) => {
      [...array].slice(0, visibile as number).forEach((e: any) => {
        const { height } = getComputedStyle(e);

        arr.push(parseFloat(height));
      });

      return arr;
    },
    [visibleOptions]
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (attachELements) {
      const ref = refWrapper.current?.children;
      const arr: number[] = [];
      timer = setTimeout(() => {
        if (ref === undefined) return;

        handeStyleElements(ref, arr);

        setOptionListMaxHeight(arr.reduce((a, b) => a + b));
      }, 0);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [attachELements, visibleOptions, handeStyleElements]);

  const handleListClick = useCallback(
    ({ disabled, className, text, selected }: SelectData, index: number) => {
      if (disabled || (className !== undefined && className.includes('select-no-results'))) return;

      if (multiple) {
        filteredData[index].selected = !filteredData[index].selected;

        setFilteredData(filteredData);
        setTestData(filteredData);

        if (text !== undefined && (!selected || selected === undefined)) {
          setTextMultiple([...textMultiple, text]);
        } else if (text !== undefined && selected) {
          setTextMultiple(textMultiple.filter((t: string) => t !== text));
        }
      } else {
        setIndexOption(index);
        setInputValue(text);
        setFocus(false);

        const mapped = filteredData.map((d, i) => {
          if (i !== index) {
            d.selected = false;
            d.active = false;
          } else {
            d.selected = true;
            d.active = true;
          }
          return d;
        });

        const dataSelected = data.map((e: any) => {
          return { ...e, active: false, selected: false };
        });

        const merged = [];

        for (let i = 0; i < dataSelected.length; i++) {
          merged.push({
            ...dataSelected[i],
            ...mapped.find((itm: any) => itm.text === dataSelected[i].text),
          });
        }
        setFilteredData(merged);
        setTestData(merged);

        getData && getData(merged);
      }
    },
    [data, filteredData, getData, multiple, textMultiple]
  );

  const getAvailableIndex = useCallback((index: number, arr: any, up: boolean) => {
    let newIndex = 0;

    if (up) {
      newIndex = index - 1;

      if (newIndex < 0) {
        newIndex = 0;
      }

      if (arr[newIndex].disabled) {
        newIndex = getAvailableIndex(newIndex, arr, true);
      }
    } else {
      newIndex = index + 1;

      if (newIndex > arr.length - 1) {
        newIndex = arr.length - 1;
      }

      if (arr[newIndex].disabled) {
        newIndex = getAvailableIndex(newIndex, arr, false);
      }
    }

    return newIndex;
  }, []);

  const handleKeyboard = useCallback(
    (e: any) => {
      const { key } = e;

      if (key !== 'Escape' && key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Enter') {
        return;
      }

      let timer: ReturnType<typeof setTimeout>;
      let secondTimer: ReturnType<typeof setTimeout>;
      let thirdTimer: ReturnType<typeof setTimeout>;

      e.preventDefault();

      if (key === 'Escape') {
        timer = setTimeout(() => {
          setAttachELements(false);
          if (search) setSearchInputValue('');
        }, 100);

        setFocus(false);
        setShow(false);
      }

      if (key === 'ArrowDown') {
        const index = attachELements
          ? filteredData.findIndex((e) => e.active)
          : filteredData.findIndex((e) => e.selected);

        const newIndex = getAvailableIndex(index, filteredData, false);

        if (attachELements) {
          setArrowUpPrees(false);
          setArrowDownPrees(true);

          setIndexOption(newIndex);
        } else {
          setArrowFocus(newIndex);
        }
      }

      if (key === 'ArrowUp') {
        const index = attachELements
          ? filteredData.findIndex((e) => e.active)
          : filteredData.findIndex((e) => e.selected);

        const newIndex = getAvailableIndex(index, filteredData, true);

        if (attachELements) {
          setArrowUpPrees(true);
          setArrowDownPrees(false);

          setIndexOption(newIndex);
        } else {
          setArrowFocus(newIndex);
        }
      }

      if (key === 'Enter') {
        if (!attachELements) {
          secondTimer = setTimeout(() => {
            setAttachELements(true);
            setFocus(true);
            setShow(true);
          }, 100);
        } else {
          if (!multiple) {
            thirdTimer = setTimeout(() => {
              setAttachELements(false);
              if (search) setSearchInputValue('');
            }, 100);

            const selectedItem = filteredData.filter((e) => e.active && !e.disabled)[0];
            const itemIndex = filteredData.findIndex((e) => e.active && !e.disabled);

            const newData = testData.map((item, i) => {
              if (i === itemIndex) {
                return { ...item, selected: true };
              } else {
                return { ...item, selected: false };
              }
            });
            setInputValue(selectedItem.text);
            setFocus(false);
            setShow(false);
            setFilteredData(newData);
            setTestData(newData);
          } else {
            const index = filteredData.findIndex((e) => e.active);
            handleListClick(filteredData[index], index);
          }
        }
      }
      return () => {
        clearTimeout(timer);
        clearTimeout(secondTimer);
        clearTimeout(thirdTimer);
      };
    },
    [search, filteredData, multiple, handleListClick, testData, attachELements, getAvailableIndex]
  );

  useEffect(() => {
    const ref1 = optionsWrapperRef.current;

    if (refWrapper === null) return;
    const arr: number[] = [];
    const arr1: number[] = [];

    if (attachELements) {
      const ref = refWrapper.current?.children;
      setTimeout(() => {
        handeStyleElements(ref, arr, data.length);
        handeStyleElements(ref, arr1, indexOption);

        if (arr1.length === 0) return;

        const optionHeight = arr1.reduce((a, b) => a + b);
        if (optionListMaxHeight === null || ref1 === null) return;

        if (optionHeight > Number(optionListMaxHeight)) {
          ref1.scrollTop = optionHeight;
        }
      }, 100);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachELements, indexOption]);

  useEffect(() => {
    const ref1 = optionsWrapperRef.current;

    if (refWrapper === null) return;
    const arr: number[] = [];
    const arr1: number[] = [];

    if (attachELements) {
      const ref = refWrapper.current?.children;
      setTimeout(() => {
        handeStyleElements(ref, arr, data.length);
        handeStyleElements(ref, arr1, indexOption + 2);

        const allOptionsHeight = arr.reduce((a, b) => a + b);
        const optionHeight = arr1.reduce((a, b) => a + b);

        const dataMapped = filteredData.map((e: any, index: number) => {
          if (index === indexOption) {
            return { ...e, active: true };
          } else {
            return { ...e, active: false };
          }
        });

        setFilteredData(dataMapped);

        if (optionListMaxHeight === null || ref1 === null) return;

        if (arrowDownPress) {
          if (optionHeight > Number(optionListMaxHeight)) {
            ref1.scrollTop = optionHeight - (optionListMaxHeight as number);
          } else {
            ref1.scrollTop = 0;
          }
        }
        if (arrowUpPress) {
          if (optionHeight <= Number(optionListMaxHeight)) {
            ref1.scrollTop = optionHeight - 38 * 2;
          } else {
            ref1.scrollTop = allOptionsHeight;
          }
        }
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachELements, data, arrowDownPress, arrowUpPress, handeStyleElements, indexOption, optionListMaxHeight]);

  useEffect(() => {
    if (isFoucsed) {
      window.addEventListener('keydown', handleKeyboard);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [isFoucsed, handleKeyboard]);

  useEffect(() => {
    if (!multiple) return;

    const selected = filteredData.filter((e) => e.selected && !e.disabled);
    const notDisabled = filteredData.filter((e) => !e.disabled);

    if (selected.length !== notDisabled.length) {
      setCheckedToSelectAll(false);
    } else {
      setCheckedToSelectAll(true);
    }
  }, [filteredData, multiple]);

  const normalData = () => {
    return filteredData.map((e: SelectData, index: number) => {
      return (
        <MDBSelectOption
          onClick={() => handleListClick(e, index)}
          onChange={() => handleListClick(e, index)}
          data-value={e.value}
          active={e.active}
          className={e.className}
          height={e.height}
          style={e.style}
          selected={e.selected}
          key={e.text + index}
          disabled={e.disabled}
          secondaryText={e.secondaryText}
          text={e.text}
          revert={e.revert}
          multiple={multiple}
        >
          {e.icon && (
            <MDBSelectIconContainer>
              {typeof e.icon === 'object' && e.icon.constructor === Object && !React.isValidElement(e.icon) ? (
                <MDBSelectOptionIcon className={e.icon.className} src={e.icon.src ? e.icon.src : ''}>
                  {e.icon.text}
                </MDBSelectOptionIcon>
              ) : (
                e.icon
              )}
            </MDBSelectIconContainer>
          )}
        </MDBSelectOption>
      );
    });
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  useMemo(() => {
    if (attachELements && search) {
      const filter = testData.filter((el: any) => {
        const text = el.text.toLowerCase();
        return text.includes(searchInputValue.toLowerCase());
      });

      if (filter.length === 0) {
        setFilteredData([{ text: noResultLabel as string, className: 'select-no-results' }]);
      } else {
        setFilteredData(filter);
      }
    }
  }, [attachELements, testData, search, noResultLabel, searchInputValue]);

  return (
    <Tag className={classes} ref={inputRef}>
      <MDBInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // eslint-disable-next-line
        // @ts-ignore
        value={inputValue}
        className={inputClasses}
        labelClass={clsx(focus ? 'select-input-label-active' : '', 'select-label')}
        ref={setReferenceElement as any}
        onClick={handleInputClick}
        readOnly={!validation}
        required={validation}
        placeholder={placeholder}
        disabled={disabled}
        wrapperStyle={{ zIndex: 0 }}
        label={label}
        aria-expanded={attachELements ? true : false}
        aria-disabled={disabled ? true : false}
        aria-haspopup={true}
        role='listbox'
        {...props}
      >
        {inputValue !== undefined && inputValue.length > 0 && clearBtn && (
          <span className='select-clear-btn d-block' role='button' onClick={handleClearBtn}>
            ✕
          </span>
        )}
        <span className='select-arrow' style={{ zIndex: -1 }} />
      </MDBInput>

      {attachELements &&
        ReactDOM.createPortal(
          <TagWrapper
            style={{ ...styles.popper, width: widthInput, zIndex: 1070 }}
            {...attributes.popper}
            ref={setPopperElement}
            className='select-dropdown-container'
          >
            <MDBSelectDropdown open={show}>
              {search && (
                <div className='input-group'>
                  <MDBInput
                    wrapperStyle={{ width: '100%' }}
                    className='select-filter-input placeholder-active'
                    placeholder={searchLabel}
                    role='searchbox'
                    type='text'
                    onKeyDown={handleKeyboard}
                    onChange={handleSearchInput}
                    value={searchInputValue}
                    ref={serchInputRef}
                    aria-label={searchAriaLabel}
                  />
                </div>
              )}
              <MDBSelectOptionsWrapper ref={optionsWrapperRef} maxHeight={optionListMaxHeight as string | number}>
                <MDBSelectOptionsList ref={refWrapper}>
                  {multiple && (
                    <MDBSelectOption
                      onClick={handleSelectAllClick}
                      selected={checkedToSelectAll}
                      height={38}
                      text={selectAllLabel}
                      multiple
                    />
                  )}
                  {normalData()}
                  {children && <div className='select-custom-content'>{children}</div>}
                </MDBSelectOptionsList>
              </MDBSelectOptionsWrapper>
            </MDBSelectDropdown>
          </TagWrapper>,
          document.body
        )}
    </Tag>
  );
};

export default MDBSelect;
