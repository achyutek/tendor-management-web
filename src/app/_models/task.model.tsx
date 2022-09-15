export class UserTask {
  processInstanceId: number = 0;
  id: number = 0;
  name: string = "";
  description: string = "";
  priority: string = "";
  type: string = "";
  assigneeId: string = "";
  assigneeName: string = "";
  activationDate: any = "";
  dueDate: any = "";
  comments: string[] = [];
  status: string = "";
  formUrl: string = "";
  url: string = "https://rfp.softsages.com/tasks";
  process: string = "";
  businessKey: string = "";
  data: TaskData[] = [];
  reminder: TaskReminder = new TaskReminder();
  audit: Audit = new Audit();
  defId: string = "";
  docUrl: string = "";
}

export class TaskProcessInstance {
  id: string = "";
  process: string = "";
  businessKey: string = "";
  status: string = "";
  audit: Audit = new Audit();
}

export class TaskReminder {
  enabled: string = "N";
  repeatCycle: number = 1;
  repeatFrequency: number = 24;
}

export class TaskData {
  name: string = "";
  value: string = "";
}

export class TaskDef {
  id: string = "";
  prviousTaskId: string = "";
  nextTaskId: string = "";
  name: string = "";
  description: string = "";
  priority: string = "High";
  type: string = "Manual";
  process: string = "";
  dueDays: string = "";
  formUrl: string = "https://rfp.softsages.com/#/rfp/details?pageMode=view&id=";
  assigneeExpression: string = "";
  assigneeExpressionType: string = "Payload";
  order: string = "";
  audit: Audit = new Audit();
  assigneeId: string = "";
  assigneeName: string = "";
  reminder: TaskReminder = new TaskReminder();
}

export class Audit {
  fromZ: Date = new Date();
  thruZ: Date = new Date();
  createdBy: string = "";
  updatedBy: string = "";
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export class TaskType {
  process: string = "";
  name: string = "";
  audit: Audit = new Audit();
}

export class ProcessDef {
  id: string = "";
  name: string = "";
  audit: Audit = new Audit();
  tasks: TaskDef[] = [];
  bpmnFile: string = "";
  taskUrl: string = "https://rfp.softsages.com/#/task";
}
