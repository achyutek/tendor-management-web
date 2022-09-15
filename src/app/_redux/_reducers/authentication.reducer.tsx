import initialState from "../initialState";
import { userConstants } from "../_constants/user.constants";
// let user = JSON.parse(localStorage.getItem('current_user'));
export function authentication(state = initialState.auth, action: any) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
        loading: true,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
        loading: false,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        loggedIn: false,
        user: {},
        loading: false,
      };
    case userConstants.LOGOUT:
      return {
        loggedIn: false,
        user: {},
        loading: false,
      };
    default:
      return state;
  }
}
