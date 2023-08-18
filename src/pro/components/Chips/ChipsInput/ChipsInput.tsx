import clsx from 'clsx';
import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ChangeEvent,
  useImperativeHandle,
} from 'react';
import Chip from '../Chip';
import type { ChipsInputProps } from './types';

const MDBChipsInput: React.FC<ChipsInputProps> = React.forwardRef<HTMLInputElement, ChipsInputProps>(
  (
    {
      className,
      value = '',
      id,
      labelId,
      labelClass,
      label,
      onChange,
      labelRef,
      labelStyle,
      readonly,
      editable,
      onAdd,
      onDelete,
      initialValues = [],
      ...props
    },
    ref
  ) => {
    const labelEl = useRef<HTMLLabelElement>(null);

    const labelReference = labelRef ?? labelEl;
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const [chips, setChips] = useState(initialValues);
    const [chipToEdit, setChipToEdit] = useState<null | number>(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const [inputValue, setInputValue] = useState(value);

    const isInputActive = chips.length > 0 || inputValue.length > 0;

    const wrapperClasses = clsx(
      'form-outline',
      'chips-input-wrapper',
      chips.length > 0 && 'chips-padding chips-transition'
    );
    const inputClasses = clsx('form-control', isInputActive && 'active', className);
    const labelClasses = clsx('form-label', labelClass);

    useEffect(() => {
      if (!labelReference.current || labelReference.current.clientWidth === 0) return;

      setLabelWidth(labelReference.current.clientWidth * 0.8 + 8);
    }, [labelReference]);

    const setWidth = () => {
      if (!labelReference.current) return;

      setLabelWidth(labelReference.current.clientWidth * 0.8 + 8);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const handleKeyboard = (e: KeyboardEvent<HTMLInputElement>) => {
      // dont affect activeIndex when something is in input
      if (!inputValue.length) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          setActiveIndex((prevIndex) => (!prevIndex ? chips.length - 1 : prevIndex - 1));
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          setActiveIndex((prevIndex) => (prevIndex === chips.length - 1 || prevIndex === null ? 0 : prevIndex + 1));
        }

        if (e.key === 'Backspace' && activeIndex !== null) {
          handleClose(activeIndex);
        }
      }

      if (e.key === 'Enter' && inputValue.trim().length) {
        onAdd?.(inputValue);
        setChips([...chips, { tag: inputValue }]);
        setInputValue('');
      }
    };

    const handleClose = (currentIndex: number) => {
      const deletedChip = chips.find((_, index) => currentIndex === index);

      if (deletedChip) {
        onDelete?.(deletedChip?.tag);
        const newChips = chips.filter((_, index) => currentIndex !== index);
        setChips(newChips);
        setActiveIndex(null);
      }
    };

    const handleDoubleClick = (e: MouseEvent<HTMLElement>, index: number) => {
      if (!editable) return;
      setChipToEdit(index);
    };

    const addNewChip = (e: FocusEvent<HTMLElement> | KeyboardEvent<HTMLElement>, index: number) => {
      if (!editable) return;

      const text = e.currentTarget.textContent;

      const newChips = chips.map((el, i) => {
        if (i === index && text) {
          return {
            tag: text,
          };
        }
        return el;
      });

      // if empty chips is submitted - delete it
      text ? setChips(newChips) : handleClose(index);
      setChipToEdit(null);
      setActiveIndex(null);
    };

    const handleChipKeyboard = (e: KeyboardEvent<HTMLElement>, index: number) => {
      if (e.key === 'Enter' && editable && chipToEdit !== null) {
        addNewChip(e, index);
      }
    };

    return (
      <div className='chips chips-placeholder'>
        <div className={wrapperClasses}>
          {chips.map((chip, index) => (
            <Chip
              contentEditable={chipToEdit === index}
              suppressContentEditableWarning={true}
              onDoubleClick={(e) => handleDoubleClick(e, index)}
              onDelete={() => handleClose(index)}
              onBlur={(e) => addNewChip(e, index)}
              onKeyDown={(e) => handleChipKeyboard(e, index)}
              key={`${Math.random()}-${index}`}
              closeIcon={chipToEdit !== index}
              className={clsx('btn', index === activeIndex && 'active')}
            >
              {chip.tag}
            </Chip>
          ))}
          <input
            type='text'
            readOnly={readonly}
            className={inputClasses}
            onChange={handleChange}
            onFocus={setWidth}
            onKeyDown={handleKeyboard}
            value={inputValue}
            id={id}
            ref={innerRef}
            {...props}
          />
          {label && (
            <label className={labelClasses} style={labelStyle} id={labelId} htmlFor={id} ref={labelReference}>
              {label}
            </label>
          )}
          <div className='form-notch'>
            <div className='form-notch-leading'></div>
            <div className='form-notch-middle' style={{ width: labelWidth }}></div>
            <div className='form-notch-trailing'></div>
          </div>
        </div>
      </div>
    );
  }
);

export default MDBChipsInput;
