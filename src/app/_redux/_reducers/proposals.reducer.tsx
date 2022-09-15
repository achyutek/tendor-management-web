import initialState from "../initialState";
import { proposalsConstants } from "../_constants/proposals.constants";

export function getProposals(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPPROPOSAL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPPROPOSAL_SUCCESS:
      return {
        ...state,
        proposalsData: action.proposalsData,
      };
    case proposalsConstants.GETRFPPROPOSAL_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getProposalsPages(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPPROPOSALPAGES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPPROPOSALPAGES_SUCCESS:
      return {
        ...state,
        proposalsPagesData: action.proposalsPagesData,
      };
    case proposalsConstants.GETRFPPROPOSALPAGES_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getProposalsByDomain(
  state = initialState.proposals,
  action: any
) {
  switch (action.type) {
    case proposalsConstants.GETRFPPROPOSALBYDOMAIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPPROPOSALBYDOMAIN_SUCCESS:
      return {
        ...state,
        proposalsByDomainData: action.proposalsByDomainData,
      };
    case proposalsConstants.GETRFPPROPOSALBYDOMAIN_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByDomain(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYDOMAIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYDOMAIN_SUCCESS:
      return {
        ...state,
        rfpByDomainData: action.rfpByDomainData,
      };
    case proposalsConstants.GETRFPBYDOMAIN_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByStatus(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYSTATUS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYSTATUS_SUCCESS:
      return {
        ...state,
        rfpByStatusData: action.rfpByStatusData,
      };
    case proposalsConstants.GETRFPBYSTATUS_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByType(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYTYPE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYTYPE_SUCCESS:
      return {
        ...state,
        rfpByTypeData: action.rfpByTypeData,
      };
    case proposalsConstants.GETRFPBYTYPE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByContract(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYCONTRACT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYCONTRACT_SUCCESS:
      return {
        ...state,
        rfpByContractData: action.rfpByContractData,
      };
    case proposalsConstants.GETRFPBYCONTRACT_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByAction(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYACTION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYACTION_SUCCESS:
      return {
        ...state,
        rfpByActionData: action.rfpByActionData,
      };
    case proposalsConstants.GETRFPBYACTION_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpBySumission(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYSUBMISSION_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYSUBMISSION_SUCCESS:
      return {
        ...state,
        rfpBySubmissionData: action.rfpBySubmissionData,
      };
    case proposalsConstants.GETRFPBYSUBMISSION_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpBySource(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYSOURCE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYSOURCE_SUCCESS:
      return {
        ...state,
        rfpBySourceData: action.rfpBySourceData,
      };
    case proposalsConstants.GETRFPBYSOURCE_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByOwner(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYOWNER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYOWNER_SUCCESS:
      return {
        ...state,
        rfpByOwnerData: action.rfpByOwnerData,
      };
    case proposalsConstants.GETRFPBYOWNER_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

export function getRfpByCountry(state = initialState.proposals, action: any) {
  switch (action.type) {
    case proposalsConstants.GETRFPBYCOUNTRY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case proposalsConstants.GETRFPBYCOUNTRY_SUCCESS:
      return {
        ...state,
        rfpByCountryrData: action.rfpByCountryrData,
      };
    case proposalsConstants.GETRFPBYCOUNTRY_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
