import React from 'react';
import { useSelector } from 'react-redux';
import {
  Link,
  NavLink as RRNavLink,
  Route,
  useHistory
} from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { string } from 'prop-types';

import { Icon, LoadingSpinner, Section } from '_common';
import { AllocationsTable } from './AllocationsTables';
import { AllocationsRequestModal } from './AllocationsModals';
import * as ROUTES from '../../constants/routes';

const PATH = ROUTES.WORKBENCH + ROUTES.ALLOCATIONS;

export const Header = ({ page }) => {
  return (
    <>
      <Link to={PATH}>Allocations</Link>
      <span>&nbsp;/&nbsp;</span>
      <span>{page}</span>
    </>
  );
};
Header.propTypes = { page: string.isRequired };

export const Actions = ({ page }) => {
  return (
    <Link to={`${PATH}/${page}/manage`} className="btn btn-primary">
      Manage Allocations
    </Link>
  );
};
Actions.propTypes = { page: string.isRequired };

export const Sidebar = () => (
  <Nav className="allocations-sidebar" vertical>
    <NavItem>
      <NavLink tag={RRNavLink} to={`${PATH}/approved`} activeClassName="active">
        <Icon name="approved-reverse" className="link-icon" />
        <span className="link-text">Approved</span>
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink tag={RRNavLink} to={`${PATH}/expired`} activeClassName="active">
        <Icon name="denied-reverse" className="link-icon" />
        <span className="link-text">Expired</span>
      </NavLink>
    </NavItem>
  </Nav>
);

export const Layout = ({ page }) => {
  const loading = useSelector(state => state.allocations.loading);
  const history = useHistory();
  const root = `${PATH}/${page}`;
  return (
    <Section
      header={<Header page={page} />}
      headerClassName="allocations-header"
      actions={<Actions page={page} />}
      content={
        <>
          <Sidebar />
          {loading ? <LoadingSpinner /> : <AllocationsTable page={page} />}
          <Route exact path={`${root}/manage`}>
            <AllocationsRequestModal
              isOpen
              toggle={() => {
                history.push(root);
              }}
            />
          </Route>
        </>
      }
      contentClassName="allocations-container"
    />
  );
};
Layout.propTypes = {
  page: string.isRequired
};
