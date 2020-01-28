import { all } from 'redux-saga/effects';
import { watchJobs } from './jobs.sagas';
import {
  watchFetchSystems,
  watchFetchFiles,
  watchPushKeys,
  watchScrollFiles,
  watchRename,
  watchMove,
  watchUpload,
  watchPreview,
  watchMkdir,
  watchDownload,
  watchTrash
} from './datafiles.sagas';
import { watchAllocations } from './allocations.sagas';

export default function* rootSaga() {
  yield all([
    watchJobs(),
    watchFetchSystems(),
    watchPushKeys(),
    watchFetchFiles(),
    watchScrollFiles(),
    watchRename(),
    watchMove(),
    watchUpload(),
    watchPreview(),
    watchMkdir(),
    watchDownload(),
    watchTrash(),
    watchAllocations()
  ]);
}