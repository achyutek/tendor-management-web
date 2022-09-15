export const baseService = {
  serviceEndPoint,
  rfpServiceEndPoint,
  userServiceEndPoint,
  requestServiceEndPoint,
  organizationServiceEndPoint,
  timesheetServiceEndPoint,
  billingServiceEndPoint,
  documentServiceEndPoint,
  gatewayServiceEndPoint,
  recognitionServiceEndPoint,
  getApp,
  getBaseUrl,
  workflowServiceEndPoint,
  responseServiceEndPoint,
  accountServiceEndPoint,
  locationServiceEndPoint,
};

function serviceEndPoint() {
  return "https://api-uat.softsages.com/rfp";
  // return "http://localhost:6040/rfp";
}

function userServiceEndPoint() {
  return this.serviceEndPoint() + "/user";
}
function accountServiceEndPoint() {
  return this.serviceEndPoint() + "/account";
}
function rfpServiceEndPoint() {
  return this.serviceEndPoint() + "/v1";
}
function requestServiceEndPoint() {
  return this.serviceEndPoint() + "/v1/request";
}
function responseServiceEndPoint() {
  return this.serviceEndPoint() + "/v1/response";
}
function workflowServiceEndPoint() {
  return this.serviceEndPoint() + "/workflow";
}
function organizationServiceEndPoint() {
  return this.serviceEndPoint() + "/v1/entity";
}
function timesheetServiceEndPoint() {
  return this.serviceEndPoint() + "/v1";
}
function billingServiceEndPoint() {
  return this.serviceEndPoint() + "/v1";
}
function documentServiceEndPoint() {
  return this.serviceEndPoint() + "/document";
}
function gatewayServiceEndPoint() {
  return this.serviceEndPoint() + "/v1/gateway";
}
function recognitionServiceEndPoint() {
  return this.serviceEndPoint() + "/v1/entity";
}
function getApp() {
  return "RFP";
}
function getBaseUrl() {
  return window.location.origin;
}
function locationServiceEndPoint() {
  return this.serviceEndPoint() + "/config";
}
