import React from 'react';
import Icon from '../../../../free/styles/Icon/Icon';
import { DatatableSearchProps } from './types';
import Input from '../../../../free/forms/Input/Input';
import InputGroup from '../../../../free/forms/InputGroup/InputGroup';
import Button from '../../../../free/components/Button/Button';

const MDBDatatableSearch: React.FC<DatatableSearchProps> = ({
  search,
  advancedSearch,
  searchValue,
  setSearchValue,
  searchInputProps,
  label = 'Search',
  setAdvancedSearchValue,
}) => (
  <>
    {search && (
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        label={label}
        className='mb-4'
        {...searchInputProps}
      />
    )}
    {advancedSearch && (
      <InputGroup className='mb-4'>
        <input
          className='form-control'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          {...searchInputProps}
        />
        <Button
          className='datatable-advanced-search'
          onClick={() => setAdvancedSearchValue(advancedSearch(searchValue))}
        >
          <Icon icon='search' />
        </Button>
      </InputGroup>
    )}
  </>
);

export default MDBDatatableSearch;
