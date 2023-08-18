import clsx from 'clsx';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { usePopper } from 'react-popper';
import type { AutocompleteDropdownProps } from './types';
import type { Modifier } from 'react-popper';

import { createPortal } from 'react-dom';
import useAutocompleteClose from '../hooks/useAutocompleteClose';
import useAutocompleteResize from '../hooks/useAutocompleteResize';
import useAutocompleteAnimation from '../hooks/useAutocompleteAnimation';

const MDBAutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  className,
  customContent = null,
  inputRef,
  show,
  children,
  setIsOpen,
  listHeight = '190px',
  ...props
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLInputElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);

  const popperModifiers = useMemo(
    (): Modifier<string, Record<string, unknown>>[] => [
      {
        name: 'matchReferenceWidth',
        enabled: true,
        fn: ({ state, instance }) => {
          if (!popperElement) return;

          const popperWidth = popperElement[`offsetWidth`];

          const referenceWidth = state.rects.reference['width'];

          if (Math.round(popperWidth) === Math.round(referenceWidth)) return;

          popperElement.style['width'] = `${referenceWidth}px`;
          instance.update();
        },
        phase: 'beforeWrite',
        requires: ['computeStyles'],
      },
    ],
    [popperElement]
  );

  const isVisible = useAutocompleteAnimation({ show });

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, { modifiers: popperModifiers });

  const innerRef = useRef<HTMLDivElement>(null);

  const classes = clsx('autocomplete-dropdown', show && 'open', className);

  useAutocompleteClose({ setIsOpen, dropdownRef: innerRef, inputRef });
  useAutocompleteResize({ inputRef, dropdownRef: innerRef });

  useEffect(() => {
    if (!inputRef.current) return;

    setReferenceElement(inputRef.current);
  }, [inputRef]);

  useEffect(() => {
    if (!innerRef.current) return;

    setPopperElement(innerRef.current);
  }, []);

  useEffect(() => {
    show && update?.();
  }, [show, update, isVisible]);

  return (
    <>
      {createPortal(
        <div
          className='autocomplete-dropdown-container'
          ref={innerRef}
          {...props}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className={classes}>
            <ul
              className='autocomplete-items-list'
              role='listbox'
              style={{ maxHeight: listHeight, display: isVisible ? 'block' : 'none' }}
            >
              {children}
            </ul>
            {customContent}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MDBAutocompleteDropdown;
