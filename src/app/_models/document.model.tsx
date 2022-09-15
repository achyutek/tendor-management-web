export class Document {
  id: string = "";
  type: string = "";
  audit: Audit = new Audit();
  title: string = "";
  status: string = "Active";
  ownerId: string = "";
  path: string = "";
  metadata: DocumentMetadata[] = [];
  content: string = "";
  comment: string = "";
  issueDate: any = "";
  expiryDate: any = "12/31/9999";
  interval: number = 0;
  expiry: any;
  fileName: string = "";
}

export class DocumentWithDate {
  id: string = "";
  type: string = "";
  audit: Audit = new Audit();
  title: string = "";
  status: string = "Active";
  ownerId: string = "";
  path: string = "";
  metadata: DocumentMetadata[] = [];
  content: string = "";
  comment: string = "";
  issueDate: string = "";
  expiryDate: string = "";
  interval: number = 0;
  expiry: any;
  fileName: string = "";
}

export class DocumentType {
  account: string = "";
  app: string = "RFP";
  name: string = "";
  entityType: string = "";
  entityContext: string = "";
  metadata: DocumentMetadata[] = [];
  audit: Audit = new Audit();
}

export class DocumentStatus {
  account: string = "";
  app: string = "RFP";
  name: string = "";
  audit: Audit = new Audit();
}

export class DocumentMetadata {
  documentType: string = "";
  name: string = "";
  value: string = "";
  mandatory: boolean = false;
  dataType: string = "";
  webComponentType: string = "";
  webComponentSource: string = "";
}

export class Audit {
  fromZ: Date = new Date();
  thruZ: Date = new Date();
  createdBy: string = "";
  updatedBy: string = "";
}

export enum AlertType {
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

export class DocumentTemplate {
  id: string = "";
  app: string = "RFP";
  account: string = "";
  title: string = "";
  templateText: string = "";
  domain: string = "";
  subDomain: string = "";
  noOfUse: number = 0;
  version: string = "";
  audit: Audit = new Audit();
}

export class Contain {
  id: string = "";
  app: string = "RFP";
  account: string = "";
  title: string = "";
  containText: string = "";
  containCode: string = "";
  type: string = "";
  sequenceId: string = "";
  parentId: string = "";
  noOfUse: number = 0;
  version: string = "";
  audit: Audit = new Audit();
}
