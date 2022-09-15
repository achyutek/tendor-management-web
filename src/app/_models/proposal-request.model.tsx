import { Metadata } from "./metadata.model";
import { Address } from "./address.model";

import { Comment } from "./comment.model";
import { Audit } from "./document.model";
export class ProposalRequest {
  id: string = "";
  requestId: string = "";
  source: string = "";
  title: string = "";
  agency: Entity = new Entity();
  //contacts: Entity = new Entity();
  contacts: Entity[] = [];
  type: string = "";
  domain: string = "";
  subDomain: string = "";
  contractType: string = "";
  contractDetailsUrl: string = "";
  submissionType: string = "";
  status: string = "";
  issueDate: string = "";
  dueDate: string = "";
  metadata: Metadata[] = [];
  comments: Comment[] = [];
  action: string = "";
  price: number = 0;
  complexity: string = "";
  competitionType: string = "";
  wonProposalRequest: WonProposalRequest = new WonProposalRequest();
  ownerEmail: string = "";
  ownerName: string = "";
  region: string = "";
}

export class Competitive {
  id: string = "";
  requestId: string = "";
  source: string = "";
  title: string = "";
  type: string = "";
  domain: string = "";
  agency: Entity = new Entity();
  comments: Comment[] = [];
  metadata: Metadata[] = [];
  price: number = 0;
}

export class Entity {
  name: string = "";
  title: string = "";
  email: string = "";
  contactNo: string = "";
  webSite: string = "";
  address: Address = new Address();
}

export class WonProposalRequest {
  title: string = "";
  agency: Entity = new Entity();
  contractDetailsUrl: string = "";
  comments: Comment[] = [];
  price: number = 0;
}

export class ProposalResponse {
  proposalId: string = "";
  proposalTitle: string = "";
  region:string="";
  domain: string = "";
  subDomain: string = "";
  order: number = 0;
  content: ResponseContent[] = [];
  audit: Audit = new Audit();
}

export class ResponseContent {
  id: number = 0;
  parentId: number = 0;
  order: number = 1;
  region:string = "";
  domain: string = "";
  subDomain: string = "";
  question: string = "";
  answer: string = "";
  number: string = "";
  proposals: ProposalResponse[] = [];
  audit: Audit = new Audit();
  status: string = "";
  count: number = 0;
}

export class RfpTarget {
  id: string = "";
  value: Object[] = [];
  comment: string = "";
}
