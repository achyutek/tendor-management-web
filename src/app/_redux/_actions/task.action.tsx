import { rfpService } from "../../services/rfp-service";
import { taskConstants } from "../_constants";
import { alertActions } from "./alert.actions";

export const taskAction = {
  getOpenTask,
};
function getOpenTask(pageNumber: number) {
  return (dispatch: any) => {
    dispatch(request({ pageNumber }));
    rfpService.getOpenTasks(pageNumber).then(
      (RfpOpenTaskData) => {
        dispatch(success(RfpOpenTaskData));
      },
      (error) => {
        dispatch(failure(error.tostring()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request(interval: any) {
    return {
      type: taskConstants.GETTASKOPEN_REQUEST,
      interval,
    };
  }
  function success(RfpOpenTaskData: any) {
    return {
      type: taskConstants.GETTASKOPEN_SUCCESS,
      RfpOpenTaskData,
    };
  }
  function failure(error: string) {
    return { type: taskConstants.GETTASKOPEN_FAILURE, error };
  }
}
