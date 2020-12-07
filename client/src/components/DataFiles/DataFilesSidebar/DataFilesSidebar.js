import React, { useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  Nav,
  NavItem,
  NavLink,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap';

import { NavLink as RRNavLink, useRouteMatch } from 'react-router-dom';
import { Icon } from '_common';
import './DataFilesSidebar.scss';

const DataFilesSidebar = () => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleUploadModal = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'upload', props: {} }
    });
  };
  const err = useSelector(state => state.files.error.FilesListing);
  const systems = useSelector(state => state.systems.systemList, shallowEqual);

  const toggleMkdirModal = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'mkdir', props: {} }
    });
  };

  const toggleAddProjectModal = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'addproject', props: {} }
    });
  };

  const match = useRouteMatch();
  return (
    <>
      <div className="data-files-sidebar">
        <div id="add-button-wrapper">
          <ButtonDropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              color="primary"
              id="data-files-add"
              className="data-files-btn"
              disabled={err !== false}
            >
              + Add
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={toggleMkdirModal}>
                <i className="icon-folder" /> Folder
              </DropdownItem>
              <DropdownItem onClick={toggleAddProjectModal}>
                <i className="icon-folder" /> Shared Workspace
              </DropdownItem>
              <DropdownItem
                className="complex-dropdown-item"
                onClick={toggleUploadModal}
              >
                <i className="icon-upload" />
                <span className="multiline-menu-item-wrapper">
                  Upload
                  <small> Up to 500mb </small>
                </span>
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div className="data-files-nav">
          <Nav vertical>
            <NavItem>
              {systems
                ? systems.map(sys => (
                    <NavLink
                      tag={RRNavLink}
                      to={`${match.path}/${sys.api}/${sys.scheme}/${sys.system}/`}
                      activeClassName="active"
                      key={sys.system}
                    >
                      <div className="nav-content">
                        <Icon name={sys.icon || 'my-data'} />
                        <span className="nav-text">{sys.name}</span>
                      </div>
                    </NavLink>
                  ))
                : null}
              <NavLink
                tag={RRNavLink}
                to={`${match.path}/shared`}
                activeClassName="active"
                key="workspaces"
              >
                <div className="nav-content">
                  <Icon name="my-data" />
                  <span className="nav-text">Shared Workspaces</span>
                </div>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>
    </>
  );
};

export default DataFilesSidebar;
