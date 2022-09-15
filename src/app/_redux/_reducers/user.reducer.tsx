import initialState from "../initialState";
import { userConstants } from "../_constants/user.constants";

export function resetUserPwd(state = initialState.user, action: any) {
  switch (action.type) {
    case userConstants.RESETUSERPASSOWRD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userConstants.RESETUSERPASSOWRD_SUCCESS:
      return {
        ...state,
        resetUser: action.resetUser,
        loading: false,
      };

    case userConstants.RESETUSERPASSOWRD_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}

export function updatePwd(state = initialState.user, action: any) {
  switch (action.type) {
    case userConstants.UPDATEPASSOWRD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userConstants.UPDATEPASSOWRD_SUCCESS:
      return {
        ...state,
        updateUserPwd: action.updateUserPwd,
        loading: false,
      };

    case userConstants.UPDATEPASSOWRD_FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
}

export function verifyTempPwd(state = initialState.user, action: any) {
  switch (action.type) {
    case userConstants.VERYFYTEMPPWD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case userConstants.VERYFYTEMPPWD_SUCCESS:
      return {
        ...state,
        verifyTempPassword: action.verifyTempPassword,
      };

    case userConstants.VERYFYTEMPPWD_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
