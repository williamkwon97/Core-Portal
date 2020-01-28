import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import './DataFilesTable.scss';

// What to render if there are no files to display
const DataFilesTablePlaceholder = ({ section, data }) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.files.loading[section]);
  const err = useSelector(state => state.files.error[section]);
  const filesLength = data.length;

  const pushKeys = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'pushKeys' }
    });
  };
  if (loading) {
    return (
      <div id="spin-sun">
        <FontAwesomeIcon icon={faCog} size="8x" spin />
      </div>
    );
  }
  if (err === '502') {
    return (
      <div>
        <span>
          There was a problem accessing this file system. If this is your first
          time logging in, you may need to{' '}
        </span>
        <button type="button" className="btn btn-link" onClick={pushKeys}>
          push your keys
        </button>
      </div>
    );
  }
  if (filesLength === 0) {
    return <div>no files to show</div>;
  }
  return <></>;
};
DataFilesTablePlaceholder.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  section: PropTypes.string.isRequired
};

const DataFilesTableRow = ({
  style,
  index,
  rowCount,
  row,
  section,
  rowSelectCallback
}) => {
  const onClick = useCallback(() => rowSelectCallback(index), [index]);
  const onKeyDown = useCallback(
    e => e.key === 'Enter' && rowSelectCallback(index),
    [index]
  );
  const loadingScroll = useSelector(
    state => state.files.loadingScroll[section]
  );
  if (index < rowCount) {
    return (
      <div
        style={style}
        className="tr"
        role="row"
        tabIndex={-1}
        index={row.index}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {row.cells.map(cell => {
          return (
            <div className="td" {...cell.getCellProps()}>
              {cell.render('Cell')}
            </div>
          );
        })}
      </div>
    );
  }
  if (loadingScroll) {
    return (
      <div style={style} className="tr scroll">
        <FontAwesomeIcon icon={faCog} size="2x" spin />
      </div>
    );
  }
  return <div style={style} />;
};
DataFilesTableRow.propTypes = {
  style: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  row: PropTypes.shape({
    index: PropTypes.number,
    cells: PropTypes.array
  }),
  section: PropTypes.string.isRequired,
  rowSelectCallback: PropTypes.func.isRequired
};
DataFilesTableRow.defaultProps = { row: {} };

const DataFilesTable = ({
  data,
  columns,
  rowSelectCallback,
  scrollBottomCallback,
  section
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const tableHeader = useRef({ clientHeight: 0 });
  useEffect(() => {
    if (tableHeader.current) {
      setHeaderHeight(tableHeader.current.clientHeight);
    } else {
      setHeaderHeight(30);
    }
  });

  // get height of table header to prevent overflow
  const [tableWidth, setTableWidth] = useState(500);
  const [tableHeight, setTableHeight] = useState(500);
  const resizeCallback = ({ width, height }) => {
    setTableWidth(width);
    setTableHeight(height);
  };

  const reachedEnd = useSelector(state => state.files.reachedEnd[section]);

  const sizedColumns = useMemo(
    () => columns.map(col => ({ ...col, width: col.width * tableWidth })),
    [columns, tableWidth]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns: sizedColumns,
      data
    },
    useBlockLayout
  );

  // handle scroll to bottom
  const rowHeight = 45;
  const itemCount = rows.length ? rows.length + 1 : 0;
  const onScroll = useCallback(
    ({ scrollOffset }) => {
      const diff =
        scrollOffset - itemCount * rowHeight + (tableHeight - headerHeight);
      if (diff === 0 && !reachedEnd) {
        scrollBottomCallback();
      }
    },
    [rowHeight, itemCount, tableHeight, headerHeight, reachedEnd]
  );

  // only bind render function when table data changes
  const RenderRow = useCallback(
    ({ style, index }) => {
      const row = rows[index];
      row && prepareRow(row);
      return (
        <DataFilesTableRow
          style={style}
          index={index}
          rowCount={rows.length}
          row={row}
          section={section}
          rowSelectCallback={rowSelectCallback}
        />
      );
    },
    [rows]
  );

  return (
    <AutoSizer
      onResize={resizeCallback}
      disableHeight={process.env.NODE_ENV === 'test'}
      disableWidth={process.env.NODE_ENV === 'test'}
    >
      {({ width, height }) => (
        <div {...getTableProps()}>
          <div ref={tableHeader}>
            {headerGroups.map(headerGroup => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                className="tr tr-header"
              >
                {headerGroup.headers.map(column => (
                  <div {...column.getHeaderProps()} className="td">
                    {column.render('Header')}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* table body */}
          <div style={{ width }}>
            <DataFilesTablePlaceholder section={section} data={data} />
          </div>
          <div {...getTableBodyProps()}>
            {/* fallback if there are no rows */}
            <FixedSizeList
              height={itemCount > 0 ? (height || 500) - headerHeight : 0}
              itemCount={itemCount}
              itemSize={rowHeight}
              width={width || 500}
              overscanCount={0}
              onScroll={onScroll}
            >
              {React.memo(RenderRow, areEqual)}
            </FixedSizeList>
          </div>
        </div>
      )}
    </AutoSizer>
  );
};
DataFilesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowSelectCallback: PropTypes.func.isRequired,
  scrollBottomCallback: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired
};

export default DataFilesTable;