import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTable } from 'react-table';
import { Team, Systems, Awarded, Remaining, Expires } from './AllocationsCells';

const TableTemplate = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });
  return (
    <div id="allocations-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th key={column.Header}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
TableTemplate.propTypes = {
  columns: PropTypes.instanceOf(Array),
  data: PropTypes.instanceOf(Array)
};
TableTemplate.defaultProps = {
  columns: [],
  data: []
};

export const ActiveTable = ({ allocations }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'projectId'
      },
      {
        Header: 'Principal Investigator',
        accessor: 'pi'
      },
      {
        Header: 'Team',
        Cell: Team
      },
      {
        Header: 'Systems',
        accessor: ({ systems }) =>
          systems.map(({ name, allocation: { id } }) => ({
            name,
            id
          })),
        id: 'name',
        Cell: Systems
      },
      {
        Header: 'Awarded',
        accessor: ({ systems }) =>
          systems.map(({ allocation: { computeAllocated, id }, type }) => ({
            awarded: Math.round(computeAllocated),
            type,
            id
          })),
        id: 'awarded',
        Cell: Awarded
      },
      {
        Header: 'Remaining',
        accessor: ({ systems }) =>
          systems.map(
            ({ allocation: { id, computeAllocated, computeUsed }, type }) => {
              const remaining = Math.round(computeAllocated - computeUsed);
              const ratio = remaining / computeAllocated || 0;
              return {
                id,
                remaining,
                ratio,
                type
              };
            }
          ),
        id: 'remaining',
        Cell: Remaining
      },
      {
        Header: 'Expires',
        accessor: ({ systems }) =>
          systems.map(({ allocation: { end, id } }) => ({
            id,
            date: new Date(end).toDateString()
          })),
        id: 'expires',
        Cell: Expires
      }
    ],
    []
  );
  const data = useMemo(() => allocations, []);
  return <TableTemplate columns={columns} data={data} />;
};
ActiveTable.propTypes = { allocations: PropTypes.instanceOf(Array) };
ActiveTable.defaultProps = { allocations: [] };

/* eslint-disable no-shadow */
export const InactiveTable = ({ allocations }) => {
  const columns = useMemo(() => [
    {
      Header: 'Alloc ID',
      accessor: ({ allocations }) =>
        allocations.map(allocation => `${allocation.id}`)
    },
    {
      Header: 'Title',
      accessor: 'title'
    },
    {
      Header: 'PI',
      accessor: ({ pi }) => `${pi.lastName}, ${pi.firstName}`
    },
    {
      Header: 'Project ID',
      accessor: ({ allocations }) =>
        allocations.map(allocation => `${allocation.projectId}`)
    },
    {
      Header: 'Project Name',
      accessor: ({ allocations }) =>
        allocations.map(allocation => `${allocation.project}`)
    }
  ]);
  const data = React.useMemo(() => allocations, []);
  return <TableTemplate columns={columns} data={data} />;
};

InactiveTable.propTypes = { allocations: PropTypes.instanceOf(Array) };
InactiveTable.defaultProps = { allocations: [] };
