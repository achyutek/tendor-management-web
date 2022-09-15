import { combineReducers } from "redux";
import { authentication } from "./authentication.reducer";
import {
  getProposals,
  getProposalsPages,
  getProposalsByDomain,
  getRfpByDomain,
  getRfpByStatus,
  getRfpByType,
  getRfpByContract,
  getRfpByAction,
  getRfpBySumission,
  getRfpBySource,
  getRfpByOwner,
  getRfpByCountry,
} from "./proposals.reducer";
import { getRfpTaskOpen } from "./task.reducer";
import {filterReducer} from "./filter.reducer";
const rootReducer = combineReducers({
  authentication,
  getProposals,
  getProposalsPages,
  getProposalsByDomain,
  getRfpByDomain,
  getRfpByStatus,
  getRfpByType,
  getRfpByContract,
  getRfpByAction,
  getRfpBySumission,
  getRfpBySource,
  getRfpByOwner,
  getRfpByCountry,
  getRfpTaskOpen,
  filterReducer
});

export default rootReducer;
