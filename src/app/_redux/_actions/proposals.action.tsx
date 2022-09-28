import { rfpService } from "../../services/rfp-service";
import { AttributeType } from "../_constants";
import { alertActions } from "./alert.actions";
import { proposalsConstants } from "../_constants/proposals.constants";
import { notifications } from "../../_helpers/notifications";
export const proposalsAction = {
  getRfpProposals,
  getRfpProposalsPages,
  getRfpProposalsByDomain,
  getRfpByDomain,
  getRfpByStatus,
  getRfpByType,
  getRfpByContract,
  getRfpByAction,
  getRfpBySubmission,
  getRfpBySource,
  getRfpByOwner,
};

function getRfpProposals(interval: number, pageNumber: number) {
  return (dispatch: any) => {
    dispatch(request({ interval, pageNumber }));
    rfpService.getRfpProposals("", interval, pageNumber).then(
      (proposalsData) => {
        dispatch(success(proposalsData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        notifications.openErrorNotification(error.toString());
        }
      }
    );
  };

  function request(interval: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSAL_REQUEST,
      interval,
    };
  }
  function success(proposalsData: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSAL_SUCCESS,
      proposalsData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPPROPOSAL_FAILURE, error };
  }
}

function getRfpProposalsPages(interval: number) {
  return (dispatch: any) => {
    dispatch(request({ interval }));
    rfpService.getRfpProposalsPages("", interval).then(
      (proposalsPagesData) => {
        dispatch(success(proposalsPagesData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        notifications.openErrorNotification(error.toString());
        }
      }
    );
  };

  function request(interval: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSALPAGES_REQUEST,
      interval,
    };
  }
  function success(proposalsPagesData: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSALPAGES_SUCCESS,
      proposalsPagesData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPPROPOSALPAGES_FAILURE, error };
  }
}

function getRfpProposalsByDomain(interval: number, domain: string) {
  return (dispatch: any) => {
    dispatch(request({ interval, domain }));
    rfpService.getRfpProposalsByDomain(interval, domain).then(
      (proposalsByDomainData) => {
        dispatch(success(proposalsByDomainData));
      },
      (error) => {
        if(error !== "Forbidden") {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request(interval: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSALBYDOMAIN_REQUEST,
      interval,
    };
  }
  function success(proposalsByDomainData: any) {
    return {
      type: proposalsConstants.GETRFPPROPOSALBYDOMAIN_SUCCESS,
      proposalsByDomainData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPPROPOSALBYDOMAIN_FAILURE, error };
  }
}

function getRfpByDomain() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.DOMAIN).then(
      (rfpByDomainData) => {
        dispatch(success(rfpByDomainData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYDOMAIN_REQUEST,
    };
  }
  function success(rfpByDomainData: any) {
    return {
      type: proposalsConstants.GETRFPBYDOMAIN_SUCCESS,
      rfpByDomainData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYDOMAIN_FAILURE, error };
  }
}

function getRfpByStatus() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.STATUS).then(
      (rfpByStatusData) => {
        dispatch(success(rfpByStatusData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYSTATUS_REQUEST,
    };
  }
  function success(rfpByStatusData: any) {
    return {
      type: proposalsConstants.GETRFPBYSTATUS_SUCCESS,
      rfpByStatusData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYSTATUS_FAILURE, error };
  }
}

function getRfpByType() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.TYPE).then(
      (rfpByTypeData) => {
        dispatch(success(rfpByTypeData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYTYPE_REQUEST,
    };
  }
  function success(rfpByTypeData: any) {
    return {
      type: proposalsConstants.GETRFPBYTYPE_SUCCESS,
      rfpByTypeData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYTYPE_FAILURE, error };
  }
}

function getRfpByContract() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.CONTRACT).then(
      (rfpByContractData) => {
        dispatch(success(rfpByContractData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYCONTRACT_REQUEST,
    };
  }
  function success(rfpByContractData: any) {
    return {
      type: proposalsConstants.GETRFPBYCONTRACT_SUCCESS,
      rfpByContractData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYCONTRACT_FAILURE, error };
  }
}

function getRfpByAction() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.ACTION).then(
      (rfpByActionData) => {
        dispatch(success(rfpByActionData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYACTION_REQUEST,
    };
  }
  function success(rfpByActionData: any) {
    return {
      type: proposalsConstants.GETRFPBYACTION_SUCCESS,
      rfpByActionData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYACTION_FAILURE, error };
  }
}

function getRfpBySubmission() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.SUBMISSION).then(
      (rfpBySubmissionData) => {
        dispatch(success(rfpBySubmissionData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYSUBMISSION_REQUEST,
    };
  }
  function success(rfpBySubmissionData: any) {
    return {
      type: proposalsConstants.GETRFPBYSUBMISSION_SUCCESS,
      rfpBySubmissionData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYSUBMISSION_FAILURE, error };
  }
}

function getRfpBySource() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpByAttribute(AttributeType.SOURCE).then(
      (rfpBySourceData) => {
        dispatch(success(rfpBySourceData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
        notifications.openErrorNotification(error.toString());
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYSOURCE_REQUEST,
    };
  }
  function success(rfpBySourceData: any) {
    return {
      type: proposalsConstants.GETRFPBYSOURCE_SUCCESS,
      rfpBySourceData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYSOURCE_FAILURE, error };
  }
}

function getRfpByOwner() {
  return (dispatch: any) => {
    dispatch(request());
    rfpService.getRfpProposalsByOwner().then(
      (rfpByOwnerData) => {
        dispatch(success(rfpByOwnerData));
      },
      (error) => {
        if(error !== "Forbidden") {
        dispatch(failure(error.toString()));
        notifications.openErrorNotification(error.toString());
        }
      }
    );
  };

  function request() {
    return {
      type: proposalsConstants.GETRFPBYOWNER_REQUEST,
    };
  }
  function success(rfpByOwnerData: any) {
    return {
      type: proposalsConstants.GETRFPBYOWNER_SUCCESS,
      rfpByOwnerData,
    };
  }
  function failure(error: string) {
    return { type: proposalsConstants.GETRFPBYOWNER_FAILURE, error };
  }
}
