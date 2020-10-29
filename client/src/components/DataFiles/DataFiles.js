import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation
} from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { parse } from 'query-string';

import { Section, SectionTable } from '_common';

import './DataFiles.module.css';
import './DataFiles.css';

import DataFilesToolbar from './DataFilesToolbar/DataFilesToolbar';
import DataFilesListing from './DataFilesListing/DataFilesListing';
import DataFilesSidebar from './DataFilesSidebar/DataFilesSidebar';
import DataFilesBreadcrumbs from './DataFilesBreadcrumbs/DataFilesBreadcrumbs';
import DataFilesModals from './DataFilesModals/DataFilesModals';
import DataFilesSearchbar from './DataFilesSearchbar/DataFilesSearchbar';

const PrivateDataRedirect = () => {
  const systems = useSelector(state => state.systems.systemList, shallowEqual);
  const history = useHistory();
  useEffect(() => {
    if (systems.length === 0) return;
    history.push(`/workbench/data/tapis/private/${systems[0].system}/`);
  }, [systems]);
  return <></>;
};

const DataFilesSwitch = React.memo(() => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const queryString = parse(useLocation().search).query_string;
  return (
    <Switch>
      <Route
        path={`${path}/:api/:scheme/:system/:path*`}
        render={({ match: { params } }) => {
          dispatch({
            type: 'FETCH_FILES',
            payload: {
              ...params,
              queryString,
              section: 'FilesListing'
            }
          });
          return (
            <DataFilesListing
              api={params.api}
              scheme={params.scheme}
              system={params.system}
              path={params.path || '/'}
            />
          );
        }}
      />
      <Route path={`${path}`}>
        <PrivateDataRedirect />
      </Route>
    </Switch>
  );
});

const DataFiles = () => {
  const listingParams = useSelector(
    state => state.files.params.FilesListing,
    shallowEqual
  );
  const sectionClass = 'has-loaded-datafiles';

  useEffect(() => {
    document.body.classList.add(sectionClass);

    return function cleanup() {
      document.body.classList.remove(sectionClass);
    };
  }, [sectionClass]);

  return (
    <Section
      routeName="DATA"
      header={
        <DataFilesBreadcrumbs
          api={listingParams.api}
          scheme={listingParams.scheme}
          system={listingParams.system}
          path={listingParams.path || '/'}
          section="FilesListing"
          route
        />
      }
      headerActions={
        <DataFilesToolbar
          api={listingParams.api}
          scheme={listingParams.scheme}
        />
      }
      content={
        <>
          <DataFilesSidebar styleName="sidebar" />
          <SectionTable
            styleName="content"
            headerActions={
              <DataFilesSearchbar
                api={listingParams.api}
                scheme={listingParams.scheme}
                system={listingParams.system}
              />
            }
          >
            <DataFilesSwitch />
          </SectionTable>
          <DataFilesModals />
        </>
      }
      contentLayoutName="oneRow"
    />
  );
};

export default DataFiles;
