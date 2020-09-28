import { all } from 'redux-saga/effects';
import { watchJobs, watchJobDetails } from './jobs.sagas';
import watchApps from './apps.sagas';
import watchSystems from './systems.sagas';
import { watchSocket, watchFetchNotifications } from './notifications.sagas';

import {
  watchFetchSystems,
  watchFetchFiles,
  watchFetchFilesModal,
  watchPushKeys,
  watchScrollFiles,
  watchRename,
  watchMove,
  watchCopy,
  watchUpload,
  watchPreview,
  watchMkdir,
  watchDownload,
  watchTrash,
  watchFetchFileDetail
} from './datafiles.sagas';
import watchAllocations from './allocations.sagas';
import watchSystemMonitor from './systemMonitor.sagas';
import watchProfile from './profile.sagas';
import {
  watchTicketListFetch,
  watchTicketDetailedView,
  watchTicketDetailedViewFetchHistory,
  watchTicketDetailedViewFetchSubject,
  watchPostTicketReply,
  watchPostTicketCreate
} from './tickets.sagas';
import { watchAuthenticatedUser } from './authenticated_user.sagas';
import { watchWorkbench } from './workbench.sagas';
import {
  watchFetchWelcomeMessages,
  watchSaveWelcomeMessages
} from './welcome.sagas';

export default function* rootSaga() {
  yield all([
    watchJobs(),
    watchJobDetails(),
    watchFetchSystems(),
    watchPushKeys(),
    watchFetchFiles(),
    watchFetchFilesModal(),
    watchScrollFiles(),
    watchRename(),
    watchMove(),
    watchCopy(),
    watchUpload(),
    watchPreview(),
    watchMkdir(),
    watchDownload(),
    watchTrash(),
    watchFetchFileDetail(),
    ...watchAllocations,
    watchApps(),
    watchSystems(),
    watchSystemMonitor(),
    ...watchProfile,
    watchTicketListFetch(),
    watchTicketDetailedView(),
    watchTicketDetailedViewFetchHistory(),
    watchTicketDetailedViewFetchSubject(),
    watchPostTicketReply(),
    watchPostTicketCreate(),
    watchAuthenticatedUser(),
    watchSocket(),
    watchFetchNotifications(),
    watchWorkbench(),
    watchFetchWelcomeMessages(),
    watchSaveWelcomeMessages()
  ]);
}
