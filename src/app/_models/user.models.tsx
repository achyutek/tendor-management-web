export class User {
  id: string = "";
  pwd: string = "";
  newPwd: string = "";
  authToken: string = "";
  name: string = "";
  contactNo: string = "";
  email: string = "";
  role: string = "";
  resources: string[] = [];
  app: String = "";
  appAccess: App[] = [];
  account: string = "";
  currentApp: App = new App();
  pwdType: string = "";
  roleLevel: number = 0;
  status: string="";
}

export class Role {
  app: string = "";
  name: string = "";
  resources: string[] = [];
  account: string = "";
  level: number = 0;
}

export class Resource {
  name: string = "";
  account: string = "";
  app: string = "";
}

export class App {
  app: string = "";
  role: string = "";
}

export class Account {
  name: string = "";
  type: string = "";
  status: string = "";
  app: string = "";
  parent: string = "";
  children: string[] = [];
}
