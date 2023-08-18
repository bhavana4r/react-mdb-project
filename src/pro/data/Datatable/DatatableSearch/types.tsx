import { ReactNode, SetStateAction } from 'react';

type DatatableSearchProps = {
  search?: boolean;
  advancedSearch?: (phrase: string) => { phrase: string; columns?: string[] | string };
  setAdvancedSearchValue: SetStateAction<any>;
  searchValue: string;
  setSearchValue: SetStateAction<any>;
  searchInputProps?: Record<string, unknown>;
  label: ReactNode;
};

export { DatatableSearchProps };
