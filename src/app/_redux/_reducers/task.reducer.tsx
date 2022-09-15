import initialState from "../initialState";
import { taskConstants } from "../_constants";
export function getRfpTaskOpen(state = initialState.openTask, action: any) {
  switch (action.type) {
    case taskConstants.GETTASKOPEN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case taskConstants.GETTASKOPEN_SUCCESS:
      return {
        ...state,
        RfpOpenTaskData: action.RfpOpenTaskData,
      };
    case taskConstants.GETTASKOPEN_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
