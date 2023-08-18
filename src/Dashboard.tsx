import React from 'react';
import { useState } from 'react';
import {
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import MDBSideNav from './pro/navigation/SideNav/SideNav.tsx';
import MDBSideNavCollapse from './pro/navigation/SideNav/SideNavCollapse/SideNavCollapse.tsx';
import MDBSideNavLink from './pro/navigation/SideNav/SideNavLink/SideNavLink.tsx';
import MDBSideNavItem from './pro/navigation/SideNav/SideNavItem/SideNavItem.tsx';
import MDBSideNavMenu from './pro/navigation/SideNav/SideNavMenu/SideNavMenu.tsx';

export const Dashboard=()=>{
 
  const [basicOpen, setBasicOpen] = useState(true);
  const [basicCollapse1, setBasicCollapse1] = useState(true);
  const [basicCollapse2, setBasicCollapse2] = useState(false);

  return (
    <>
      <MDBSideNav isOpen={basicOpen} absolute getOpenState={(e: any) => setBasicOpen(e)}>
        <MDBSideNavMenu>
          <MDBSideNavItem>
            <MDBSideNavLink>
              <MDBIcon far icon='smile' className='fa-fw me-3' />
              Link 1
            </MDBSideNavLink>
          </MDBSideNavItem>
          <MDBSideNavItem>
            <MDBSideNavLink icon='angle-down' shouldBeExpanded={basicCollapse1} onClick={() => setBasicCollapse1(!basicCollapse1)}>
              <MDBIcon fas icon='grin' className='fa-fw me-3' />
              Category 1
            </MDBSideNavLink>
            <MDBSideNavCollapse show={basicCollapse1}>
              <MDBSideNavLink>Link 2</MDBSideNavLink>
              <MDBSideNavLink>Link 3</MDBSideNavLink>
            </MDBSideNavCollapse>
          </MDBSideNavItem>
          <MDBSideNavItem>
            <MDBSideNavLink icon='angle-down' shouldBeExpanded={basicCollapse2} onClick={() => setBasicCollapse2(!basicCollapse2)}>
              <MDBIcon fas icon='grin' className='fa-fw me-3' />
              Category 2
            </MDBSideNavLink>
            <MDBSideNavCollapse show={basicCollapse2}>
              <MDBSideNavLink>Link 4</MDBSideNavLink>
              <MDBSideNavLink>Link 5</MDBSideNavLink>
            </MDBSideNavCollapse>
          </MDBSideNavItem>
        </MDBSideNavMenu>
      </MDBSideNav>

      <div style={{ padding: '20px' }} className='text-center'>
        <MDBBtn onClick={() => setBasicOpen(!basicOpen)}>
          <MDBIcon fas icon='bars' />
        </MDBBtn>
      </div>
    </>
  );
}