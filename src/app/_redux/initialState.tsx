import { User } from "../_models";

let current_user = localStorage.getItem("current_user");
let user;
if (current_user) {
  user = JSON.parse(current_user);
}

const loggedInUser = user
  ? { loggedIn: true, user, loading: false }
  : { loggedIn: false, user: {}, loading: false };

let initialState = {
  user: {
    loading: false,
    error: "",
    verifyTempPassword: new User(),
    updateUserPwd: new User(),
    resetUser: new User(),
  },
  auth: {
    ...loggedInUser,
  },
  proposals: {
    proposalsData: [],
    proposalsPagesData: [],
    proposalsByDomainData: [],
    rfpByDomainData: [],
    rfpByStatusData: [],
    rfpByTypeData: [],
    rfpByContractData: [],
    rfpByActionData: [],
    rfpBySubmissionData: [],
    rfpBySourceData: [],
    rfpByOwnerData: [],
    rfpByCountryrData: [],
  },
  openTask: {
    RfpOpenTaskData: [],
  },
  filters: {
    domain: "All",
    action: "All",
    submissionType:"All",
    type: "All",
    status:"All",
    contractType : "All",
    context:"created",
    interval:"-1",
    pageNumber :1,
    region: "All",
    past:-1
  },
};

export default initialState;
