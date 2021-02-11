import React from 'react';
import PropTypes from 'prop-types';
import {
  Section,
  SectionTable,
  DescriptionList,
  InfiniteScrollTable,
  InlineMessage,
  SectionMessage
} from '_common';
import { useDispatch } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';

import * as ROUTES from '../../../constants/routes';

import { TicketCreateModal } from '../../Tickets';

import './UIPatternsSection.module.css';

const modalPath = `${ROUTES.WORKBENCH}${ROUTES.UI}/modal`;

function UIPatternsSection() {
  const dispatch = useDispatch();

  function performAction() {
    // eslint-disable-next-line no-alert
    window.alert(
      'Sample action (no actual action has occurred beyond this alert).'
    );
  }

  return (
    <dl>
      <dt>
        Minimal
        <DescriptionList
          className="small"
          density="compact"
          direction="horizontal"
          data={{
            header: 'Header',
            content: 'Content'
          }}
        />
      </dt>
      <dd>
        <Section header="Header" content={<p>Content</p>} />
      </dd>
      <dt>
        Scrollable
        <DescriptionList
          className="small"
          density="compact"
          direction="horizontal"
          data={{
            contentStyleName: 'content--has-list-to-illustrate-scrolling',
            header: 'Milk',
            content: 'Cow, Soy, Nut',
            contentShouldScroll: <code>true</code>
          }}
        />
      </dt>
      <dd>
        <Section
          contentStyleName="content--has-list-to-illustrate-scrolling"
          header="Milk"
          content={
            <ul>
              <li>Cow</li>
              <li>Soy</li>
              <li>Nut</li>
            </ul>
          }
          contentShouldScroll
        />
      </dd>
      <dt>
        With a Complex Table
        <DescriptionList
          className="small"
          density="compact"
          direction="horizontal"
          data={{
            contentStyleName: 'content--has-table-to-illustrate-scrolling',
            header: 'Section with <SectionTable> and <InfiniteScrollTable>',
            content: '(paragraph, table, paragraph)',
            headerActions: '(a button to trigger sample action)',
            contentLayoutName: 'oneColumn'
          }}
        />
      </dt>
      <dd>
        <Section
          contentStyleName="content--has-table-to-illustrate-scrolling"
          header={
            <>
              Section with <code>{`<SectionTable>`}</code> and &nbsp;
              <code>{`<InfiniteScrollTable>`}</code>
            </>
          }
          content={
            <>
              <InlineMessage type="info" styleName="notice">
                The header will not be sticky until the branch &nbsp;
                <code>task/FP-385-section-comp-welcome-msg--sections</code>
                &nbsp;refactors <code>InfiniteScrollTable</code>.
              </InlineMessage>
              <SectionTable styleName="table" contentShouldScroll>
                <UIPatternsSectionTableInfinite />
              </SectionTable>
            </>
          }
          headerActions={
            <button type="button" onClick={performAction}>
              Click Me
            </button>
          }
          contentLayoutName="oneColumn"
        />
      </dd>
      <dt>
        All Properties
        <DescriptionList
          className="small"
          density="compact"
          direction="horizontal"
          data={{
            styleName: 'is-resizable',
            contentStyleName: 'content--should-always-show-scrollbar',
            header: 'Header',
            content: (
              <>
                (instruction list, table <strong>sans</strong>
                &nbsp;<code>{`<SectionTable>`}</code>, and a paragraph)
              </>
            ),
            contentLayoutName: 'oneColumn',
            headerActions: '(a link to a modal)',
            messages: '(a <SectionMessage>)',
            contentShouldScroll: (
              <>
                <code>true</code> (must resize to scroll)
              </>
            )
          }}
        />
      </dt>
      <dd>
        <Section
          styleName="is-resizable"
          contentStyleName="content--should-always-show-scrollbar"
          header="Header"
          content={
            <>
              <p>Test Instructions:</p>
              <ol>
                <li>
                  Resize this <code>{`<Section>`}</code> to confirm that its
                  content <strong>both</strong> stretches vertically and
                  horizontally <strong>and</strong> supports scrolling.
                </li>
                <li>
                  Close the <code>{`<SectionMessage>`}</code> to confirm that
                  the stretching and scrolling is not dependent on its presence.
                </li>
                <li>
                  Open the modal to test that section do not break that feature.
                  The page redirects is a fault of how Wes no knowing how to
                  properly add a modal.
                </li>
              </ol>
              <p className="small">
                The scroll area being always present—even if there is no
                scrollbar—is a one-off style here <em>only</em> to visually show
                that the section stretches.
              </p>
              <UIPatternsSectionTablePlain styleName="table" />
              <Switch>
                <Route
                  exact
                  path={modalPath}
                  render={() => {
                    dispatch({
                      type: 'TICKET_CREATE_OPEN_MODAL'
                    });
                    return <TicketCreateModal />;
                  }}
                />
              </Switch>
            </>
          }
          contentLayoutName="oneColumn"
          headerActions={<Link to={modalPath}>Open Modal</Link>}
          messages={
            <SectionMessage type="info" canDismiss>
              If you close me, the content below will fill the space I occupied.
            </SectionMessage>
          }
          contentShouldScroll
        />
      </dd>
    </dl>
  );
}

export default UIPatternsSection;

function UIPatternsSectionTableInfinite({ className }) {
  const tableData = [
    {
      col1: 'Hello',
      col2: 'World'
    },
    {
      col1: 'react-table',
      col2: 'rocks'
    },
    {
      col1: 'whatever',
      col2: 'you want'
    }
  ];

  const tableColumns = [
    {
      Header: 'Column 1',
      accessor: 'col1' // accessor is the "key" in the data
    },
    {
      Header: 'Column 2',
      accessor: 'col2'
    }
  ];

  return (
    <InfiniteScrollTable
      className={className}
      tableColumns={tableColumns}
      tableData={tableData}
    />
  );
}
UIPatternsSectionTableInfinite.propTypes = {
  /** Additional className for the root element */
  className: PropTypes.string
};
UIPatternsSectionTableInfinite.defaultProps = {
  className: ''
};

function UIPatternsSectionTablePlain({ className }) {
  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Column 1</th>
          <th>Column 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hello</td>
          <td>World</td>
        </tr>
        <tr>
          <td>react-table</td>
          <td>rocks</td>
        </tr>
        <tr>
          <td>whatever</td>
          <td>you want</td>
        </tr>
      </tbody>
    </table>
  );
}
UIPatternsSectionTablePlain.propTypes = {
  /** Additional className for the root element */
  className: PropTypes.string
};
UIPatternsSectionTablePlain.defaultProps = {
  className: ''
};
