import React, { Component } from "react";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  PageHeader,
  Tabs,
  Descriptions,
  Form,
  Input,
  DatePicker,
  AutoComplete,
  Select,
  Spin,
  Modal,
  Pagination,
  Tooltip,
  InputNumber,
  Popover,
} from "antd";
import { connect } from "react-redux";
import {
  FormOutlined,
  FileProtectOutlined,
  DoubleLeftOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  MinusOutlined,
  PlusOutlined,
  DeleteFilled,
  AliwangwangOutlined,
  DownloadOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Table1 } from "../../component/table";
// import { AlloyEditor } from "@types/alloyeditor";
import { rfpService } from "../../services/rfp-service";
import PreviewDocument from "../../component/PreviewDocument";
import DownloadComponent from "../../component/DownloadComponent";
import { Document, DocumentWithDate } from "../../_models/document.model";
import DailogComponent from "../../component/DailogComponent";
import UploadComponent from "../../component/UploadComponent";
import { proposalsAction } from "../../_redux/_actions";
import { saveAs as importedSaveAs } from "file-saver";
import phone from "../../../assets/images/phone.png";
import globe from "../../../assets/images/globe.png";
import noDataFound from "../../../assets/images/no-datafound.png";
import envolope from "../../../assets/images/envolope.png";
import { MessageProp } from "../../_globals/constants/message.constants";
import { notifications } from "../../_helpers/notifications";
import moment from "moment";
import { ProposalRequest, ProposalResponse } from "../../_models";
import { Comment } from "../../_models/comment.model";
// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditorComponent from "react-froala-wysiwyg";
import CountriesComponent from "../../component/CountriesComponent";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

// Import a single Froala Editor plugin.
import "froala-editor/js/plugins/align.min.js";

// Import a language file.
import "froala-editor/js/languages/de.js";

// Import a third-party plugin.
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/third_party/embedly.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";

// ES Modules

import { UserTask } from "../../_models/task.model";
import history from "../../_helpers/history";
import { User } from "../../_globals/components";
import { baseService } from "../../services";

import { SnippetsOutlined } from "@ant-design/icons";
const Option = Select.Option;
const qs = require("query-string");
const { TextArea } = Input;

const { TabPane } = Tabs;
const pageSize = 1;

const columnsDocument = [
  {
    key: "id",
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Action",
    render: (record: any, text: any) => {
      return (
        <Row>
          <PreviewDocument
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></PreviewDocument>{" "}
          &nbsp;
          <DownloadComponent
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></DownloadComponent>
        </Row>
      );
    },
  },
];

const columnsAgrementDocument = [
  {
    key: "id",
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Type",
    dataIndex: "type",
  },
  {
    title: "Start Date",
    dataIndex: "issueDate"
  },
  {
    title: "End Date",
    dataIndex: "expiryDate"
  },
  {
    title: "Action",
    render: (record: any, text: any) => {
      return (
        <Row>
          <PreviewDocument
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></PreviewDocument>{" "}
          &nbsp;
          <DownloadComponent
            fileStoragePath={record.path}
            app="RFP"
            status={record.status}
          ></DownloadComponent>
        </Row>
      );
    },
  },
];

const validateMessages = {
  required: "${label}  is required!",
};

export class Viewproposal extends Component<any, any> {
  currentPage = 1;
  format = "MM/DD/YYYY";
  Pars = qs.parse(window.location.search);
  documentsFormRef: any = React.createRef();
  docDis = false;

  columnsComment = [
    {
      key: "fromDate",
      title: "Date",
      dataIndex: "fromDate",
    },
    {
      title: "Text",
      dataIndex: "text",
      width: "50%",
      render: (record: any, text: any) => {
        return (
          <div>
            <Tooltip title="View whole text">
              <span
                onClick={() => this.copyCodeToClipboard(record)}
                className="icon proposal-contact-01"
              >
                <a className="proposal-contact">
                  <SnippetsOutlined />
                </a>
              </span>
              &nbsp;&nbsp;
              {record?.length > 100
                ? record?.substring(0, 100) + "..."
                : record}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
    },
  ];

  columns = [
    {
      key: "id",
      title: "Title",
      dataIndex: "question",
    },
    {
      title: "Content",

      render: (record: any, text: any) => {
        return <span dangerouslySetInnerHTML={{ __html: record.answer }} />;
      },
    },
    {
      title: "Document Order",

      render: (text: any, record: any) => (
        <>
          {" "}
          <Input
            className="number-position bgColor"
            type="number"
            onChange={this.onValueChnage.bind(this, record)}
            value={record.order}
          />
          {/* <div id="inc-button" className="spinner-button">
            +
          </div>
          <div id="dec-button" className="spinner-button">
            -
          </div> */}
        </>
      ),
    },
  ];
  refForm: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      proposalsData: "",
      proposalsResponseData: "",
      proposalsDocumentData: "",
      proposalsDocumenPrivewtData: "",
      proposalsDocumentDownloadData: "",
      visible: false,
      title: "",
      content: "",
      userTask: new UserTask(),
      tabKey: "1",
      existingContent: "",
      responseContent: new ProposalResponse(),
      responseContents: new ProposalResponse(),
      proposalResponse: new ProposalResponse(),
      documents: [],
      existingContents: [],
      blob: "",
      request: new ProposalRequest(),
      document: new Document(),
      documentData: new Document(),
      id: "",
      loading: true,
      comment: new Comment(),
      comments: {},
      commentList: [],
      loadingForView: true,
      loadingForDailog: false,
      selectedRow: [],
      pagenumber: 1,
      assigneId: "",
      record: {},
      allowEdit: true,
      wonProposalFormEdit: true,
      wonProposalFormView: false,
      createNewWonProposal: false,
      readOnly: false,
      totalPage: 0,
      current: 1,
      minIndex: 0,
      maxIndex: 0,
      popup: false,
      popupphone: false,
      createdBy: "",
      rfpCreatedBy: "",
      data:{}
    };
  }

  handleVisibleChange = (popup: any) => {
    this.setState({ popup });
  };

  handleVisiblePhoneChange = (popupphone: any) => {
    this.setState({ popupphone });
  };

  copyCodeToClipboard = (record: any) => {
    let content = record;
    this.setState({ visible: true, content, title: "Text" });
  };

