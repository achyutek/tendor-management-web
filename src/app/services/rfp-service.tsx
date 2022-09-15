import { domain } from "process";
import { baseService } from "../services/base.service";
import { service } from "../services/service";
import { Attribute } from "../_models";
import { ResponseContent } from "../_models/proposal-request.model";
export const rfpService = {
  getRfpMetricsByAttribute,
  getRfpTask,
  getRfpTaskOpen,
  getRfpProposals,
  getRfpProposalsPages,
  getRfpProposalsByDomain,
  getRfpByAttribute,
  getRfpProposalsByOwner,
  getRfpProposalsByCountry,
  getSubDomains,
  addProposals,
  getProposalRequest,
  getResponseContentByProposal,
  getDocumentsByRFP,
  moveFileToPreviewFolder,
  fileDownload,
  getOpenTasks,
  getWonComments,
  getResponseContentBySubDomain,
  getNoOfPageForResponseContentBySubDomain,
  getNoOfPageForWonProposals,
  getWonProposals,
  getMyTasks,
  uploadDocument,
  getResponseContentChildsById,
  updateProposalResponseContent,
  getCompetitive,
  addCompetitve,
  getCompetitiveDetails,
  getAnalytical,
  getRfpTarget,
  getWeekReport,
  updateProposalRequest,
  addTask,
  addProposalResponse,
  exportProposalResponse,
  addCompetitiveRFP,
  getProposalRequestsForReportByActionPages,
  getProposalRequestsForReportByAction,
  getProposalRequestsForReportByStatusPages,
  getProposalRequestsForReportByStatus,
  addDocument,
  getRfpTotal,
  getRfpDomainCount,
  getRfpDueCountwithDomain,
  getRfpTotalWithDomain,
  deleteProposal,
  getRfpByStatusWithDomain,
  getRfpByTypeWithDomain,
  getRfpByDomainWithDomain,
  zipFileDownload,
  deleteDocument,
  updateCompetitve,
  addProposalResponseContent,
  TaskComplete,
  getResponseContentByParentId,
  getResponseContentById,
  RejectContents,
  updateProposalResponseOrder,
  deleteResponseContent,
  deleteResponseIntelligent,
  assignTask,
  changeDueDate,
  searchResponseContent,
  addRfpTarget,
  searchResponseResponse,
  searchProposalCreated,
  searchProposaldue,
  filterTypeData,
  filterDomainData,
  filterActionData,
  filterStatusData,
  filterStatusTotalCount,
  filterActionTotalCount,
  filterTypeTotalCount,
  filterDomainTotalCount,
  filterContractTypeTotalCount,
  filterContractTypeData,
  filterSubmissionTypeTotalCount,
  filterSubmissionTypeData,
  doFollowUp,
  getRfpProposalsPagesByAll,
  getRfpProposalsByAll,
  getLastWonProposal,
  getProcessDefs,
  getDomain,
  addAttribute,
  deleteAttributes,
  searchTasks,
  searchMyTasks,
  getResponseListContentBySubDomain,
  wonProposalSearch,
  getSearchWomComments,
  getSearchCompetitive,
  getRfpProposalsPagesByAllString,
  getRfpProposalsByAllString,
  checkActionStatus,
  updateActionStatus,
  updateStatus,
  getCountry,
  getStates,
  getCities,
  getZipCodes,
};
function getRfpMetricsByAttribute(type: string, interval: number) {
  let url =
    baseService.requestServiceEndPoint() +
    "/metrics/" +
    type +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpTotal(interval: number) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/total/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpTotalWithDomain(
  region: string,
  domain: string,
  interval: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/totalWithDomain/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpByStatusWithDomain(
  region: string,
  domain: string,
  interval: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/statusWithDomain/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpByTypeWithDomain(
  region: string,
  domain: string,
  interval: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/typeWithDomain/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpByDomainWithDomain(
  region: string,
  domain: string,
  interval: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/domainWithDomain/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpDomainCount(region: string, domain: string, interval: number) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/total/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpDueCountwithDomain(
  region: string,
  domain: string,
  interval: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/request/metrics/due/region/" +
    region +
    "/domain/" +
    domain +
    "/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getRfpTask() {
  let url = baseService.workflowServiceEndPoint() + "/tasks/count/my";
  return service.fetchData(url, "GET", true, {});
}

function getRfpTaskOpen() {
  let url = baseService.workflowServiceEndPoint() + "/tasks/count/open";
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposals(
  attribute: string,
  interval: number,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/interval/" +
    interval +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsPages(attribute: string, interval: number) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/count/interval/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}
function getRfpProposalsPagesByAll(
  attribute: string,
  interval: number,
  status: Array<string>,
  type: string,
  action: string,
  region: string,
  domain: string,
  submissionType: string,
  contractType: string,
  subDomain: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/count/" +
    interval +
    "/" +
    status +
    "/" +
    type +
    "/" +
    action +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    submissionType +
    "/" +
    contractType +
    "/" +
    subDomain;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsPagesByAllString(
  attribute: string,
  interval: number,
  status: string,
  type: string,
  action: string,
  region: string,
  domain: string,
  submissionType: string,
  contractType: string,
  subDomain: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/count/" +
    interval +
    "/" +
    status +
    "/" +
    type +
    "/" +
    action +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    submissionType +
    "/" +
    contractType +
    "/" +
    subDomain;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsByAll(
  attribute: string,
  interval: number,
  status: Array<string>,
  type: string,
  action: string,
  region: string,
  domain: string,
  submissionType: string,
  contractType: string,
  subDomain: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/" +
    interval +
    "/" +
    status +
    "/" +
    type +
    "/" +
    action +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    submissionType +
    "/" +
    contractType +
    "/" +
    subDomain +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsByAllString(
  attribute: string,
  interval: number,
  status: string,
  type: string,
  action: string,
  region: string,
  domain: string,
  submissionType: string,
  contractType: string,
  subDomain: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/" +
    interval +
    "/" +
    status +
    "/" +
    type +
    "/" +
    action +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    submissionType +
    "/" +
    contractType +
    "/" +
    subDomain +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function getProposalRequestsForReportByActionPages(
  attribute: string,
  region: string,
  domain: string,
  action: string,
  query: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/count/" +
    region +
    "/" +
    domain +
    "/" +
    action +
    "/" +
    query;
  return service.fetchData(url, "GET", true, {});
}
function getProposalRequestsForReportByAction(
  attribute: string,
  region: string,
  domain: string,
  action: string,
  query: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    action +
    "/" +
    query +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}
function getProposalRequestsForReportByStatusPages(
  attribute: string,
  region: string,
  domain: string,
  status: string,
  query: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/count/" +
    region +
    "/" +
    domain +
    "/" +
    status +
    "/" +
    query;
  return service.fetchData(url, "GET", true, {});
}
function getProposalRequestsForReportByStatus(
  attribute: string,
  region: string,
  domain: string,
  status: string,
  query: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/" +
    attribute +
    "/" +
    region +
    "/" +
    domain +
    "/" +
    status +
    "/" +
    query +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}
function getRfpByAttribute(type: string) {
  let url = baseService.requestServiceEndPoint() + "/" + type;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsByDomain(interval: number, domain: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval" +
    interval +
    "/domain" +
    domain;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsByOwner() {
  let url = baseService.userServiceEndPoint() + "/users";
  return service.fetchData(baseService.userServiceEndPoint() + "/all", "GET", true, {});
}

function getSubDomains(domain: string) {
  let url = baseService.requestServiceEndPoint() + "/subDomain/" + domain;
  return service.fetchData(url, "GET", true, {});
}

function getDomain(region: string) {
  let url = baseService.requestServiceEndPoint() + "/domain/" + region;
  return service.fetchData(url, "GET", true, {});
}

function addProposals(request: any) {
  let url = baseService.rfpServiceEndPoint() + "/request";
  return service.fetchData(url, "POST", true, request);
}

function updateProposalRequest(request: any) {
  let url = baseService.rfpServiceEndPoint() + "/request";
  return service.fetchData(url, "PATCH", true, request);
}

function addProposalResponseContent(ProposalContent: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/content";
  return service.fetchData(url, "POST", true, ProposalContent);
}

function getProposalRequest(id: string) {
  let url = baseService.rfpServiceEndPoint() + "/request/" + id;
  return service.fetchData(url, "GET", true, {});
}

function getResponseContentByProposal(id: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/response/content/proposal/" +
    id +
    "/" +
    -1;
  return service.fetchData(url, "GET", true, {});
}

function getDocumentsByRFP(id: string) {
  let url = baseService.documentServiceEndPoint() + "/entity/" + id;
  return service.fetchData(url, "GET", true, {});
}

function getRfpProposalsByCountry() {
  let url = "https://api.first.org/data/v1/countries";
  return service.fetchData(url, "GET", true, {});
}

function moveFileToPreviewFolder(document: any) {
  let url = baseService.documentServiceEndPoint() + "/move";
  return service.fetchData(url, "POST", true, document);
}

function fileDownload(document: any) {
  let url = baseService.documentServiceEndPoint() + "/download";
  return service.fetchDocument(url, "POST", document);
}

function searchTasks(text: string, interval: string) {
  let url =
    baseService.workflowServiceEndPoint() +
    "/tasks/" +
    text +
    "/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function searchMyTasks(text: string, interval: string) {
  let url =
    baseService.workflowServiceEndPoint() +
    "/myTasks/" +
    text +
    "/" +
    interval;
  return service.fetchData(url, "GET", true, {});
}

function getOpenTasks(pageNumber: number) {
  let url = baseService.workflowServiceEndPoint() + "/tasks/open/" + -1;
  return service.fetchData(url, "GET", true, {});
}

function getMyTasks(pageNumber: number) {
  let url = baseService.workflowServiceEndPoint() + "/tasks/my/" + -1;
  return service.fetchData(url, "GET", true, {});
}

function getWonComments(region: string, domain: string) {
  let url =
    baseService.requestServiceEndPoint() +
    "/competitive/comment/region/" +
    region +
    "/domain/" +
    domain;
  return service.fetchData(url, "GET", true, {});
}

function getSearchWomComments(region: string, domain: string, text: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/search/competitive/comment/region/" +
    region +
    "/domain/" +
    domain +
    "/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function getResponseContentBySubDomain(
  region: string,
  domain: string,
  subDomain: string,
  pageNumber: number
) {
  let url =
    baseService.responseServiceEndPoint() +
    "/content/region/" +
    region +
    "/domain/" +
    domain +
    "/subDomain/" +
    subDomain +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function getResponseListContentBySubDomain(
  region: string,
  domain: string,
  subDomain: string,
  pageNumber: number
) {
  let url =
    baseService.responseServiceEndPoint() +
    "/contentList/region/" +
    region +
    "/domain/" +
    domain +
    "/subDomain/" +
    subDomain +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function getNoOfPageForResponseContentBySubDomain(
  domain: string,
  subDomain: string
) {
  let url =
    baseService.responseServiceEndPoint() +
    "/content/domain/" +
    domain +
    "/subDomain/" +
    subDomain;
  return service.fetchData(url, "GET", true, {});
}

function getNoOfPageForWonProposals() {
  let url =
    baseService.requestServiceEndPoint() + "s/count/interval/-1/status/Won";
  return service.fetchData(url, "GET", true, {});
}

function getWonProposals(pageNumber: number) {
  let url =
    baseService.requestServiceEndPoint() +
    "s/interval/-1/status/Won/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function wonProposalSearch(interval: any, text: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/search/requests/interval/" +
    interval +
    "/status/Won/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function uploadDocument(formData: any, id: string, docType: any) {
  let url =
    baseService.documentServiceEndPoint() + "/upload/ownerId/" + id ;
  return service.fetchData(url, "POST", true, formData, true);
}

function getResponseContentChildsById(
  id: string,
  question: string,
  pageNumber: number
) {
  let url =
    baseService.responseServiceEndPoint() +
    "/content/child/" +
    id +
    "/question/" +
    encodeURIComponent(question) +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function updateProposalResponseContent(response: ResponseContent) {
  let url = baseService.rfpServiceEndPoint() + "/response";
  return service.fetchData(url, "PATCH", true, response);
}

function getCompetitive(region: string, domain: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/responses/competitive/" +
    region +
    "/" +
    domain;
  return service.fetchData(url, "GET", true, {});
}

function getSearchCompetitive(region: string, domain: string, text: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/search/responses/competitive/region/" +
    region +
    "/domain/" +
    domain +
    "/text/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function addCompetitve(competitive: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/competitive/";
  return service.fetchData(url, "POST", true, competitive);
}

function updateCompetitve(competitive: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/competitive/";
  return service.fetchData(url, "PATCH", true, competitive);
}

function getCompetitiveDetails(id: string) {
  let url = baseService.rfpServiceEndPoint() + "/response/competitive/" + id;
  return service.fetchData(url, "GET", true, {});
}

function getAnalytical(month: number, year: number) {
  let url = baseService.rfpServiceEndPoint() + "/report/" + month + "/" + year;
  return service.fetchData(url, "GET", true, {});
}

function getRfpTarget(month: number, year: number) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/report/rfpTarget/" +
    month +
    "/" +
    year;
  return service.fetchData(url, "GET", true, {});
}

function getWeekReport(weekly: string) {
  let url = baseService.rfpServiceEndPoint() + "/report/weekly/" + weekly;
  return service.fetchData(url, "GET", true, {});
}

function addTask(userTask: any) {
  let url = baseService.workflowServiceEndPoint() + "/task/add";
  return service.fetchData(url, "POST", true, userTask);
}

function addProposalResponse(responseContent: any) {
  let url = baseService.rfpServiceEndPoint() + "/response";
  return service.fetchData(url, "POST", true, responseContent);
}

function exportProposalResponse(responseContent: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/content/export";
  return service.fetchDocument(url, "POST", responseContent);
}

function addCompetitiveRFP(request: any) {
  let url = baseService.rfpServiceEndPoint() + "/request/competitive";
  return service.fetchData(url, "POST", true, request);
}

function addDocument(document: any) {
  let url = baseService.documentServiceEndPoint() + "/add";
  return service.fetchData(url, "POST", true, document);
}

function deleteProposal(request: any) {
  let url = baseService.rfpServiceEndPoint() + "/request/delete";
  return service.fetchData(url, "POST", true, request);
}

function zipFileDownload(selectedRow: any) {
  let url = baseService.documentServiceEndPoint() + "/download/zip";
  return service.fetchDocument(url, "POST", selectedRow);
}

function deleteDocument(selectedRow: any) {
  let url = baseService.documentServiceEndPoint() + "/delete";
  return service.fetchData(url, "POST", true, selectedRow);
}

function deleteResponseIntelligent(selectedRow: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/competitive/delete";
  return service.fetchData(url, "POST", true, selectedRow);
}

function TaskComplete(task: any) {
  let url = baseService.workflowServiceEndPoint() + "/task/complete/false";
  return service.fetchData(url, "POST", true, task);
}

function getResponseContentByParentId(id: any) {
  let url =
    baseService.rfpServiceEndPoint() + "/response/content/parentId/" + id;
  return service.fetchData(url, "GET", true, {});
}
function getResponseContentById(id: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/content/" + id;
  return service.fetchData(url, "GET", true, {});
}
function RejectContents(newContent: any) {
  let url = baseService.rfpServiceEndPoint() + "/content/reject";
  return service.fetchData(url, "POST", true, newContent);
}
function updateProposalResponseOrder(response: any, responseId: number) {
  let url = baseService.rfpServiceEndPoint() + "/response/order/" + responseId;
  return service.fetchData(url, "PATCH", true, response);
}

function deleteResponseContent(selectedRow: any) {
  let url = baseService.rfpServiceEndPoint() + "/response/content/delete";
  return service.fetchData(url, "POST", true, selectedRow);
}

function assignTask(task: any) {
  let url = baseService.workflowServiceEndPoint() + "/task/assign";
  return service.fetchData(url, "POST", true, task);
}
function changeDueDate(task: any) {
  let url = baseService.workflowServiceEndPoint() + "/updateDueDate";
  return service.fetchData(url, "POST", true, task);
}

function addRfpTarget(month: number, year: number, Target: any) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/report/rfpTarget/" +
    month +
    "/" +
    year;
  return service.fetchData(url, "POST", true, Target);
}
function searchResponseContent(
  region: string,
  domain: string,
  subDomain: string,
  text: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/response/content/region/" +
    region +
    "/domain/" +
    domain +
    "/subDomain/" +
    subDomain +
    "/text/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function searchResponseResponse(text: string) {
  let url = baseService.rfpServiceEndPoint() + "/response/text/" + text;
  return service.fetchData(url, "GET", true, {});
}

function searchProposalCreated(text: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/search/requests/created/interval/" +
    interval +
    "/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function searchProposaldue(text: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/search/requests/due/interval/" +
    interval +
    "/" +
    text;
  return service.fetchData(url, "GET", true, {});
}

function filterTypeData(type: string, interval: string, pageNumber: number) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/type/" +
    type +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterDomainData(
  domain: string,
  interval: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/domain/" +
    domain +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterActionData(
  action: string,
  interval: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/action/" +
    action +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterStatusData(
  status: string,
  interval: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/status/" +
    status +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterContractTypeData(
  contractType: string,
  interval: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/contractType/" +
    contractType +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterSubmissionTypeData(
  submissionType: string,
  interval: string,
  pageNumber: number
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/interval/" +
    interval +
    "/submissionType/" +
    submissionType +
    "/" +
    pageNumber;
  return service.fetchData(url, "GET", true, {});
}

function filterStatusTotalCount(status: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/status/" +
    status;

  return service.fetchData(url, "GET", true, {});
}

function filterActionTotalCount(action: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/action/" +
    action;

  return service.fetchData(url, "GET", true, {});
}

function filterTypeTotalCount(type: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/type/" +
    type;

  return service.fetchData(url, "GET", true, {});
}

function filterDomainTotalCount(domain: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/domain/" +
    domain;

  return service.fetchData(url, "GET", true, {});
}

function filterContractTypeTotalCount(contractType: string, interval: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/contractType/" +
    contractType;

  return service.fetchData(url, "GET", true, {});
}

function filterSubmissionTypeTotalCount(
  submissionType: string,
  interval: string
) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/requests/count/interval/" +
    interval +
    "/submissionType/" +
    submissionType;

  return service.fetchData(url, "GET", true, {});
}

function doFollowUp(proposals: any) {
  let url = baseService.requestServiceEndPoint() + "/followUp";
  return service.fetchData(url, "POST", true, proposals);
}
function getLastWonProposal() {
  let url = baseService.rfpServiceEndPoint() + "/request/lastWon";
  return service.fetchData(url, "GET", true, {});
}

function getProcessDefs() {
  let url = baseService.workflowServiceEndPoint() + "/process/def";
  return service.fetchData(url, "GET", true, {});
}

function addAttribute(attribute: Attribute, type: string) {
  let url = baseService.requestServiceEndPoint() + "/" + type;
  return service.fetchData(url, "POST", true, attribute);
}

function deleteAttributes(attribute: Attribute) {
  if (attribute.type === "Status") {
    attribute.type = "status";
  } else if (attribute.type === "Type") {
    attribute.type = "type";
  } else if (attribute.type === "Region") {
    attribute.type = "region";
  } else if (attribute.type === "Domain") {
    attribute.type = "domain";
  } else if (attribute.context === "SubDomain") {
    attribute.context = "subDomain";
  } else if (attribute.type === "Source") {
    attribute.type = "source";
  } else if (attribute.type === "SubmissionType") {
    attribute.type = "submission";
  }

  if (attribute.type === "domain") {
    let url =
      baseService.requestServiceEndPoint() +
      "/" +
      attribute.type +
      "/" +
      attribute.name +
      "/" +
      attribute.context;
    return service.fetchData(url, "DELETE", true, attribute);
  } else if (attribute.context === "subDomain") {
    let url =
      baseService.requestServiceEndPoint() +
      "/" +
      attribute.context +
      "/domain/" +
      attribute.type +
      "/name/" +
      attribute.name;
    return service.fetchData(url, "DELETE", true, attribute);
  } else if (attribute.type === "ContractType") {
    let url =
      baseService.requestServiceEndPoint() + "/contract/" + attribute.name;
    return service.fetchData(url, "DELETE", true, attribute);
  } else {
    let url =
      baseService.requestServiceEndPoint() +
      "/" +
      attribute.type +
      "/" +
      attribute.name;
    return service.fetchData(url, "DELETE", true, attribute);
  }
}

function checkActionStatus(id: string) {
  let url =
    baseService.rfpServiceEndPoint() + "/" + "checkActionStatus" + "/" + id;
  return service.fetchData(url, "GET", true, {});
}

function updateActionStatus(id: string, action: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/" +
    "updateAction" +
    "/" +
    id +
    "/" +
    action;
  return service.fetchData(url, "PATCH", true, {});
}

function updateStatus(id: string, status: string) {
  let url =
    baseService.rfpServiceEndPoint() +
    "/" +
    "updateStatus" +
    "/" +
    id +
    "/" +
    status;
  return service.fetchData(url, "PATCH", true, {});
}

function getCountry() {
  let url = baseService.locationServiceEndPoint() + "/location/countries";
  return service.fetchData(url,"GET",true,{});
}

function getStates(country: string) {
  let url = baseService.locationServiceEndPoint() + "/location/country/" + country;
  return service.fetchData(url,"GET",true,{});
}

function getCities(country: string, state: string) {
  let url = baseService.locationServiceEndPoint()+ "/location/country/" + country + "/state/" + state;
  return service.fetchData(url,"GET",true,{});
}

function getZipCodes(country: string, state: string, city: string) {
  let url = baseService.locationServiceEndPoint() + "/location/country/" + country + "/state/" + state + "/city/" + city;
  return service.fetchData(url,"GET",true,{});
}
