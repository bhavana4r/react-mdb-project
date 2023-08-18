import { createContext, SetStateAction } from 'react';

interface DatatableContextProps {
  isLoading?: boolean;
  activePage: number;
  setActivePage: SetStateAction<any>;
  sort: { column: string; option: 'asc' | 'desc' | '' };
  fixedHeader?: boolean;
  handleSort: any;
}

const DatatableContext = createContext<DatatableContextProps>({
  isLoading: false,
  activePage: 0,
  setActivePage: null,
  sort: { column: '', option: '' },
  fixedHeader: false,
  handleSort: null,
});

export { DatatableContext };