  handleChange = (page: any) => {
    this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize,
    });
  };
  handlePageChange = (pageNumber: any) => {
    this.callData(pageNumber);
  };

  callData = (pageNumber: any) => {
    this.currentPage = pageNumber;
    this.props.getRfpProposals(-1, pageNumber);
  };

  componentDidMount = async () => {
    document.title = "Proposals";
    // const parsed = qs.parse(window.location.search);
    let { id } = this.Pars;
    this.setAccess();
    this.setState({
      tabKey: 1,
      id: id,
    });
    await this.getProposalRequest(id);
    this.props.getRfpByOwner();

  };


  getProposalRequest(id: string) {
    rfpService
      .getProposalRequest(id)
      .then((response) => {
        let maxValuecontactList = response.contacts.length;
        this.setState({
          proposalsData: response,
          createdBy: response.audit.createdBy,
          loadingForView: false,
          totalPage: maxValuecontactList / pageSize,
          minIndex: 0,
          maxIndex: pageSize,
          pagenumber: maxValuecontactList,
        }, () => {
          this.getCreatedNameBy();
        });
      })
      .catch((error) => {
        notifications.openErrorNotification(error);
        this.setState({ loadingForView: false });
        history.goBack();
      });
  }
  getCreatedNameBy = async () => {
    this.setState({
      rfpCreatedBy: await this.props.rfpByOwnerData.map((user: any) => {
        if (this.state.createdBy === user.email) {
          return user.name
        }
      })
    })
  }

  componentDidCatch(error: any, info: any) {
    notifications.openErrorNotification(error);
  }

  closeModal = () => {
    this.setState({ visible: false });
  };

  setAccess = () => {
    const { user } = this.props;
    if (user.role) {
      this.setState({
        allowEdit: false,
      });
    }
  };

  onValueChnage = (record: any, event: any) => {
    let { id } = this.Pars;
    if (event.target.value > 0) {
      this.setState({ loadingForView: true });
      this.state.proposalResponse.proposalId = id;
      this.state.proposalResponse.order = event.target.value;
      this.state.record.order = event.target.value;
      this.setState({
        record: { ...this.state.record, record },
      });
      this.state.proposalResponse.content.push(this.state.record);
      rfpService
        .updateProposalResponseOrder(this.state.proposalResponse, record.id)
        .then((response) => {
          rfpService
            .getResponseContentByProposal(id)
            .then((response) => {
              this.setState({
                proposalsResponseData: response,
                loadingForView: false,
              });
            })
            .catch((error) => {
              this.setState({
                proposalsResponseData: [],
                loadingForView: false,
              });
            })
            .catch(notifications.openErrorNotification);
          rfpService
            .getResponseContentBySubDomain(
              this.state.proposalsData.region,
              this.state.proposalsData.domain,
              this.state.proposalsData.subDomain,
              -1
            )
            .then((response) => {
              this.setState({
                existingContent: response,
                loadingForView: false,
              });
            })
            .catch(notifications.openErrorNotification);
        });
    } else {
      notifications.openWarningNotification("Yor are not start with 0 notify");
    }
  };

  fileUploadCallback1 = (response: any) => {
    let { id } = this.Pars;
    this.state.documentData.ownerId = id;
    this.state.documentData.type = "Project Info";
    this.state.documentData.path = response.path;
    this.state.documentData.fileName = response.path.substring(id.length + 1);
  };

  fileUploadCallback = (response: any, filename: any, index: number) => {
    let { id } = this.Pars;
    if (this.state.proposalsData.status === "Won") {
      let document = new DocumentWithDate();
      document.path = response.path;
      document.fileName = filename;
      document.ownerId = id;
      this.state.documents[index] = document;
    } else {
      let document = new Document();
      document.path = response.path;
      document.fileName = filename;
      document.ownerId = id;
      this.state.documents[index] = document;
    }
  };

  onFinishAddDco = (value: any) => {
    this.docDis = true;
    for (let i = 0; i < this.state.documents.length; i++) {
      if (value.documents[i] != null && value.documents != undefined) {
        this.state.documents[i].title = value.documents[i].title;
        this.state.documents[i].type = value.documents[i].type;
        if (this.state.proposalsData.status === "Won") {
          if( value.documents[i].issueDate && value.documents[i].expiryDate ) {
          let startDate = value.documents[i].issueDate.format(this.format);
            let endDate = value.documents[i].expiryDate.format(this.format);
              if (Date.parse(endDate) <= Date.parse(startDate)) {
                notifications.warningMessage("End date should be greater than Start date for " + value.documents[i].title + "");
                return true;
              }
            this.state.documents[i].issueDate = startDate;
            this.state.documents[i].expiryDate = endDate;
          } else {
            this.state.documents[i].issueDate = "";
            this.state.documents[i].expiryDate = "12/31/9999";
          }
        }
      } else {
        this.state.documents[i] = undefined;
      }
    }
    this.saveDocument();
  };
  getDocumentsByRFP = (id: string) => {
    rfpService.getDocumentsByRFP(id).then((response) => {
      this.setState({
        proposalsDocumentData: response,
      });
      this.setState({
        loadingForView: false,
        visible: false,
      });
    });
  };
  saveDocument = async () => {
    let { id } = this.Pars;
    this.setState({
      loadingForView: true,
    });
    let documnets = this.state.documents;
    documnets.map((document: any) => {
      if (document != undefined && document != null) {
        rfpService
          .addDocument(document)
          .then((response) => {
            notifications.openSuccessNotification(
              MessageProp.getAddedSuccessMessage("Documents")
            );

            this.getDocumentsByRFP(id);
            this.setState({
              loadingForView: false,
              visible: false,
            });
          })
          .catch(notifications.openErrorNotification);
      }
    });
    await this.getDocumentsByRFP(id);
  };

  getType = (index: any) => {
    const doc = this.documentsFormRef.current.getFieldsValue("documents");
    return doc.documents.filter((value: any, idx: number) => {
      return index == idx;
    })[0];
  };

  addDocument = () => {
    let docx = [{}];
    this.docDis = false;
    let content = (
      <>
        <Form
          name="basic"
          ref={this.documentsFormRef}
          onFinish={this.onFinishAddDco}
          validateMessages={validateMessages}
          scrollToFirstError
        >
          <Form.List name="documents" initialValue={docx}>
            {(fields, { add, remove }) => (
              <>
                <Button type="primary" onClick={() => add()}>
                  <PlusOutlined />
                </Button>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <div className="pop-document">
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="Type"
                            name={[field.name, "type"]}
                            // fieldKey={[field.fieldKey, "type"]}
                            rules={[{ required: true }]}
                          >
                            <Select value={field.name}>
                              <Option value="Project Info">Project Info</Option>
                              <Option value="Project Proposal">
                                Project Proposal
                              </Option>
                              {this.state.proposalsData ?
                                this.state.proposalsData.status === "Won" ? (<Option value="Project Agreement">
                                  Project Agreement
                                </Option>) : ('') : ''}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="Title"
                            name={[field.name, "title"]}
                            // fieldKey={[field.fieldKey, "title"]}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        {this.state.proposalsData ? this.state.proposalsData.status === "Won" ? (<><Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="Start Date"
                            name={[field.name, "issueDate"]}
                          >
                            <DatePicker
                              format={this.format}
                              disabledDate={this.disabledDate}
                            />
                          </Form.Item>
                        </Col>
                          <Col className="gutter-row" span={7}>
                            <Form.Item
                              {...field}
                              label="End Date"
                              name={[field.name, "expiryDate"]}
                            >
                              <DatePicker
                                format={this.format}
                                disabledDate={this.disabledDate}
                              />
                            </Form.Item>
                          </Col></>) : ('') : ''}

                        <Col className="gutter-row" span={7}>
                          <Form.Item
                            {...field}
                            label="File"
                            name={[field.name, "fileName"]}
                          // fieldKey={[field.fieldKey, "fileName"]}
                          >
                            <UploadComponent
                              ownerId={this.state.id}
                              getType={() => this.getType(index)}
                              callback={this.fileUploadCallback}
                              index={index}
                            ></UploadComponent>
                          </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={3}>
                          <label>&nbsp;&nbsp;</label>
                          <Button
                            type="primary"
                            className="mar-top"
                            onClick={() => remove(field.name)}
                          >
                            <MinusOutlined />
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
          <Button
            type="primary"
            className="fr padding-bottom"
            htmlType="submit"
            disabled={this.docDis}
          >
            Submit
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Add Document" });
  };

  onFinish = async (value: any) => {
    let { id } = this.Pars;
    let dueDate = value.userTask.dueDate.format(this.format);
    let comment = value.userTask.comments;
    value.userTask.comments = [value.userTask.comments];
    let businessKey = id;
    this.state.userTask.assigneeId = this.state.assigneId;
    this.state.userTask.formUrl =
      baseService.getBaseUrl() + "/viewproposal?pageMode=view&id=" + id;
    this.state.userTask.url = baseService.getBaseUrl() + "/tasks";
    this.state.userTask.docUrl =
      baseService.getBaseUrl() + "/viewproposal?pageMode=view&id=" + id;
    this.setState(
      {
        userTask: {
          ...this.state.userTask,
          ...value.userTask,
          businessKey,
          dueDate,
        },
      },
      () => {}
    );

    let dataArray = [];
    dataArray.push({
      name: "RFP Title",
      value: this.state.proposalsData.title,
    });
    dataArray.push({
      name: "RFP Due Date",
      value: this.state.proposalsData.dueDate,
    });
    dataArray.push({
      name: "Agency Name",
      value: this.state.proposalsData.agency.name,
    });
    this.state.userTask.data = dataArray;
    await this.addTask(comment);
    await this.getProposalRequest(id);
  };
  disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().startOf("day");
  };

  addTask = async (comment: string) => {
    this.setState({
      loadingForView: true,
    });
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
      .addTask(this.state.userTask)
      .then(async (response) => {
        if (response !== undefined && flag) {
          await rfpService
            .addDocument(this.state.documentData)
            .then()
            .catch(notifications.openErrorNotification);
        }
        if (comment != "" && comment != undefined)
          await this.updateProposalRequest(comment);
        notifications.openSuccessNotification(
          MessageProp.getCreatedSuccessMessage("Add task")
        );
        this.setState({
          loadingForView: false,
          visible: false,
        });
      })
      .catch(notifications.openErrorNotification);
  };
  async updateProposalRequest(text: string) {
    let comment = new Comment();
    comment.text = text;
    comment.createdBy = User.getLoggedInUserEmailId();
    comment.fromDate = moment().format("MM/DD/YYYY");

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
  ownerNameChange = (event: string) => {
    let user = this.props.rfpByOwnerData.find((x: any) => x.name == event);
    this.setState({
      assigneId: user.email,
    });
  };

  cancel = () => {
    let { id } = this.Pars;
    history.push({
      pathname: "/proposals",
      search: "?past=-1",
    });
  };

  TaskDetail = () => {
    let content = (
      <>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="form-bg form-steps">
              <Form
                name="basic"
                onFinish={this.onFinish}
                className="task-form"
                validateMessages={validateMessages}
                scrollToFirstError
              >
                <div>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label="Title"
                        name={["userTask", "name"]}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Enter Title" maxLength={100} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={24}>
                      <Form.Item
                        label={<span> Description</span>}
                        name={["userTask", "description"]}
                      >
                        <Input
                          placeholder="Enter Description"
                          maxLength={500}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label="Due Date"
                        name={["userTask", "dueDate"]}
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          format={this.format}
                          disabledDate={this.disabledDate}
                        />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label="Assign"
                        name={["userTask", "assigneeName"]}
                        rules={[{ required: true }]}
                      >
                        <AutoComplete
                          placeholder="Select Assigner"
                          onChange={this.ownerNameChange}
                        >
                          {this.props.rfpByOwnerData.map((data: any) => {
                            return (
                              <Option value={data.name}>{data.name}</Option>
                            );
                          })}
                        </AutoComplete>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> RFP Title</span>}
                        name={["userTask", "title"]}
                      >
                        <Input
                          value={this.state.proposalsData.title}
                          placeholder="Enter RFP Title"
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> RFP Due Date</span>}
                        name={["userTask", "activationDate"]}
                      >
                        <Input
                          value={this.state.proposalsData.dueDate}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> Comment</span>}
                        name={["userTask", "comments"]}
                      >
                        <Input placeholder="Enter Solicitation Number" />
                      </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                      <Form.Item
                        label={<span> Add Document</span>}
                      // name={["userTask", "address"]}
                      >
                        <UploadComponent
                          ownerId={this.state.id}
                          getType={() => {
                            let type = "Project Info";
                            this.state.documentData.type = type;
                            return this.state.documentData;
                          }}
                          callback={this.fileUploadCallback1}
                        ></UploadComponent>
                      </Form.Item>
                    </Col>

                    {/* <Button type="primary" onClick={this.addDocument}>
                      Add Document
                    </Button> */}
                  </Row>
                </div>
                <Button type="primary" htmlType="submit">
                  Assign
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
    this.setState({ visible: true, content, title: "Add Task" });
  };

  /*   getTypes = () => {
      return "Project Info";
    };
   */
  onFinishContent = (value: any) => {
    this.setState(
      {
        content: {
          ...this.state.content,
          ...value.content,
        },
      },
      () => {
        value.content.map((data: string) => {
          this.state.existingContents.push(
            this.state.existingContent.find(
              (content: any) => content.question === data
            )
          );
        });
        this.state.responseContent.content = this.state.existingContents;
        this.state.responseContent.proposalId = this.state.proposalsData.id;
        this.state.responseContent.proposalTitle =
          this.state.proposalsData.title;
        this.state.responseContent.region = this.state.proposalsData.region;
        this.state.responseContent.domain = this.state.proposalsData.domain;
        this.state.responseContent.subDomain =
          this.state.proposalsData.subDomain;
      }
    );

    this.addProposalResponse();
  };

  exportDoc = async () => {
    if (!this.state.selectedRow.length) {
      notifications.openErrorNotification(
        "No Row selected, please select Row."
      );
    } else {
      if (
        this.state.selectedRow.length > 0 &&
        this.state.selectedRow !== null &&
        this.state.selectedRow !== undefined
      ) {
        this.state.responseContent.content = this.state.selectedRow;
        this.state.responseContent.proposalId = this.state.selectedRow.id;
        this.state.responseContent.proposalTitle = this.state.selectedRow.title;
        this.state.responseContent.region = this.state.selectedRow.region;
        this.state.responseContent.domain = this.state.selectedRow.domain;
        this.state.responseContent.subDomain = this.state.selectedRow.subDomain;

        await rfpService
          .exportProposalResponse(this.state.responseContent)
          .then((response) => {
            this.setState(
              {
                blob: response,
                loadingForView: false,
              },
              () => {
                importedSaveAs(
                  this.state.blob,
                  this.state.responseContent.proposalTitle + ".docx"
                );
              }
            );
            notifications.openSuccessNotification(
              MessageProp.getExportSucessMessage("Response")
            );
          })
          .catch(notifications.openErrorNotification);
      }
    }
    this.setState({
      loaaingForView: true,
    });
  };

  addProposalResponse() {
    let { id } = this.Pars;
    this.setState({
      loadingForView: true,
    });
    rfpService
      .addProposalResponse(this.state.responseContent)
      .then((response) => {
        rfpService
          .getResponseContentByProposal(id)
          .then((response) => {
            notifications.openSuccessNotification(
              MessageProp.getCreatedSuccessMessage("Existing response")
            );
            this.setState({
              proposalsResponseData: response,
              loadingForView: false,
              visible: false,
            });
          })
          .catch(notifications.openErrorNotification);
      })
      .catch(notifications.openErrorNotification);
  }

  existingContent = () => {
    let content = (
      <>
        <Form
          name="basic"
          onFinish={this.onFinishContent}
          validateMessages={validateMessages}
          scrollToFirstError
        >
          <Form.Item
            label="Section"
            name={["content"]}
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              className="popup-select"
              value={this.state.responseContent.content}
            >
              {this.state.existingContent.map((data: any) => {
                return <Option value={data.question}>{data.question}</Option>;
              })}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Existing Content" });
  };

  onFinishNewContent = (value: any) => {
    this.setState(
      {
        responseContent: {
          ...this.state.responseContent,
          ...value.responseContent,
        },
      },
      () => {
        this.state.responseContent.proposalId = this.state.proposalsData.id;
        this.state.responseContent.proposalTitle =
          this.state.proposalsData.title;
        this.state.responseContent.region = this.state.proposalsData.region;
        this.state.responseContent.domain = this.state.proposalsData.domain;
        this.state.responseContent.subDomain =
          this.state.proposalsData.subDomain;
        this.state.responseContents.content.push(this.state.responseContent);
        rfpService
          .addProposalResponse(this.state.responseContent)
          .then((response) => {})
          .catch(notifications.openErrorNotification);
      }
    );
  };

  onFinishNewComment = (value: any) => {
    if (value.text != undefined && value.text.trim().length !== 0) {
      let comment = new Comment();
      comment.text = value.text;
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
      this.state.proposalsData.comments.push(comment);
      this.setState({
        request: this.state.proposalsData,
      });

      this.setState({
        loadingForView: true,
      });
      rfpService
        .updateProposalRequest(this.state.request)
        .then((response) => {
          this.updateLoading(false);
          this.setState({
            loadingForView: false,
          });
          this.closeModal();
          notifications.openSuccessNotification(
            "Comment has been added Successfully."
          );
          this.getProposalRequest(this.state.request.id);
        })
        .catch(notifications.openErrorNotification);
    }
  };

  updateProposals() {
    // this.updateLoading(true);
    this.setState({
      loadingForView: true,
    });
    rfpService
      .updateProposalRequest(this.state.request)
      .then((response) => {
        this.updateLoading(false);
        MessageProp.getUpdatedSuccessMessage("Proposal");
        this.closeModal();
        this.setState({
          loadingForView: false,
        });
        history.push({
          pathname: "/viewproposal",
          search: "?id=" + response.id,
        });
      })
      .catch(notifications.openErrorNotification);
  }
  updateLoading = async (bol: boolean) => {
    await this.setState({ loading: bol });
  };

 

  addNewComment = () => {
    let content = (
      <>
        <Form
          name="basic"
          onFinish={this.onFinishNewComment}
          scrollToFirstError
        >
          <Form.Item label="Comment" name={["text"]}>
            <TextArea rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Add Comment" });
  };

  addNewContent = () => {
    let content = (
      <>
        <Form
          name="basic"
          onFinish={this.onFinishNewContent}
          scrollToFirstError
        >
          <Form.Item
            label={<span> Section Title</span>}
            name={["responseContent", "question"]}
          >
            <Input placeholder="Enter Title" />
          </Form.Item>
          <Form.Item
            label={<span> Descripation</span>}
            name={["responseContent", "answer"]}
          >
            <FroalaEditorComponent tag="textarea" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Add Section" });
  };

  handleSelect = (RwoId: any) => {
    this.setState({ selectedRow: RwoId });
  };

  handleDeleteButton = () => {
    if (this.state.selectedRow.length === 0) {
      notifications.openErrorNotification("Please Select Row");
    } else {
      Modal.confirm({
        title: "Delete Document",
        content: "Are you sure you want to delete document?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          this.confirmDelete();
        },
      });
    }
  };

  confirmDelete = () => {
    this.state.selectedRow.map((doc: any) => {
      this.deleteDocument(doc);
    });
  };

  deleteDocument = (doc: any) => {
    let { id } = this.Pars;
    rfpService
      .deleteDocument(doc)
      .then((response) => {
        rfpService
          .getDocumentsByRFP(id)
          .then((response) => {
            this.setState({
              proposalsDocumentData: response,
            });
            this.setState({
              loadingForView: false,
              visible: false,
            });
            notifications.openSuccessNotification(
              MessageProp.getDeletedSucessMessage("Document")
            );
          })
          .catch(notifications.openErrorNotification);
      })
      .catch(notifications.openErrorNotification);
  };

  handleZipFile = () => {
    if (!this.state.selectedRow.length) {
      notifications.openErrorNotification(
        "No Row selected, please select Row."
      );
    } else {
      let fileName =
        this.state.proposalsData.title +
        "_" +
        new Date().getMilliseconds() +
        ".zip";

      this.setState({
        loading: true,
      });
      if (this.state.selectedRow.length === 1) {
        notifications.openErrorNotification(
          "Please select more than one documents"
        );
      } else {
        rfpService
          .zipFileDownload(this.state.selectedRow)
          .then((response) => {
            this.setState(
              {
                blob: response,
                loading: false,
              },
              () => {
                importedSaveAs(this.state.blob, fileName);
              
              }
            );
          })
          .catch(notifications.openErrorNotification);
      }
    }
  };

  onChnageCancel = () => {
    history.push("/proposals?past=7");
  };

  onChangeTab = (event: any) => {
    let { id } = this.Pars;
    this.setState({ loadingForView: true });

    if (event === "2") {
      this.setState({
        tabKey: 2,
      });
      rfpService
        .getResponseContentByProposal(id)
        .then((response) => {
          this.setState({
            proposalsResponseData: response,
            loadingForView: false,
          });
        })
        .catch((error) => {
          this.setState({
            proposalsResponseData: [],
            loadingForView: false,
          });
        })
        .catch(notifications.openErrorNotification);
      rfpService
        .getResponseListContentBySubDomain(
          this.state.proposalsData.region,
          this.state.proposalsData.domain,
          this.state.proposalsData.subDomain,
          -1
        )
        .then((response) => {
          this.setState({
            existingContent: response,
            loadingForView: false,
          });
        })
        .catch(notifications.openErrorNotification);
    } else if (event === "3") {
      this.setState({
        tabKey: 3,
      });
      rfpService
        .getDocumentsByRFP(id)
        .then((response) => {
          this.setState({
            proposalsDocumentData: response,
            loadingForView: false,
          });
        })
        .catch(notifications.openErrorNotification);
    } else if (event === "4") {
      this.setState({
        tabKey: 4,
        loadingForView: false,
      });
    } else {
      this.setState({
        tabKey: 1,
        loadingForView: false,
      });
    }
  };

  onFinishWonPropsal = (value: any) => {
    this.setState(
      {
        request: {
          ...this.state.proposalsData,
          ...value.request,
        },
      },
      () => {
        if (value.text !== undefined) {
          this.state.comment.text = value.text;
          this.state.comment.createdBy = User.getLoggedInUserEmailId();
          this.state.comment.fromDate = moment().format("MM/DD/YYYY");
          this.state.commentList.push(this.state.comment);
        }
        this.state.request.wonProposalRequest.comments = this.state.commentList;
      }
    );
    this.addCompetitiveRfp();
  };
  firstMethod = (e: any) => {
    const re = /[a-z A-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  addCompetitiveRfp = () => {
    let { id } = this.Pars;
    this.setState({
      loadingForView: true,
    });
    rfpService
      .addCompetitiveRFP(this.state.request)
      .then((response) => {
        rfpService
          .updateStatus(this.state.proposalsData.id, "Lost")
          .then(() => {
            notifications.openSuccessNotification(
              MessageProp.getCreatedSuccessMessage("Award Update")
            );
          });

        this.setState({
          loadingForView: false,
        });
        history.push({
          pathname: "/proposals",
          search: "?past=-1",
        });
      })
      .catch(notifications.openErrorNotification);
  };

  newCreateWonProposal = () => {
    this.setState({
      wonProposalFormView: true,
      wonProposalFormEdit: false,
      createNewWonProposal: true,
    });

    let fieldValues = {
      request: {
        wonProposalRequest: {
          title: this.state.proposalsData.title,
          agency: {
            name: this.state.proposalsData.agency.name,
            webSite: this.state.proposalsData.agency.webSite,
            address: {
              line1:
                this.state.proposalsData.agency.address
                  .line1,
              city: this.state.proposalsData.agency.address
                .city,
              state:
                this.state.proposalsData.agency.address
                  .state,
              country:
                this.state.proposalsData.agency.address
                  .country,
              pinCode:
                this.state.proposalsData.agency.address
                  .pinCode,
            },
          },
        },
      },
    };
    this.refForm.current.setFieldsValue(fieldValues);
  };

  editWonProposal = () => {
    this.setState({
      wonProposalFormEdit: false,
      wonProposalFormView: true,
      readOnly: true,
    });
    let fieldValues = {
      request: {
        wonProposalRequest: {
          title: this.state.proposalsData.wonProposalRequest.title,
          contractDetailsUrl:
            this.state.proposalsData.wonProposalRequest.contractDetailsUrl,
          price: this.state.proposalsData.wonProposalRequest.price,
          agency: {
            name: this.state.proposalsData.wonProposalRequest.agency.name,
            webSite: this.state.proposalsData.wonProposalRequest.agency.webSite,
            address: {
              line1:
                this.state.proposalsData.wonProposalRequest.agency.address
                  .line1,
              city: this.state.proposalsData.wonProposalRequest.agency.address
                .city,
              state:
                this.state.proposalsData.wonProposalRequest.agency.address
                  .state,
              country:
                this.state.proposalsData.wonProposalRequest.agency.address
                  .country,
              pinCode:
                this.state.proposalsData.wonProposalRequest.agency.address
                  .pinCode,
            },
          },
        },
      },
    };
    this.state.proposalsData.wonProposalRequest.comments.map((data: any) => {
      this.state.commentList.push(data);
    });
    this.refForm.current.setFieldsValue(fieldValues);
  };

  render() {
    const { proposalsData } = this.state;
    let { id } = this.Pars;

    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={this.state.loadingForView}
        ></DailogComponent>
        <Spin
          size="large"
          className="loader"
          spinning={this.state.loadingForView}
        >
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 24 }}
            >
              <Row>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 24 }}
                >
                  <div className="site-page-header-ghost-wrapper view-file-common">
                    <PageHeader
                      ghost={false}
                      avatar={{
                        src: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4",
                      }}
                      title={proposalsData.title}
                    >
                      <div className="viewstatus">
                        <div className="status-border right-border">
                          <ul>
                            <li>
                              <span>Status :</span> {proposalsData.status}
                            </li>
                            <li>
                              <span>Domain :</span> {proposalsData.domain}
                            </li>
                          </ul>
                        </div>
                        <div className="status-border left-border">
                          <ul>
                            <li>
                              <span>Solicitation :</span>{" "}
                              {proposalsData.requestId ? (
                                <Tooltip title={proposalsData.requestId}>
                                  <h3 className="proposal-contact-01 ml">
                                    <b>
                                      {proposalsData.requestId.length > 10
                                        ? proposalsData.requestId.substring(
                                          0,
                                          10 - 3
                                        ) + "..."
                                        : proposalsData.requestId}
                                    </b>
                                  </h3>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                            </li>
                            <li>
                              <span>Complexity Level :</span>{" "}
                              {proposalsData.complexity}
                            </li>
                          </ul>
                        </div>
                        <div className="status-border left-border">
                          <ul>
                            <li>
                              <span>Source :</span> {proposalsData.source}
                            </li>
                            <li>
                              <span>Type :</span> {proposalsData.type}
                            </li>
                          </ul>
                        </div>
                        <div className="status-border left-border">
                          <ul>
                            <li>
                              <span>Competition Type :</span>{" "}
                              {proposalsData.competitionType}
                            </li>
                            <li>
                              <span>Created By:</span>{" "}
                              {this.state.rfpCreatedBy}
                            </li>
                            <li>
                              <span>Assignee To :</span>{" "}
                              {proposalsData.ownerName}
                            </li>
                          </ul>
                        </div>
                        {this.state.tabKey === 1 ? (
                          <>
                            <div className="status-border right">
                              <Tooltip title="Add Task">
                                <Button
                                  hidden={this.state.allowEdit}
                                  onClick={this.TaskDetail}
                                >
                                  <FileProtectOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Edit Proposal">
                                <Link
                                  hidden={this.state.allowEdit}
                                  to={"/add-proposal?id=" + id}
                                >
                                  <Button className="button">
                                    <FormOutlined />
                                  </Button>
                                </Link>
                              </Tooltip>
                              <Tooltip title="Add Comment">
                                <Button
                                  onClick={this.addNewComment}
                                  className="button"
                                >
                                  <AliwangwangOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="back">
                                <Button
                                  onClick={this.cancel}
                                  className="status-button"
                                >
                                  <DoubleLeftOutlined />
                                </Button>
                              </Tooltip>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {this.state.tabKey === 2 ? (
                          <>
                            <div className="status-border right">
                              <Tooltip title="Export Document">
                                <Button onClick={this.exportDoc}>
                                  <DownloadOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Existing Content">
                                <Button
                                  className="status-button"
                                  onClick={this.existingContent}
                                >
                                  <PlusCircleOutlined />
                                </Button>
                              </Tooltip>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {this.state.tabKey === 3 ? (
                          <>
                            <div className="status-border right">
                              <Tooltip title="Add New Document">
                                <Button onClick={this.addDocument}>
                                  <PlusCircleOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Zip Documents">
                                <Button
                                  className="button"
                                  onClick={this.handleZipFile}
                                >
                                  <FilePdfOutlined />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Delete Documents">
                                <Button
                                  className="status-button"
                                  onClick={this.handleDeleteButton}
                                >
                                  <DeleteFilled />
                                </Button>
                              </Tooltip>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {this.state.tabKey === 4 ? <></> : <></>}
                      </div>
                    </PageHeader>
                    <Tabs
                      defaultActiveKey="1"
                      centered
                      onChange={this.onChangeTab}
                    >
                      <TabPane tab="General" key="1">
                        <div>
                          <Row gutter={16}>
                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 8 }}
                            >
                              <PageHeader
                                ghost={false}
                                className="heading-view-proposal"
                                title="Agency Information"
                              >
                                <Descriptions
                                  size="small"
                                  column={1}
                                  className="agency-min"
                                >
                                  {this.state.proposalsData.agency !==
                                    undefined ? (
                                    <>
                                      <Descriptions.Item label="Name">
                                        {this.state.proposalsData.agency.name}
                                      </Descriptions.Item>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {this.state.proposalsData.agency !==
                                    undefined ? (
                                    <>
                                      <Descriptions.Item label="Address">
                                        {Object.keys(
                                          this.state.proposalsData.agency
                                            .address
                                        ).reduce(
                                          (
                                            addressString: string,
                                            k: string
                                          ) => {
                                            addressString +=
                                              this.state.proposalsData.agency
                                                .address[k];
                                            if (
                                              (this.state.proposalsData.agency
                                                .address[k] != undefined ||
                                                this.state.proposalsData.agency
                                                  .address[k] != "") &&
                                              k != "country"
                                            ) {
                                              addressString += " , ";
                                            }
                                            return addressString;
                                          },
                                          ""
                                        )}
                                      </Descriptions.Item>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </Descriptions>
                                <div className="center-icon">
                                  {this.state.proposalsData.agency !==
                                    undefined ? (
                                    <>
                                      {" "}
                                      <span className="globe">
                                        <a
                                          href={
                                            "mailto:" +
                                            this.state.proposalsData.agency
                                              .email
                                          }
                                        >
                                          <img src={envolope} alt="Envolope" />
                                        </a>
                                      </span>
                                      <span className="globe">
                                        <a
                                          href={
                                            this.state.proposalsData.agency
                                              .webSite
                                          }
                                          target="_blank"
                                        >
                                          <img src={globe} alt="globe" />
                                        </a>
                                      </span>
                                      <span className="globe">
                                        <a
                                          href={
                                            "tel:" +
                                            this.state.proposalsData.agency
                                              .contactNo
                                          }
                                        >
                                          <img src={phone} alt="phone" />
                                        </a>
                                      </span>
                                    </>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </PageHeader>
                            </Col>
                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 8 }}
                              className="dashboard-title"
                            >
                              <PageHeader
                                ghost={false}
                                title="Contract Information"
                                className="heading-view-proposal"
                              >
                                <Descriptions
                                  size="small"
                                  column={1}
                                  className="agency-min"
                                >
                                  <Descriptions.Item label="Type">
                                    {proposalsData.contractType}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Submission Type">
                                    {proposalsData.submissionType}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Detail Url">
                                    <a
                                      href={
                                        "https://" +
                                        proposalsData.contractDetailsUrl
                                      }
                                      target="_blank"
                                    >
                                      {proposalsData.contractDetailsUrl}
                                    </a>
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Contract Price">
                                    {proposalsData.price}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Issue Date">
                                    {proposalsData.issueDate}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Due Date">
                                    {proposalsData.dueDate}
                                  </Descriptions.Item>
                                </Descriptions>
                              </PageHeader>
                            </Col>
                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 8 }}
                              lg={{ span: 8 }}
                              className="dashboard-title"
                            >
                              <PageHeader
                                ghost={false}
                                className="heading-view-proposal"
                                title="Contact Information"
                              >
                                <Descriptions
                                  size="small"
                                  column={1}
                                  className="agency-min"
                                >
                                  {proposalsData.contacts !== undefined
                                    ? proposalsData.contacts.map(
                                      (contact: any, index: any) => {
                                        return (
                                          index >= this.state.minIndex &&
                                          index < this.state.maxIndex && (
                                            <>
                                              <Descriptions.Item label="Title">
                                                {contact.title}
                                              </Descriptions.Item>
                                              <Descriptions.Item label="Name">
                                                {contact.name}
                                              </Descriptions.Item>

                                              <div className="center-icon">
                                                <Popover
                                                  content={
                                                    <a
                                                      href={
                                                        "mailto:" +
                                                        contact.email
                                                      }
                                                    >
                                                      {contact.email}
                                                    </a>
                                                  }
                                                  trigger="click"
                                                  visible={this.state.popup}
                                                  onVisibleChange={
                                                    this.handleVisibleChange
                                                  }
                                                >
                                                  <span className="globe">
                                                    <img
                                                      src={envolope}
                                                      alt="Envolope"
                                                    />
                                                  </span>
                                                </Popover>
                                                <Popover
                                                  content={
                                                    <a
                                                      href={
                                                        "tel:" +
                                                        contact.contactNo
                                                      }
                                                    >
                                                      {contact.contactNo}
                                                    </a>
                                                  }
                                                  trigger="click"
                                                  visible={
                                                    this.state.popupphone
                                                  }
                                                  onVisibleChange={
                                                    this
                                                      .handleVisiblePhoneChange
                                                  }
                                                >
                                                  <span className="globe">
                                                    <img
                                                      src={phone}
                                                      alt="phone"
                                                    />
                                                  </span>
                                                </Popover>
                                              </div>
                                            </>
                                          )
                                        );
                                      }
                                    )
                                    : ""}

                                  <span className="arrow arrow-01">
                                    {" "}
                                    <Pagination
                                      pageSize={pageSize}
                                      current={this.state.current}
                                      total={this.state.pagenumber}
                                      onChange={this.handleChange}
                                    />
                                  </span>
                                </Descriptions>
                              </PageHeader>
                            </Col>

                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 24 }}
                              lg={{ span: 24 }}
                            >
                              <PageHeader
                                ghost={false}
                                title="Comments"
                                className="bordernone"
                              ></PageHeader>
                              <Table1
                                data={proposalsData.comments}
                                columns={this.columnsComment}
                                loading={false}
                                checkBox={false}
                              />
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                      <TabPane tab="Response" key="2">
                        <Table1
                          data={this.state.proposalsResponseData}
                          columns={this.columns}
                          loading={false}
                          checkBox={true}
                          handleSelect={this.handleSelect}
                        />
                      </TabPane>
                      <TabPane tab="Documents" key="3">
                        {this.state.proposalsData ? this.state.proposalsData.status === "Won" ? (<Table1
                          data={this.state.proposalsDocumentData}
                          columns={columnsAgrementDocument}
                          rowIdentifier="id"
                          loading={false}
                          checkBox={true}
                          handleSelect={this.handleSelect}
                        />) : (<Table1
                          data={this.state.proposalsDocumentData}
                          columns={columnsDocument}
                          rowIdentifier="id"
                          loading={false}
                          checkBox={true}
                          handleSelect={this.handleSelect}
                        />) : ('')}
                      </TabPane>
                      <TabPane tab="Award Update" key="4">
                        {proposalsData.wonProposalRequest ? (
                          <>
                            {proposalsData.wonProposalRequest.title ? (
                              <>
                                <Form
                                  className="wonproposal"
                                  name="basic"
                                  onFinish={this.onFinishWonPropsal}
                                  validateMessages={validateMessages}
                                  hidden={this.state.wonProposalFormView}
                                  scrollToFirstError
                                >
                                  <Row gutter={16}>
                                    <Col
                                      xs={{ span: 24 }}
                                      sm={{ span: 24 }}
                                      md={{ span: 24 }}
                                      lg={{ span: 24 }}
                                    >
                                      <Button
                                        type="primary"
                                        onClick={this.editWonProposal}
                                        className="fr"
                                      >
                                        Edit
                                      </Button>
                                    </Col>
                                  </Row>
                                  <Row gutter={16}>
                                    <Col
                                      xs={{ span: 24 }}
                                      sm={{ span: 24 }}
                                      md={{ span: 12 }}
                                      lg={{ span: 12 }}
                                    >
                                      <div className="border">
                                        <PageHeader
                                          ghost={false}
                                          title="RFP INFORMATION"
                                          className="bordernone"
                                        ></PageHeader>
                                        <Descriptions>
                                          <Descriptions.Item label="Title">
                                            {
                                              proposalsData.wonProposalRequest
                                                .title
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <PageHeader
                                          ghost={false}
                                          title="CONTRACT INFORMATION"
                                          className="bordernone"
                                        ></PageHeader>
                                        <Descriptions>
                                          <Descriptions.Item label="Contract Details Url">
                                            {
                                              proposalsData.wonProposalRequest
                                                .contractDetailsUrl
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="Contract Price">
                                            {
                                              proposalsData.wonProposalRequest
                                                .price
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>

                                        <Form.Item
                                          label={
                                            <span className="textAlignment">
                                              Comments
                                            </span>
                                          }
                                        >
                                          <Table1
                                            data={
                                              proposalsData.wonProposalRequest
                                                .comments
                                            }
                                            columns={this.columnsComment}
                                            loading={false}
                                            checkBox={false}
                                          />
                                        </Form.Item>
                                      </div>
                                    </Col>
                                    <Col
                                      xs={{ span: 24 }}
                                      sm={{ span: 24 }}
                                      md={{ span: 12 }}
                                      lg={{ span: 12 }}
                                    >
                                      <div className="border">
                                        <PageHeader
                                          ghost={false}
                                          title="AGENCY INFORMATION"
                                          className="bordernone"
                                        ></PageHeader>

                                        <Descriptions>
                                          <Descriptions.Item label="Agency Name">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.name
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="Agency Web">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.webSite
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="Address">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.address.line1
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="City">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.address.city
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="State">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.address.state
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="Country">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.address.country
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                        <Descriptions>
                                          <Descriptions.Item label="Zip Code">
                                            {
                                              proposalsData.wonProposalRequest
                                                .agency.address.pinCode
                                            }
                                          </Descriptions.Item>
                                        </Descriptions>
                                      </div>
                                    </Col>
                                  </Row>
                                </Form>
                              </>
                            ) : (
                              <div hidden={this.state.createNewWonProposal}>
                                {" "}
                                <Button
                                  type="primary"
                                  onClick={this.newCreateWonProposal}
                                  className="fr"
                                >
                                  Create
                                </Button>{" "}
                                <Button
                                  onClick={this.onChnageCancel}
                                  className="fr cancel"
                                >
                                  Cancel
                                </Button>{" "}
                                <div className={"not-found-img"}>
                                  <img src={noDataFound} />
                                </div>{" "}
                                <div className={"text-center fontsize"}>
                                  {" "}
                                  No data found{" "}
                                </div>{" "}
                              </div>
                            )}
                          </>
                        ) : (
                          "Not found data"
                        )}
                        <Form
                          className="wonproposal"
                          name="basic"
                          onFinish={this.onFinishWonPropsal}
                          ref={this.refForm}
                          validateMessages={validateMessages}
                          scrollToFirstError
                          hidden={this.state.wonProposalFormEdit}
                        >
                          <Row gutter={16}>
                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <div className="border">
                                <PageHeader
                                  ghost={false}
                                  title="RFP INFORMATION"
                                  className="bordernone"
                                ></PageHeader>
                                <Form.Item
                                  label="Title"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "title",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder="Enter Title"
                                    maxLength={100}
                                  />
                                </Form.Item>
                                <PageHeader
                                  ghost={false}
                                  title="CONTRACT INFORMATION"
                                  className="bordernone"
                                ></PageHeader>
                                <Form.Item
                                  label="Contract Details Url"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "contractDetailsUrl",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder="Enter Contract Details Url"
                                    maxLength={100}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Contract Price"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "price",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <InputNumber
                                    placeholder="Enter Contract Price"
                                    minLength={0}
                                    maxLength={10}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label={<span> Comments</span>}
                                  name={["text"]}
                                >
                                  <TextArea rows={3} />
                                </Form.Item>
                              </div>
                            </Col>
                            <Col
                              xs={{ span: 24 }}
                              sm={{ span: 24 }}
                              md={{ span: 12 }}
                              lg={{ span: 12 }}
                            >
                              <div className="border">
                                <PageHeader
                                  ghost={false}
                                  title="AGENCY INFORMATION"
                                  className="bordernone"
                                ></PageHeader>
                                <Form.Item
                                  label="Agency Name"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "agency",
                                    "name",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder="Enter Agency Name"
                                    maxLength={100}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Agency Web"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "agency",
                                    "webSite",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder="Enter Agency Web"
                                    maxLength={100}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Address"
                                  name={[
                                    "request",
                                    "wonProposalRequest",
                                    "agency",
                                    "address",
                                    "line1",
                                  ]}
                                  rules={[{ required: true }]}
                                >
                                  <Input
                                    placeholder="Enter Address"
                                    maxLength={200}
                                  />
                                </Form.Item>
                                <Row gutter={32}>
                                  <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 12 }}
                                    lg={{ span: 12 }}
                                  >
                                    <Form.Item
                                      label="City"
                                      name={[
                                        "request",
                                        "wonProposalRequest",
                                        "agency",
                                        "address",
                                        "city",
                                      ]}
                                      rules={[{ required: true }]}
                                    >
                                      <Input
                                        placeholder="Enter City"
                                        maxLength={50}
                                        onKeyPress={(e) => this.firstMethod(e)}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 12 }}
                                    lg={{ span: 12 }}
                                  >
                                    <Form.Item
                                      label="State"
                                      name={[
                                        "request",
                                        "wonProposalRequest",
                                        "agency",
                                        "address",
                                        "state",
                                      ]}
                                      rules={[{ required: true }]}
                                    >
                                      <Input
                                        placeholder="Enter State"
                                        maxLength={50}
                                        onKeyPress={(e) => this.firstMethod(e)}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row gutter={32}>
                                  <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 12 }}
                                    lg={{ span: 12 }}
                                  >
                                    <Form.Item
                                      label="Country"
                                      name={[
                                        "request",
                                        "wonProposalRequest",
                                        "agency",
                                        "address",
                                        "country",
                                      ]}
                                      rules={[{ required: true }]}
                                    >
                                      <Select>
                                        {CountriesComponent.map((data: any) => {
                                          return (
                                            <Option value={data.name}>
                                              {data.name}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col
                                    xs={{ span: 24 }}
                                    sm={{ span: 24 }}
                                    md={{ span: 12 }}
                                    lg={{ span: 12 }}
                                  >
                                    <Form.Item
                                      label={<span> Zip Code</span>}
                                      name={[
                                        "request",
                                        "wonProposalRequest",
                                        "agency",
                                        "address",
                                        "pinCode",
                                      ]}
                                    >
                                      <Input
                                        placeholder="Zip Code"
                                        maxLength={10}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>{" "}
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className="fr"
                                >
                                  Submit
                                </Button>{" "}
                                <Button
                                  onClick={this.onChnageCancel}
                                  className="fr cancel"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>
                    </Tabs>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
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
export default connect(mapState, actionCreators)(Viewproposal);
