import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';

import { BrowserChecker, Section, SectionTable } from '_common';
import JobsView from '../Jobs';
import Tickets, { TicketModal } from '../Tickets';
import Sysmon from '../SystemMonitor';
import * as ROUTES from '../../constants/routes';
import './Dashboard.scss';

function Dashboard() {
  const dispatch = useDispatch();

  return (
    <Section
      bodyClassName="has-loaded-dashboard"
      routeName="DASHBOARD"
      messages={<BrowserChecker />}
      header="Dashboard"
      headerActions={
        <Link to={`${ROUTES.WORKBENCH}${ROUTES.ACCOUNT}`} className="wb-link">
          Manage Account
        </Link>
      }
      contentClassName="dashboard-items"
      contentLayoutName="twoColumn"
      contentShouldScroll
      content={
        <>
          <SectionTable
            header="System Status"
            className="sysmon-wrapper"
            contentShouldScroll
          >
            <Sysmon />
          </SectionTable>
          <SectionTable
            className="jobs-wrapper"
            header="My Recent Jobs"
            headerActions={
              <Link
                to={`${ROUTES.WORKBENCH}${ROUTES.HISTORY}/jobs`}
                className="wb-link"
              >
                View History
              </Link>
            }
            contentShouldScroll
          >
            <JobsView />
          </SectionTable>
          <SectionTable
            className="tickets-wrapper"
            header="My Tickets"
            headerActions={
              <Link
                to={`${ROUTES.WORKBENCH}${ROUTES.DASHBOARD}${ROUTES.TICKETS}/create`}
                className="wb-link"
              >
                Add Ticket
              </Link>
            }
            contentShouldScroll
          >
            <Tickets />
          </SectionTable>

          <Switch>
            <Route
              exact
              path={`${ROUTES.WORKBENCH}${ROUTES.DASHBOARD}${ROUTES.TICKETS}/create`}
              render={() => {
                dispatch({
                  type: 'TICKET_CREATE_OPEN_MODAL'
                });
              }}
            />
            <Route
              path={`${ROUTES.WORKBENCH}${ROUTES.DASHBOARD}${ROUTES.TICKETS}/:ticketId`}
              render={({ match: { params } }) => {
                dispatch({
                  type: 'TICKET_DETAILED_VIEW_OPEN',
                  payload: { ticketId: Number(params.ticketId) }
                });
                return <TicketModal />;
              }}
            />
          </Switch>
        </>
      }
    />
  );
}

export default Dashboard;
