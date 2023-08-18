import React from 'react';

interface SideNavProps {
  color: string | undefined;
}

const SideNavContext = React.createContext<SideNavProps>({
  color: 'primary',
});

export default SideNavContext ;
