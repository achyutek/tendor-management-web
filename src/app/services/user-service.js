import { baseService } from "../services/base.service";
import { service } from "../services/service";

export const userService = {
  login,
  resetUserPwd,
  updatePwd,
  verifyTempPwd,
  getLoggedInUserAccount,
  getUsersByApp,
  getRoleUser,
  adduser,
  getLoggedInUserId,
  getLoggedInUser,
  deleteUser,
  getUserById,
  upsertUser,
  getLoggedInUserRole,
  userSerachData,
};

function login(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/public/login", "POST", false, user);
}

function resetUserPwd(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/public/pwd/reset", "POST", false, user);
}

function updatePwd(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/pwd/update", "POST", true, user);
}

function verifyTempPwd(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/public/pwd/verify", "POST", false, user);
}

function getUsersByApp() {
  return service.fetchData(baseService.userServiceEndPoint() + "/all", "GET", true, {});
}

function getRoleUser(){
  return service.fetchData(baseService.accountServiceEndPoint() + "/roles", "GET", true, {});
}

function adduser(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/add", "POST", true, user);
}

function upsertUser(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/update", "PATCH", true, user);
}

function deleteUser(user) {
  return service.fetchData(baseService.userServiceEndPoint() + "/delete", "POST", true, user);
}

function getUserById(email) {
  return service.fetchData(baseService.userServiceEndPoint() + "/email/" + email, "GET", true, {});
}

function userSerachData(text){
   return service.fetchData(baseService.userServiceEndPoint() + "/search/text/"+text, "GET", true, {});
}

function getLoggedInUserId() {
  let user = this.getLoggedInUser();
  if (user) {
    return user.email;
  }
  return undefined;
}

function getLoggedInUser() {
  if (
    localStorage.getItem("current_user") !== "undefined" &&
    localStorage.getItem("current_user") !== ""
  ) {
    return JSON.parse(localStorage.getItem("current_user"));
  }
}

function getLoggedInUserRole() {
  let user = getLoggedInUser();
  if (user) {
    return user.role;
  }
  return undefined;
}

async function getLoggedInUserAccount() {
  let user;
  if (localStorage.getItem("current_user")) {
    user = JSON.parse(localStorage.getItem("current_user"));
  }
  return user.account;
}

function getCurrentApp() {
  let currentApp = {};
  currentApp.baseUrl = window.location.origin;
  currentApp.name = baseService.getApp();
  return currentApp;
}