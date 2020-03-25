import React from 'react';
import { Navbar } from 'reactstrap';
import TicketCreateForm from './TicketCreateForm';
import './TicketUnauthenticatedCreate.scss';

function TicketUnauthenticatedCreate() {
  return (
    <>
      <Navbar className="ticket-unauthenticated-title">Add Ticket</Navbar>
      <div className="ticket-unauthenticated-create-form">
        <TicketCreateForm />
      </div>
    </>
  );
}

export default TicketUnauthenticatedCreate;