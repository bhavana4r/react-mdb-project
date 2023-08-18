import clsx from 'clsx';
import React, { useMemo } from 'react';
import MDBCheckbox from '../../../../free/forms/Checkbox/Checkbox';
import type { SelectV2OptionsListProps } from './types';
const optionsWithoutGroup = 0;

const MDBSelectOptionsListV2: React.FC<SelectV2OptionsListProps> = ({
  selectedElements,
  optionHeight,
  data,
  multiple,
  selectAll,
  handleSelectAll,
  handleOptionClick,
  selectAllLabel,
  selectData,
  activeElementIndex,
  noResults,
  search,
}) => {
  const optionGroups = useMemo(() => {
    const groups = selectData.filter((el) => el.optgroup).map((el) => el.optgroup);
    return groups;
  }, [selectData]);

  const groupedSelectData = useMemo(() => {
    let groupIndex = 0;
    const groupedData = selectData.map((el) => {
      if (el.optgroup) {
        groupIndex++;
      }
      return { ...el, groupIndex: groupIndex };
    });
    return groupedData;
  }, [selectData]);

  const isEmptyResults = useMemo(() => {
    return selectData.filter((el) => !el.optgroup && !el.hidden).length === 0;
  }, [selectData]);

  const createOptions = (group?: number) => {
    return groupedSelectData.map((el) => {
      if (!el.optgroup && group === el.groupIndex) {
        return (
          <div
            className={clsx(
              'select-option',
              selectedElements.includes(el.elementPosition) && 'selected',
              el.disabled && 'disabled',
              el.hidden && 'd-none',
              activeElementIndex === el.elementPosition && 'active'
            )}
            role='option'
            style={{ height: optionHeight }}
            key={el.elementPosition}
            onClick={() => handleOptionClick(el)}
          >
            <span className='select-option-text'>
              {multiple && (
                <MDBCheckbox
                  disabled={el.disabled}
                  disableWrapper
                  checked={selectedElements.includes(el.elementPosition)}
                  readOnly
                />
              )}
              {el.text}
              {el.secondaryText && <span className='select-option-secondary-text'>{el.secondaryText}</span>}
            </span>
            {el.icon && (
              <span className='select-option-icon-container'>
                <img className='select-option-icon rounded-circle' src={el.icon} />
              </span>
            )}
          </div>
        );
      }
    });
  };
  return (
    <>
      <div className='select-options-list'>
        {multiple && selectAll && !isEmptyResults && (
          <div
            className={clsx(
              'select-option',
              selectedElements.length === data.filter((el) => !el.disabled).length && 'selected',
              activeElementIndex === -1 && 'active'
            )}
            role='option'
            onClick={handleSelectAll}
            style={{ height: optionHeight }}
          >
            <span className='select-option-text'>
              <MDBCheckbox
                disableWrapper
                checked={data.filter((el) => !el.disabled && !el.optgroup).length === selectedElements.length}
                readOnly
              />
              {selectAllLabel}
            </span>
          </div>
        )}

        {createOptions(optionsWithoutGroup)}
        {!isEmptyResults &&
          optionGroups?.map((groupName, index) => {
            const options = createOptions(index + 1).filter((option) => option !== undefined);
            if (options.length === 0) {
              return;
            }
            return (
              <div className='select-option-group' key={`select-option-group ${groupName} ${index}`}>
                <label className='select-option-group-label' style={{ height: optionHeight }}>
                  {groupName}
                </label>
                {options}
              </div>
            );
          })}
      </div>
      {search && isEmptyResults && (
        <div className='select-no-results' style={{ height: optionHeight }}>
          {noResults}
        </div>
      )}
    </>
  );
};

export default MDBSelectOptionsListV2;
