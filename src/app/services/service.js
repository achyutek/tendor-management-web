import { authHeader } from "../_helpers/auth-header";
import history from "../_helpers/history";
import { notification } from "antd";
import { Redirect } from "react-router-dom";

export const service = {
  fetchData,
  fetchDocument,
  sendEmail,
};

function fetchData(
  url,
  methodType,
  authRequired,
  bodyObject = {},
  isFile = false
) {
  let headers = {};
  let requestOptions = {};

  if (authRequired && isFile) {
    headers = { ...authHeader(), "Content-Type": "multipart/form-data" };
  } else if (authRequired) {
    headers = { ...authHeader(), "Content-Type": "application/json" };
  } else {
    headers = { "Content-Type": "application/json" };
  }

  if (
    (Object.keys(bodyObject).length > 0 || isFile) &&
    methodType.match(/POST|DELETE|PATCH/gi)
  ) {
    requestOptions = {
      method: methodType,
      headers: headers,
      body: JSON.stringify(bodyObject),
    };
  }
  if (isFile) {
    let user = JSON.parse(localStorage.getItem("current_user"));
    requestOptions = {
      method: methodType,
      headers: { Authorization: "Bearer " + user.authToken },
      body: bodyObject,
    };
  }
  if (
    Object.keys(bodyObject).length === 0 &&
    methodType.match(/GET|DELETE|PATCH/gi)
  ) {
    requestOptions = {
      method: methodType,
      headers: headers,
    };
  }

  return fetch(url, requestOptions).then(handleResponse)
  // .catch(handleError);
}

function fetchDocument(url, methodType, bodyObject) {
  let user = JSON.parse(localStorage.getItem("current_user"));
  let requestOption = {
    method: methodType,
    headers: {
      Authorization: "Bearer " + user.authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyObject),
  };
  return fetch(url, requestOption).then((response) => {
    return response.blob();
  });
}

function sendEmail(url, methodType, authRequired, bodyObject) {
  let requestOptions = {
    method: methodType,
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(bodyObject),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        // auto logout if 401 response returned from api
        localStorage.clear();
        history.push("/login");
        //location.reload(true);
      }
      const error = (data && data.errorMessage) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  }
  );
}

// function handleError(error) {
//   if (error == 'TypeError: Failed to fetch') {
//     // localStorage.clear();
//     history.push("/login");
//     //<Redirect to={{ pathname: '/login', state: { error: "The application is not available. Please contact IT admin to report the issue." } }} />
//     //throw new Error("The application is not available. Please contact IT admin to report the issue.");
//     return Promise.reject("The application is not available. Please contact IT admin to report the issue.");
//     //return 
//   } if (error == 'Forbidden') {
//     return Promise.reject("Your session time out.please try to login.");
//   } else {
//     return Promise.reject(error);
//   }

// }
