export const initialState = {
  list: {
    notifs: [],
    unread: 0,
    total: 0,
    page: 0,
    toasts: []
  },
  loading: false,
  loadingError: false,
  loadingErrorMessage: ''
};

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case 'NEW_NOTIFICATION':
      return {
        ...state,
        list: {
          ...state.list,
          notifs: [action.payload, ...state.list.notifs],
          unread: state.list.unread + 1,
          total: state.list.total + 1,
          toasts: [action.payload, ...state.list.toasts]
        }
      };
    case 'NOTIFICATIONS_LIST_FETCH_SUCCESS':
      return {
        list: {
          ...state.list,
          ...action.payload
        },
        loading: false,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'NOTIFICATIONS_LIST_FETCH_START':
      return {
        ...state,
        loading: true,
        loadingError: false,
        loadingErrorMessage: ''
      };
    case 'NOTIFICATIONS_LIST_FETCH_ERROR':
      return {
        ...state,
        loadingError: true,
        loadingErrorMessage: action.payload,
        loading: false
      };
    case 'DISCARD_TOAST':
      return {
        ...state,
        list: {
          ...state.list,
          toasts: state.list.toasts.filter(s => s.pk !== action.payload.pk)
        }
      };
    default:
      return state;
  }
}
