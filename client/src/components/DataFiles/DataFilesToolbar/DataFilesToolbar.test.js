import React from 'react';
import { toHaveClass } from '@testing-library/jest-dom/dist/matchers';
import DataFilesToolbar, { ToolbarButton } from './DataFilesToolbar';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import renderComponent from 'utils/testing';
import systemsFixture from '../fixtures/DataFiles.systems.fixture';

const mockStore = configureStore();
expect.extend({ toHaveClass });
describe('ToolbarButton', () => {
  const store = mockStore({});
  it('renders button with correct text', () => {
    const { getByText, getByRole, getByTestId } = renderComponent(
      <ToolbarButton text="Rename" iconName="rename" onClick={() => {}} />,
      store,
      createMemoryHistory()
    );

    expect(getByText(/Rename/)).toBeDefined();
    expect(getByRole('button')).toBeDefined();
    expect(getByTestId('toolbar-icon')).toHaveClass('icon-action icon-rename');
  });
});

describe('DataFilesToolbar', () => {
  it('renders necessary buttons', () => {
    const { getByText, queryByText } = renderComponent(
      <DataFilesToolbar scheme="private" api="tapis" />,
      mockStore({
        workbench: { config: {
          extract: '',
          compress: ''
        } },
        files: { selected: { FilesListing: [] } },
        listing: { selected: { FilesListing: [] } },
        systems: systemsFixture
      }),
      createMemoryHistory()
    );

    expect(getByText(/Rename/)).toBeDefined();
    expect(getByText(/Move/)).toBeDefined();
    expect(getByText(/Copy/)).toBeDefined();
    expect(getByText(/Download/)).toBeDefined();
    expect(getByText(/Trash/)).toBeDefined();
    expect(queryByText(/Make Public/)).toBeFalsy();
  });

  it('does not render unnecessary buttons in Community Data', () => {
    const {getByText, queryByText} = renderComponent(
      <DataFilesToolbar scheme="community" api="tapis" />,
      mockStore({
        workbench: { config: {
          extract: '',
          compress: ''
        } },
        files: { selected: { FilesListing: [] } },
        listing: { selected: { FilesListing: [] } },
        systems: systemsFixture
      }),
      createMemoryHistory()
    );

    expect(queryByText(/Rename/)).toBeFalsy();
    expect(queryByText(/Move/)).toBeFalsy();
    expect(getByText(/Copy/)).toBeDefined();
    expect(getByText(/Download/)).toBeDefined();
    expect(queryByText(/Trash/)).toBeFalsy();
    expect(queryByText(/Make Public/)).toBeFalsy();
  });

  it('does not render unnecessary buttons in Public Data', () => {
    const {getByText, queryByText} = renderComponent(
      <DataFilesToolbar scheme="public" api="tapis" />,
      mockStore({
        workbench: { config: {
          extract: '',
          compress: ''
        } },
        files: { selected: { FilesListing: [] } },
        listing: { selected: { FilesListing: [] } },
        systems: systemsFixture
      }),
      createMemoryHistory()
    );

    expect(queryByText(/Rename/)).toBeFalsy();
    expect(queryByText(/Move/)).toBeFalsy();
    expect(getByText(/Copy/)).toBeDefined();
    expect(getByText(/Download/)).toBeDefined();
    expect(queryByText(/Trash/)).toBeFalsy();
    expect(queryByText(/Make Public/)).toBeFalsy();
  });

  it('does not render unnecessary buttons in Google Drive', () => {
    const {getByText, queryByText} = renderComponent(
      <DataFilesToolbar scheme="private" api="googledrive" />,
      mockStore({
        workbench: { config: {
          extract: '',
          compress: ''
        } },
        files: { selected: { FilesListing: [] } },
        listing: { selected: { FilesListing: [] } },
        systems: systemsFixture
      }),
      createMemoryHistory()
    );

    expect(queryByText(/Rename/)).toBeFalsy();
    expect(queryByText(/Move/)).toBeFalsy();
    expect(getByText(/Copy/)).toBeDefined();
    expect(queryByText(/Download/)).toBeFalsy();
    expect(queryByText(/Trash/)).toBeFalsy();
    expect(queryByText(/Make Public/)).toBeFalsy();
  });

  it('renders Make Public button', () => {
    const { getByText } = renderComponent(
      <DataFilesToolbar scheme="private" api="tapis" />,
      mockStore({
        files: { selected: { FilesListing: [] } },
        listing: { selected: { FilesListing: [] } },
        systems: systemsFixture,
        workbench: { config: { makePublic: true } }
      }),
      createMemoryHistory()
    );

    expect(getByText(/Make Public/)).toBeDefined();
  });
});
