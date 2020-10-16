export const initialState = {
  users: null,
  loading: false,
  error: null
};

export function onboardingAdminList(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_ONBOARDING_ADMIN_LIST_PROCESSING':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_ONBOARDING_ADMIN_LIST_SUCCESS':
      return {
        ...state,
        users: action.payload.users,
        loading: false
      };
    case 'FETCH_ONBOARDING_ADMIN_LIST_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}

export const initialUserState = {
  user: null,
  loading: false,
  error: null
};

export function onboardingAdminIndividualUser(
  state = initialUserState,
  action
) {
  switch (action.type) {
    case 'FETCH_ONBOARDING_ADMIN_INDIVIDUAL_USER_PROCESSING':
      return {
        ...state,
        loading: true
      };
    case 'FETCH_ONBOARDING_ADMIN_INDIVIDUAL_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case 'FETCH_ONBOARDING_ADMIN_INDIVIDUAL_USER_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}