import { userConstants } from "../_constants/user.constants";
import { userService } from "../../services/user-service";
import history from "../../_helpers/history";
import { notification } from "antd";
import { User } from "../../_models";
import { notifications } from "../../_helpers/notifications";
import { resetFilterAction } from "./filter.action";

export const userActions = {
  login,
  logout,
  resetUserPwd,
  updatePwd,
  verifyTempPwd,
};

let successMsg = "";
let errorMsg = "";
let warningMsg = "";

function login(user: User, state: any) {
  return (dispatch: any) => {
    dispatch(request(user));
    userService.login(user).then(
      (user) => {
        localStorage.setItem("current_user", JSON.stringify(user));
        if (state.from !== undefined) {
          dispatch(success(user));
          if (state.search) history.push(state.from + state.search);
          else history.push(state.from);
          // history.push("/dashboard");
        } else {
          dispatch(success(user));
          history.push("/dashboard");
        }
      },
      (error: any) => {
        dispatch(failure(error));
        errorMsg = error.toString();
        notifications.openErrorNotification(errorMsg);
      }
    );
  };

  function request(user: User) {
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user: User) {
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error: any) {
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

function logout() {
  return (dispatch: any) => {
    localStorage.clear();
    dispatch(resetFilterAction());
    dispatch(success());
    history.push("/login");
  };
  function success() {
    return { type: userConstants.LOGOUT };
  }
}

function resetUserPwd(user: User) {
  return (dispatch: any) => {
    dispatch(request(user));
    userService.resetUserPwd(user).then(
      (resetUser) => {
        dispatch(success(resetUser));
        successMsg = "If your email is registered with us, you will get a reset password link to this email.";
        notifications.openSuccessNotification(successMsg);
        history.push("/login");
      },
      (error: any) => {
        dispatch(failure(error.toString()));
        successMsg = "If your email is registered with us, you will get a reset password link to this email.";
        notifications.openSuccessNotification(successMsg);
        history.push("/login");
      }
    );
  };
  function request(user: User) {
    return { type: userConstants.RESETUSERPASSOWRD_REQUEST, user };
  }
  function success(user: User) {
    return { type: userConstants.RESETUSERPASSOWRD_SUCCESS, user };
  }
  function failure(error: any) {
    return { type: userConstants.RESETUSERPASSOWRD_FAILURE, error };
  }
}

function updatePwd(user: User) {
  return (dispatch: any) => {
    dispatch(request(user));
    localStorage.setItem("current_user", JSON.stringify(user));
    userService.updatePwd(user).then(
      (updateUserPwd) => {
        dispatch(success(updateUserPwd));
        successMsg = "Your password has been changed successfully!";
        notifications.openSuccessNotification(successMsg);
        history.push("/login");
      },
      (error: any) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request(user: User) {
    return { type: userConstants.UPDATEPASSOWRD_REQUEST, user };
  }
  function success(user: User) {
    return { type: userConstants.UPDATEPASSOWRD_SUCCESS, user };
  }
  function failure(error: any) {
    return { type: userConstants.UPDATEPASSOWRD_FAILURE, error };
  }
}

function verifyTempPwd(user: User) {
  return (dispatch: any) => {
    dispatch(request(user));
    userService.verifyTempPwd(user).then(
      (verifyTempPassword) => {
        dispatch(success(verifyTempPassword));
      },
      (error: any) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request(user: User) {
    return { type: userConstants.VERYFYTEMPPWD_REQUEST, user };
  }
  function success(user: User) {
    return { type: userConstants.VERYFYTEMPPWD_SUCCESS, user };
  }
  function failure(error: any) {
    return { type: userConstants.VERYFYTEMPPWD_FAILURE, error };
  }
}
