const initialSystemState = {
  private: '',
  community: '',
  public: ''
};

export function systems(state = initialSystemState, action) {
  switch (action.type) {
    case 'FETCH_SYSTEMS_SUCCESS':
      return { ...action.payload };
    default:
      return state;
  }
}

const initialFilesState = {
  loading: {
    FilesListing: false,
    RenameModal: false
  },
  operationStatus: {
    rename: null,
    move: {},
    upload: {}
  },
  loadingScroll: {
    FilesListing: false,
    modal: false
  },
  error: {
    FilesListing: false,
    modal: []
  },
  listing: {
    FilesListing: [],
    modal: []
  },
  params: {
    FilesListing: { api: '', scheme: '', system: '', path: '' },
    modal: { api: '', scheme: '', system: '', path: '' }
  },
  selected: {
    FilesListing: []
  },
  reachedEnd: {
    FilesListing: true,
    modal: true
  },
  modals: {
    preview: false,
    move: false,
    upload: false,
    mkdir: false,
    rename: false,
    pushKeys: false
  },
  modalProps: {
    preview: {},
    move: {},
    upload: {},
    mkdir: {},
    rename: {},
    pushKeys: {}
  },
  previewHref: ''
};

let selectedSet, enabled, setValue;
export function files(state = initialFilesState, action) {
  switch (action.type) {
    // Cases for fetching a new listing, e.g. on page load.
    case 'FETCH_FILES_START':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.section]: true },
        error: { ...state.error, [action.payload.section]: false },
        listing: { ...state.listing, [action.payload.section]: [] },
        params: {
          ...state.params,
          [action.payload.section]: action.payload.params
        },
        selected: {
          ...state.selected,
          [action.payload.section]: []
        }
      };
    case 'FETCH_FILES_SUCCESS':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.section]: false },
        error: { ...state.error, [action.payload.section]: false },
        listing: {
          ...state.listing,
          [action.payload.section]: [...action.payload.files]
        },
        reachedEnd: {
          ...state.reachedEnd,
          [action.payload.section]: action.payload.reachedEnd
        }
      };
    case 'FETCH_FILES_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.section]: false },
        error: {
          ...state.error,
          [action.payload.section]: action.payload.code
        },
        listing: { ...state.listing, [action.payload.section]: [] }
      };

    // Cases for fetching additional files to append to a listing
    case 'SCROLL_FILES_START':
      return {
        ...state,
        loadingScroll: {
          ...state.loadingScroll,
          [action.payload.section]: true
        },
        error: { ...state.error, [action.payload.section]: false }
      };
    case 'SCROLL_FILES_SUCCESS':
      return {
        ...state,
        loadingScroll: {
          ...state.loadingScroll,
          [action.payload.section]: false
        },
        error: { ...state.error, [action.payload.section]: false },
        listing: {
          ...state.listing,
          [action.payload.section]: [
            ...state.listing[action.payload.section],
            ...action.payload.files
          ]
        },
        reachedEnd: {
          ...state.reachedEnd,
          [action.payload.section]: action.payload.reachedEnd
        }
      };
    case 'SCROLL_FILES_ERR':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.section]: false },
        error: { ...state.error, [action.payload.section]: true },
        listing: { ...state.posts, [action.payload.section]: [] }
      };

    // Cases for selecting files.
    case 'DATA_FILES_TOGGLE_SELECT':
      selectedSet = new Set(state.selected[action.payload.section]);
      enabled = state.selected[action.payload.section].includes(
        action.payload.index
      );
      setValue =
        typeof action.payload.set !== 'undefined'
          ? action.payload.set
          : !enabled;
      if (setValue) {
        selectedSet.add(action.payload.index);
      } else {
        selectedSet.delete(action.payload.index);
      }

      return {
        ...state,
        selected: {
          ...state.selected,
          [action.payload.section]: [...selectedSet.values()]
        }
      };
    case 'DATA_FILES_SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.section]: action.payload.set
        }
      };
    case 'DATA_FILES_SET_OPERATION_STATUS':
      return {
        ...state,
        operationStatus: {
          ...state.operationStatus,
          [action.payload.operation]: action.payload.status
        }
      };
    case 'DATA_FILES_SET_OPERATION_STATUS_BY_KEY':
      return {
        ...state,
        operationStatus: {
          ...state.operationStatus,
          [action.payload.operation]: {
            ...state.operationStatus[action.payload.operation],
            [action.payload.key]: action.payload.status
          }
        }
      };
    case 'DATA_FILES_SET_PREVIEW_HREF':
      return {
        ...state,
        previewHref: action.payload.href
      };

    case 'DATA_FILES_TOGGLE_MODAL':
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.operation]: !state.modals[action.payload.operation]
        },
        modalProps: {
          ...state.modalProps,
          [action.payload.operation]: action.payload.props
        }
      };
    default:
      return state;
  }
}