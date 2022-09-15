import React, { Component, useCallback } from "react";
import "antd/dist/antd.css";
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Select,
  Tabs,
  Modal,
  Form,
  Space,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { rfpService } from "../../services/rfp-service";
import { Table1 } from "../../component/table";
import UploadComponent from "../../component/UploadComponent";
import DailogComponent from "../../component/DailogComponent";
import { ProposalRequest } from "../../_models/proposal-request.model";
import { Comment } from "../../_models/comment.model";
import { Document } from "../../_models/document.model";
import moment from "moment";
import { userService } from "../../services";
import { UserTask } from "../../_models/task.model";
import { notifications } from "../../_helpers/notifications";
import { MessageProp } from "../../_globals/constants/message.constants";
import { proposalsAction } from "../../_redux/_actions";
import { baseService } from "../../services";
import { connect } from "react-redux";
import { User } from "../../_globals/components";
import { values } from "lodash";
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { TextArea } = Input;
const qs = require("query-string");

export class Tasks extends Component<any, any> {
  convert = (stringDate: any) => {
    var date = stringDate,
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("/");
  };

  disabledDate = (currentDate: any, dueDate: any) => {
    // Can not select days before today and today
    return dueDate && dueDate < currentDate.startOf("day");
  };

  Pars = qs.parse(window.location.search);
  currentPage = 1;
  format = "MM/DD/YYYY";
  id = "";
  loadingCompleteTask = false;
  columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "id",
      title: "RFP Title",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length) {
          name = record.data[0].value;
        }
        return (
          <>
            <a
              style={{ color: "#13b4ca" }}
              href={record.formUrl}
              target="_blank"
            >
              <b>{name}</b>
            </a>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Agency Name",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length == 3) {
          name = record.data[2].value;
        }
        return (
          <>
            {name == "" ? (
              ""
            ) : (
              <a
                style={{ color: "#13b4ca" }}
                href={record.formUrl}
                target="_blank"
              >
                <b>{name}</b>
              </a>
            )}
          </>
        );
      },
    },
    {
      key: "id",
      title: "RFP Due Date",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length) {
          name = record.data[1].value;
        }
        return (
          <>
            <a
              style={{ color: "#13b4ca" }}
              href={record.formUrl}
              target="_blank"
            >
              <b>{name}</b>
            </a>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Assigned To",
      dataIndex: "assigneeName",
    },

    {
      key: "id",
      title: "Due By",
      dataIndex: "dueDate",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    // },
    {
      key: "id",
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => {
        return (
          <button
            className="ant-btn ant-btn-primary task-complete"
            onClick={() => {
              this.complete(record);
            }}
          >
            {" "}
            Complete{" "}
          </button>
        );
      },
    },
  ];

  columnsRoleAdmin = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "id",
      title: "RFP Title",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length) {
          name = record.data[0].value;
        }
        return (
          <>
            <a
              style={{ color: "#13b4ca" }}
              href={record.formUrl}
              target="_blank"
            >
              <b>{name}</b>
            </a>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Agency Name",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length == 3) {
          name = record.data[2].value;
        }
        return (
          <>
            {name == "" ? (
              ""
            ) : (
              <a
                style={{ color: "#13b4ca" }}
                href={record.formUrl}
                target="_blank"
              >
                <b>{name}</b>
              </a>
            )}
          </>
        );
      },
    },
    {
      key: "id",
      title: "RFP Due Date",
      render: (text: any, record: any) => {
        let name = "";
        if (Array.isArray(record.data) && record.data.length) {
          name = record.data[1].value;
        }
        return (
          <>
            <a
              style={{ color: "#13b4ca" }}
              href={record.formUrl}
              target="_blank"
            >
              <b>{name}</b>
            </a>
          </>
        );
      },
    },
    {
      key: "id",
      title: "Assigned To",
      render: (text: any, record: any) => (
        <Select
          style={{ width: 150 }}
          placeholder={record.assigneeName}
          onChange={this.ownerNameChangeConfirm.bind(this, record)}
          value={record.assigneeName}
        >
          {this.props.rfpByOwnerData.map((data: any) => {
            return <Option value={data.name}>{data.name}</Option>;
          })}
        </Select>
      ),
    },

    {
      key: "id",
      title: "Due By",
      dataIndex: "duedate",
      render: (text: any, record: any) => {
        const dateFormat = "YYYY/MM/DD";
        let name = "";
        if (Array.isArray(record.data) && record.data.length) {
          name = record.data[1].value;
        }
        return (
          <DatePicker
            allowClear={false}
            value={moment(record.dueDate, this.format)}
            disabledDate={(currentDate) => {
              return currentDate && currentDate > moment(name, "MM-DD-YYYY");
            }}
            onChange={this.OnchnageHandlerConfirm.bind(this, record)}
            format={this.format}
          />
        );
      },
    },
    {
      key: "id",
      title: "Action",
      dataIndex: "action",
      render: (text: any, record: any) => {
        return (
          <button
            className="ant-btn ant-btn-primary task-complete"
            onClick={() => {
              this.complete(record);
            }}
          >
            {" "}
            Complete{" "}
          </button>
        );
      },
    },
  ];

  ownerNameChangeConfirm = async (record: any, event: any) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure you want to change assignee?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        this.ownerNameChange(record, event);
      },
      onCancel: () => {
        this.closeModal();
      },
    });
  };

  OnchnageHandlerConfirm = async (record: any, event: any) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure you want to change due date?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        this.onDueDateChange(record, event);
      },
      onCancel: () => {
        this.closeModal();
      },
    });
  };

  ownerNameChange = async (record: any, event: any) => {
    this.setState({ loading: true });
    let user = this.props.rfpByOwnerData.find((x: any) => x.name == event);
    record.assigneeId = user?.email;
    record.assigneeName = user?.name;

    await rfpService
      .assignTask(record)
      .then(async (response) => {
        await this.getOpenTask(this.currentPage);
        await this.getMyTask(this.currentPage);
        notifications.openSuccessNotification(
          "Task has been assigned successfully"
        );
      })
      .catch(notifications.openErrorNotification);
  };

  onDueDateChange = async (record: any, event: any) => {
    this.setState({ loading: true });
    record.dueDate = this.convert(event._d);
    await rfpService
      .changeDueDate(record)
      .then(async (response) => {
        await this.getOpenTask(this.currentPage);
        await this.getMyTask(this.currentPage);
        notifications.openSuccessNotification(
          "Due Date has been updated successfully"
        );
      })
      .catch((err) => console.log(err));
  };

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    proposalsTaskeData: "",
    RfpTaskCount: "",
    RfpTaskOpenCount: "",
    proposalsMyTaskeData: "",
    current: 0,
    activeKey: "",
    setIsModalVisible: false,
    visible: false,
    title: "",
    content: "",
    request: new ProposalRequest(),
    userTask: new UserTask(),
    comment: new Comment(),
    documentData: new Document(),
    completeTaskData: new UserTask(),
    loadingMyTask: false,
    loadingOpenTask: false,
    isManager: false,
    isTableAccess: false,
    accessColumn: "",
    tasks: true,
    myTasks: false,
    selectedData: "",
    openWarningModel: false,
    setDecisionStatus: false,
    updateStatusContent: "",
    actionStatus: "",
  };

  start = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  fileUploadCallback1 = (response: any) => {
    this.state.documentData.ownerId = this.state.completeTaskData.businessKey;
    this.state.documentData.type = "Project Info";
    this.state.documentData.path = response.path;
    this.state.documentData.fileName = response.path.substring(
      this.state.completeTaskData.businessKey.length + 1
    );
  };

  setActionStaus = (event: any) => {
    this.setState({ actionStatus: event });
  };

  complete = async (record: any) => {
    const { user } = this.props;
    this.setState({
      completeTaskData: record,
    });
    if (
      user.role !== "SecurityBidDecisionMaker" &&
      user.role !== "StaffingBidDecisionMaker" &&
      user.role !== "TechBidDecisionMaker"
    ) {
      let content = (
        <>
          <Form name="basic" onFinish={this.completeTask} scrollToFirstError>
            <Form.Item label={<span> Comments</span>} name={["text"]}>
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label={<span> File</span>} name={["text"]}>
              <span className="upload-file-01">File Choose... </span>
              <UploadComponent
                ownerId={record.businessKey}
                getType={() => {
                  let type = "Project Info";
                  this.state.documentData.type = type;
                  return this.state.documentData;
                }}
                callback={this.fileUploadCallback1}
              ></UploadComponent>
              <span className="upload-file-02">
                <UploadOutlined />
              </span>
            </Form.Item>
            <Button
              className="ant-btn ant-btn-primary model-task-btn"
              type="primary"
              htmlType="submit"
              loading={this.loadingCompleteTask}
            >
              Complete
            </Button>
          </Form>
        </>
      );
      this.setState({ visible: true, content, title: "Complete Task" });
    } else {
      var status = await rfpService.checkActionStatus(record.businessKey);
      if (!status) {
        let content = (
          <>
            <Form name="basic" onFinish={this.completeTask} scrollToFirstError>
              <Form.Item label={<span> Comments</span>} name={["text"]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label={<span> File</span>} name={["text"]}>
                <span className="upload-file-01">File Choose... </span>
                <UploadComponent
                  ownerId={record.businessKey}
                  getType={() => {
                    let type = "Project Info";
                    this.state.documentData.type = type;
                    return this.state.documentData;
                  }}
                  callback={this.fileUploadCallback1}
                ></UploadComponent>
                <span className="upload-file-02">
                  <UploadOutlined />
                </span>
              </Form.Item>
              <Button
                className="ant-btn ant-btn-primary model-task-btn"
                type="primary"
                htmlType="submit"
                loading={this.loadingCompleteTask}
              >
                Complete
              </Button>
            </Form>
          </>
        );
        this.setState({ visible: true, content, title: "Complete Task" });
      } else {
        let content = (
          <>
            <Form name="basic" onFinish={this.completeTask1} scrollToFirstError>
              <Form.Item label={<span> Comments</span>} name={["text"]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label={<span> File</span>} name={["text"]}>
                <span className="upload-file-01">File Choose... </span>
                <UploadComponent
                  ownerId={record.businessKey}
                  getType={() => {
                    let type = "Project Info";
                    this.state.documentData.type = type;
                    return this.state.documentData;
                  }}
                  callback={this.fileUploadCallback1}
                ></UploadComponent>
                <span className="upload-file-02">
                  <UploadOutlined />
                </span>
              </Form.Item>
              
              <Form.Item
                label={<span> Select Decision</span>}
              >
                <div style={{ width: "100%", borderStyle: "groove" }}>
                  <Select placeholder="Select Decision"
                    // value={this.state.actionStatus}
                    onChange={this.setActionStaus}
                  >
                    <Option value="Yes">Yes</Option>
                    <Option value="No">No</Option>
                  </Select>
                  
                </div>
              </Form.Item>
              
              <Button
                className="ant-btn ant-btn-primary model-task-btn"
                type="primary"
                htmlType="submit"
                loading={this.loadingCompleteTask}
              >
                Complete
              </Button>
            </Form>
          </>
        );
        this.setState({ visible: true, content, title: "Complete Task" });
      }
    }
  };

  completeTask = async (value: any) => {
    this.setState({ loading: true });
    this.loadingCompleteTask = true;
    if (value.text != "" && value.text != undefined)
      this.state.completeTaskData.comments.push(value.text);
    this.state.completeTaskData.docUrl = this.state.userTask.docUrl;
    this.state.userTask = this.state.completeTaskData;
    this.state.userTask.url = baseService.getBaseUrl() + "/tasks";
    await this.completeTaskData(value);
  };

  completeTask1 = async (value: any) => {
    this.setState({ loading: true });
    this.loadingCompleteTask = true;
    if (this.state.actionStatus !== "") {
      await rfpService
        .updateActionStatus(
          this.state.completeTaskData.businessKey,
          this.state.actionStatus
        )
        .then(async (response) => {
          if (value.text != "" && value.text != undefined)
            this.state.completeTaskData.comments.push(value.text);
          this.state.completeTaskData.docUrl = this.state.userTask.docUrl;
          this.state.userTask = this.state.completeTaskData;
          this.state.userTask.url = baseService.getBaseUrl() + "/tasks";
          await this.completeTaskData(value);
        })
        .catch(notifications.openErrorNotification);
    } else {
      notifications.openErrorNotification("Please select decision");
      this.setState({ loading: false,mandatoryErr:true });
      this.loadingCompleteTask = false;
    }
  };


  completeTaskData = async (value: any) => {
    let flag = false;
    if (
      this.state.documentData.path !== undefined &&
      this.state.documentData.path !== ""
    ) {
      this.state.userTask.docUrl =
        baseService.getBaseUrl() +
        "/viewproposal?pageMode=view&id=" +
        this.state.userTask.businessKey;
      flag = true;
    }
    this.state.documentData.title = this.state.documentData.fileName.substring(
      0,
      this.state.documentData.fileName.lastIndexOf(".")
    );

    await rfpService
      .TaskComplete(this.state.userTask)
      .then(async (response) => {
        if (response !== undefined && flag) {
          await rfpService
            .addDocument(this.state.documentData)
            .then()
            .catch(notifications.openErrorNotification);
        }
        if (value.text != "" && value.text != undefined)
          await this.updateProposalRequest(value.text);
        this.loadingCompleteTask = false;
        this.setState({ loading: false });
        notifications.openSuccessNotification(
          MessageProp.getCompletedSuccessMessage("Complete Task")
        );
        this.closeModal();
        this.getMyTask(this.currentPage);
      })
      .catch(notifications.openErrorNotification);
  };
  async updateProposalRequest(text: string) {
    let comment = new Comment();
    comment.text = text;
    comment.createdBy = User.getLoggedInUserEmailId();
    var today = new Date();
    var month: any = today.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var date: any = today.getDate();
    if (date < 10) {
      date = "0" + date;
    }
    var year = today.getFullYear();
    var fullDate = month + "/" + date + "/" + year;
    var hour: any = today.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    var min: any = today.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    var sec: any = today.getSeconds();
    if (sec < 10) {
      sec = "0" + sec;
    }
    var time = hour + ":" + min + ":" + sec;
    comment.fromDate = fullDate + " " + time;

    let request = await rfpService
      .getProposalRequest(this.state.userTask.businessKey)
      .then()
      .catch(notifications.openErrorNotification);
    if (request) {
      request.comments.push(comment);
      await rfpService
        .updateProposalRequest(request)
        .then()
        .catch(notifications.openErrorNotification);
    }
  }

  callData = (pageNumber: any) => {
    this.currentPage = pageNumber;
    this.props.getRfpTaskOpen(pageNumber);
  };
  componentDidMount = async () => {
    document.title = "RFP Task";
    await this.setTableAccess();
    await this.checkRole();
    this.setAccess();
    let { action } = this.Pars;
    if (action !== undefined) {
      this.setState({
        activeKey: "open",
        loadingOpenTask: true,
      });
    } else {
      this.setState({
        activeKey: "my",
        loadingMyTask: true,
      });
    }
    await this.getMyTask(this.currentPage);
    if (this.state.isManager) await this.getOpenTask(this.currentPage);

    this.props.getRfpByOwner();

    rfpService
      .getRfpTask()
      .then((response) => {
        this.setState({
          RfpTaskCount: response,
        });
      })
      .catch(notifications.openErrorNotification);

    rfpService
      .getRfpTaskOpen()
      .then((response) => {
        this.setState({
          RfpTaskOpenCount: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };

  handlePageChange = async (pageNumber: number) => {
    this.currentPage = pageNumber;
    await this.getOpenTask(pageNumber);
  };

  getOpenTask = async (pageNumber: number) => {
    this.setState({ loadingOpenTask: true });
    this.setState({
      proposalsTaskeData: await rfpService
        .getOpenTasks(pageNumber)
        .then()
        .catch(notifications.openErrorNotification),
      loadingOpenTask: false,
    });
  };
  getMyTask = async (pageNumber: number) => {
    this.setState({ loadingMyTask: true });
    this.setState({
      proposalsMyTaskeData: await rfpService
        .getMyTasks(pageNumber)
        .then()
        .catch(notifications.openErrorNotification),
      loadingMyTask: false,
    });
  };

  searchMyTasks = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      this.getMyTask(this.currentPage);
    }
    if (val != undefined && val.trim().length > 3) {
      let inte = "-1";
      let response = await rfpService
        .searchMyTasks(val.trim(), inte)
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        proposalsMyTaskeData: response,
      });
    }
  };

  searchData = async (event: any) => {
    let val = event.target.value;
    if (val === "") {
      this.getOpenTask(this.currentPage);
    } else if (val != undefined && val.trim().length > 3) {
      let inte = "-1";
      let response = await rfpService
        .searchTasks(val.trim(), inte)
        .then()
        .catch(notifications.openErrorNotification);
      this.setState({
        serachTable: true,
        proposalsTaskeData: response,
      });
    }
  };

  setAccess = () => {
    const { user } = this.props;
    if (
      user.role &&
      (user.role === "Admin" ||
        user.role === "Super Admin" ||
        user.role === "Manager")
    ) {
      this.setState({
        isManager: true,
      });
    }
  };

  setTableAccess = () => {
    const { user } = this.props;
    if (
      user.role &&
      (user.role === "Admin" ||
        user.role === "Super Admin" ||
        user.role == "Manager")
    ) {
      this.setState({
        isTableAccess: true,
      });
    }
  };

  checkRole = async () => {
    if (this.state.isTableAccess === true) {
      await this.setState({
        accessColumn: "columnsRoleAdmin",
      });
    } else {
      await this.setState({
        accessColumn: "columns",
      });
    }
  };

  onChange = (activeKey: string) => {
    this.setState({ activeKey });
    if (activeKey === "my") {
      this.getMyTask(1);
      this.setState({
        tasks: true,
        myTasks: false,
      });
    } else {
      this.getOpenTask(1);
      this.setState({
        tasks: false,
        myTasks: true,
      });
    }
  };

  hideModal = () => {
    this.setState({
      openWarningModel: false,
    });
  };

  closeModal = () => {
    this.setState({ visible: false });
    this.setState({ setDecisionStatus: false, actionStatus: "" });
  };
  closeDecisionStatusModel = () => {
    this.setState({ setDecisionStatus: false, actionStatus: "" });
  };
  render() {
    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          footer={null}
          confirmLoading={this.loadingCompleteTask}
          loading={this.state.loading}
        ></DailogComponent>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper space-title">
              <Row gutter={24} className="headeing-padding">
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 12 }}
                >
                  <Row gutter={24}>
                    <Col
                      hidden={this.state.tasks}
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 12 }}
                    >
                      <div
                        className={
                          this.state.isManager
                            ? "search-box  search-box-01"
                            : "search-box"
                        }
                      >
                        <Search
                          id="rc_search_MyTask"
                          placeholder="Search for Name,Descripation and Assigned To"
                          allowClear
                          className={
                            this.state.isManager ? "search" : "search-01"
                          }
                          onChange={this.searchData}
                        />
                      </div>
                    </Col>
                    <Col
                      hidden={this.state.myTasks}
                      xs={{ span: 24 }}
                      sm={{ span: 24 }}
                      md={{ span: 24 }}
                      lg={{ span: 12 }}
                    >
                      <div
                        className={
                          this.state.isManager
                            ? "search-box  search-box-01"
                            : "search-box"
                        }
                      >
                        <Search
                          placeholder="Search for Name,Descripation and Assigned To"
                          allowClear
                          className={
                            this.state.isManager ? "search" : "search-01"
                          }
                          onChange={this.searchMyTasks}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            {this.state.isManager ? (
              <Tabs
                defaultActiveKey={this.state.activeKey}
                onChange={this.onChange}
                activeKey={this.state.activeKey}
                className="none-padding tab-border"
              >
                <TabPane tab="My Tasks" key="my">
                  {this.state.accessColumn === "columns" ? (
                    <Table1
                      data={this.state.proposalsMyTaskeData}
                      columns={this.columns}
                      handlePageChange={this.handlePageChange}
                      currentPage={this.currentPage}
                      totalPages={this.state.RfpTaskCount}
                      loading={this.state.loadingMyTask}
                    />
                  ) : (
                    <Table1
                      data={this.state.proposalsMyTaskeData}
                      columns={this.columnsRoleAdmin}
                      handlePageChange={this.handlePageChange}
                      currentPage={this.currentPage}
                      totalPages={this.state.RfpTaskCount}
                      loading={this.state.loadingMyTask}
                    />
                  )}
                </TabPane>

                <TabPane tab="Open Tasks" key="open">
                  {this.state.accessColumn === "columns" ? (
                    <Table1
                      data={this.state.proposalsTaskeData}
                      columns={this.columns}
                      handlePageChange={this.handlePageChange}
                      currentPage={this.currentPage}
                      totalPages={this.state.RfpTaskOpenCount}
                      loading={this.state.loadingOpenTask}
                    />
                  ) : (
                    <Table1
                      data={this.state.proposalsTaskeData}
                      columns={this.columnsRoleAdmin}
                      handlePageChange={this.handlePageChange}
                      currentPage={this.currentPage}
                      totalPages={this.state.RfpTaskOpenCount}
                      loading={this.state.loadingOpenTask}
                    />
                  )}
                </TabPane>
              </Tabs>
            ) : this.state.accessColumn === "columns" ? (
              <Table1
                data={this.state.proposalsMyTaskeData}
                columns={this.columns}
                handlePageChange={this.handlePageChange}
                currentPage={this.currentPage}
                totalPages={this.state.RfpTaskCount}
                loading={this.state.loadingMyTask}
              />
            ) : (
              <Table1
                data={this.state.proposalsMyTaskeData}
                columns={this.columnsRoleAdmin}
                handlePageChange={this.handlePageChange}
                currentPage={this.currentPage}
                totalPages={this.state.RfpTaskCount}
                loading={this.state.loadingMyTask}
              />
            )}
          </Col>
        </Row>
        <Modal
          title="Task Comments"
          visible={this.state.setIsModalVisible}
          onOk={this.complete}
        >
          <Form.Item
            label={<span> Comments</span>}
            name={["request", "contacts", "webSite"]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <UploadComponent />
          <button className="ant-btn ant-btn-primary model-task-btn">
            {" "}
            Complete
          </button>
        </Modal>
        <Modal
          title="Update Decision"
          visible={this.state.setDecisionStatus}
          centered
          destroyOnClose={true}
          maskClosable={false}
          onCancel={this.closeDecisionStatusModel}
        >
          {this.state.updateStatusContent}
        </Modal>
      </>
    );
  }
}

function mapState(state: any) {
  const { getRfpByOwner } = state;
  const { rfpByOwnerData } = getRfpByOwner;
  const { authentication } = state;
  const { user } = authentication;
  return {
    rfpByOwnerData,
    user,
  };
}
const actionCreators = {
  getRfpByOwner: proposalsAction.getRfpByOwner,
};

export default connect(mapState, actionCreators)(Tasks);
