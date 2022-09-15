import { StringConstants } from "./string.constants";

export class MessageProp extends StringConstants {
  ASSOCIATION_ALREADY_SELECTED = "This association has already been selected";
  APPLICAITON_NOT_AVAILABLE =
    "The application is not available. Please contact IT admin to report the issue.";
  LOGIN_NOT_AUTHORIZED =
    "/login?error=You are either not authorized or accessing the app from unverified device.";
  WORK_ADDRESS_EMPTY = "You've not submitted your work address";
  LEAVE_BALANCE_ERROR =
    "An Employee/Consultant of your id has to be added to view leave balance";
  LEAVE_ADD_ERROR =
    "An Employee/Consultant of your id has to be added to add a leave";
  HIRED_EDIT_ERROR =
    "Please make sure the onboarding process is complete before editing the consultant";
  static CREATED_SUCCESS_MSG = "${name}  has been created successfully.";
  static UPDATED_SUCCESS_MSG = "${name}  has been updated successfully";
  static UPLOADED_SUCCESS_MSG = "${name} has been uploaded successfully";
  static EXPORTED_SUCCESS_MSG = "${name}  has been uploaded successfully";
  static DOWNLAODED_SUCCESS_MSG = "${name}  has been downloaded successfully";
  static DELETED_SUCCESS_MSG = "${name}  has been deleted successfully";
  static COMPELTED_SUCCESS_MSG = "${name} has been completed successfully ";

  static getAddedSuccessMessage = (name: string) => {
    return name + "  has been added successfully.";
  };
  static getCreatedSuccessMessage = (name: string) => {
    return name + "  has been created successfully.";
  };
  static getCompletedSuccessMessage = (name: string) => {
    return name + "  has been completed successfully.";
  };

  static getUpdatedSuccessMessage = (name: string) => {
    return name + "  has been updated successfully.";
  };

  static getUploadedeSucessMessage = (name: string) => {
    return name + "  has been uploaded successfully.";
  };

  static getDeletedSucessMessage = (name: string) => {
    return name + "  has been deleted successfully.";
  };

  static getExportSucessMessage = (name: string) => {
    return name + "  has been exported document successfully.";
  };

  static getDownloadedSucessMessage = (name: string) => {
    return name + "  has been downloaded successfully.";
  };

  static getApprovedMessage = (name: string) => {
    return name + "  has been approved successfully.";
  };

  static getRejectedMessage = (name: string) => {
    return name + "  has been rejected successfully.";
  };

  static documentNotExist = () => {
    return "Please upload file to submit.";
  };
}
