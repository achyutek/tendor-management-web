import React, { Component } from "react";
import "antd/dist/antd.css";
import InputMask from "react-input-mask";
import {
  Steps,
  message,
  Button,
  Row,
  Col,
  PageHeader,
  Select,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Table,
  Modal,
  Tooltip,
} from "antd";
import {
  RightOutlined,
  LeftOutlined,
  MergeCellsOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { notifications } from "../../../_helpers/notifications";
import { MaskedInput } from "antd-mask-input";
import { request } from "http";
import { rfpService } from "../../../services/rfp-service";
import { AttributeType } from "../../../_redux/_constants";
import { proposalsAction } from "../../../_redux/_actions";
import PreviewDocument from "../../../component/PreviewDocument";
import DownloadComponent from "../../../component/DownloadComponent";
import { UploadComponent } from "../../../component/UploadComponent";
import { MessageProp } from "../../../_globals/constants/message.constants";
import { Document } from "../../../_models/document.model";
import DailogComponent from "../../../component/DailogComponent";
import { Table1 } from "../../../component/table";
import { User } from "../../../_globals/components";
import CountriesComponent from "../../../component/CountriesComponent";
import moment from "moment";
import history from "../../../_helpers/history";
import addButton from "../../../../assets/images/addButton.png";

const Option = Select.Option;
const { TextArea } = Input;
const Step = Steps.Step;
const qs = require("query-string");
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

const columnsComment = [
  {
    key: "fromDate",
    title: "Date",
    dataIndex: "fromDate",
  },
  {
    title: "Text",
    dataIndex: "text",
    ellipsis: true,
  },
  {
    title: "Created By",
    dataIndex: "createdBy",
  },
];

const validateMessages = {
  required: "${label}  is required!",
};

class AddCompetitive extends Component<any, any> {
  Pars = qs.parse(window.location.search);
  testdata: any;
  format = "MM/DD/YYYY";
  refForm: any = React.createRef();
  documentsFormRef: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      current: 0,
      size: "default",
      keyboard: true,
      competitive: "",
      submissionData: "",
      contractData: "",
      countryData: "",
      subdomainData: [],
      request1: "",
      request2: "",
      request3: "",
      request0: "",
      request4: "",
      ComepetitveEditData: "",
      competitiveDocumentData: "",
      document: new Document(),
      documents: [],
      visible: "",
      content: "",
      comment: {},
      commentList: [],
      hidden: false,
      readonly: false,
      selectedRow: [],
      domain: [],
      region: [],
    };
  }

  steps = [
    {
      title: "RFP Information",
      content: "",
    },
    {
      title: "Agency Information",
      content: "",
    },
    {
      title: "Documents",
      content: "",
    },
    {
      title: "Comments",
      content: "",
    },
  ];

  stepsAdd = [
    {
      title: "RFP Information",
      content: "",
    },
    {
      title: "Agency Information",
      content: "",
    },
    // {
    //   title: "Documents",
    //   content: "",
    // },
    // {
    //   title: "Comments",
    //   content: "",
    // },
  ];
  next = (competitive: any) => {};
  prev() {
    const current = this.state.current - 1;

    this.setState({ current });
  }
  toggle = () => {
    this.setState({
      keyboard: !this.state.keyboard,
    });
  };

  componentDidMount() {
    let { id } = this.Pars;
    document.title = "Competitive";
    if (id === undefined || id === "") {
      this.props.getRfpByDomain();
      this.props.getRFPBYSource();
      this.props.getRfpBytype();
      this.getRegion();
    } else {
      this.getCompetetiveById();
      this.getDocument();
      this.setState({
        hidden: true,
        readonly: true,
      });
    }
  }

  firstMethod = (e: any) => {
    const re = /[a-z A-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  getRegion = async () => {
    this.setState({
      region: await rfpService
        .getRfpByAttribute(AttributeType.REGION)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
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
              competitiveDocumentData: response,
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

  getDocument = () => {
    let { id } = this.Pars;
    rfpService
      .getDocumentsByRFP(id)
      .then((response) => {
        this.setState({
          competitiveDocumentData: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };

  onFinish = (value: any) => {
    let { id } = this.Pars;
    if (id === undefined || id === "") {
      const current = this.state.current + 1;
      this.setState({ current });
      if (current === 1) {
        if (value.text != undefined && value.text.trim().length !== 0) {
          this.state.comment.text = value.text;
          this.state.comment.createdBy = User.getLoggedInUserEmailId();
          this.state.comment.fromDate = moment().format("MM/DD/YYYY");
          this.state.commentList.push(this.state.comment);
        }
        this.setState({
          request1: value,
          competitive: { ...this.state.competitive, ...value.competitive },
        });
        this.state.competitive.comments = this.state.commentList;
      } else if (current === 2) {
        this.setState({
          request2: value,
          competitive: { ...this.state.competitive, ...value.competitive },
        });
        this.submitProposals();
      } else {
        this.setState({
          competitive: value,
        });
      }
    } else {
      const current = this.state.current + 1;
      this.setState({ current });
      if (current === 1) {
        this.setState({
          request1: value,
          competitive: { ...this.state.competitive, ...value.competitive },
        });
      } else if (current === 2) {
        this.setState({
          request2: value,
          competitive: { ...this.state.competitive, ...value.competitive },
        });
      } else if (current === 3) {
        this.setState({
          request3: value,
          competitive: { ...this.state.competitive, ...value.competitive },
        });
      } else if (current === 4) {
        if (value.text != undefined) {
          this.state.comment.text = value.text;
          this.state.comment.createdBy = User.getLoggedInUserEmailId();
          this.state.comment.fromDate = moment().format("MM/DD/YYYY");
          this.state.commentList.push(this.state.comment);
        }
        this.state.competitive.comments = this.state.commentList;
        this.setState({
          competitive: { ...this.state.competitive, id },
        });
        this.updateCompetitve();
      } else {
        this.setState({
          competitive: value,
        });
      }
    }
  };

  submitProposals() {
    rfpService
      .addCompetitve(this.state.competitive)
      .then((response) => {
        MessageProp.getUpdatedSuccessMessage("Add Proposal");
        history.push({
          pathname: "/detialsCompetitve",
          search: "?id=" + response.id,
        });
      })
      .catch(notifications.openErrorNotification);
  }

  cancel = () => {
    history.push({
      pathname: "/viewCompetitive",
    });
  };

  updateCompetitve = () => {
    rfpService
      .updateCompetitve(this.state.competitive)
      .then((response) => {
        MessageProp.getUpdatedSuccessMessage("Update Proposal");
        history.push({
          pathname: "/detialsCompetitve",
          search: "?id=" + response.id,
        });
      })
      .catch(notifications.openErrorNotification);
  };

  getCompetetiveById = async () => {
    let { id } = this.Pars;
    this.setState(
      {
        ComepetitveEditData: await rfpService
          .getCompetitiveDetails(id)
          .then()
          .catch(notifications.openErrorNotification),
        loading: false,
      },
      () => {
        this.editCompetitve();
      }
    );
  };

  editCompetitve = () => {
    let fieldValues = {
      competitive: {
        requestId: this.state.ComepetitveEditData.requestId,
        title: this.state.ComepetitveEditData.title,
        region: this.state.ComepetitveEditData.region,
        domain: this.state.ComepetitveEditData.domain,
        source: this.state.ComepetitveEditData.source,
        type: this.state.ComepetitveEditData.type,
        price: this.state.ComepetitveEditData.price,
        agency: {
          name: this.state.ComepetitveEditData.agency.name,
          email: this.state.ComepetitveEditData.agency.email,
          webSite: this.state.ComepetitveEditData.agency.webSite,
          contactNo: this.state.ComepetitveEditData.agency.contactNo,
          address: {
            line1: this.state.ComepetitveEditData.agency.address.line1,
            line2: this.state.ComepetitveEditData.agency.address.line2,
            line3: this.state.ComepetitveEditData.agency.address.line3,
            city: this.state.ComepetitveEditData.agency.address.city,
            state: this.state.ComepetitveEditData.agency.address.state,
            country: this.state.ComepetitveEditData.agency.address.country,
            pinCode: this.state.ComepetitveEditData.agency.address.pinCode,
          },
        },
      },
    };
    this.state.ComepetitveEditData.comments.map((data: any) => {
      this.state.commentList.push(data);
    });
    this.refForm.current.setFieldsValue(fieldValues);
  };

  getType = (index: number) => {
    const doc = this.documentsFormRef.current.getFieldsValue("document");

    return doc.document.filter((value: any, idx: number) => {
      return index == idx;
    })[0];
  };

  fileUploadCallback = (response: any) => {
    let { id } = this.Pars;
    this.state.document.path = response.path;
    this.state.document.fileName = response.path.substring(id.length + 1);
  };

  onFinishAddDco = (value: any) => {
    let { id } = this.Pars;

    this.state.document.title = value.document[0].title;
    this.state.document.type = value.document[0].type;
    this.state.document.ownerId = id;
    this.state.document.id = id;
    this.saveDocument();
  };

  saveDocument = () => {
    let { id } = this.Pars;
    this.setState({
      loadingForView: true,
    });
    if (this.state.document.path) {
      rfpService
        .addDocument(this.state.document)
        .then((response) => {
          MessageProp.getUploadedeSucessMessage("Proposal");
          rfpService
            .getDocumentsByRFP(id)
            .then((response) => {
              this.setState({
                competitiveDocumentData: response,
              });
              this.setState({
                loadingForView: false,
                visible: false,
              });
            })
            .catch(notifications.openErrorNotification);
        })
        .catch(notifications.openErrorNotification);
    } else {
      notifications.openErrorNotification("Please upload file to submit");
    }
  };

  handlRegionChange = async (region: any) => {
    let response = await rfpService.getDomain(region).then().catch();
    if (response != "") {
      let domain = response[0].name;
      this.setRegionAndDomain(domain);
      this.setState({
        domain: response,
      });
    } else {
      this.setRegionAndDomain("");
      this.setState({
        domain: [],
      });
    }
  };

  setRegionAndDomain = (domain: string) => {
    let fieldValue = {
      competitive: {
        domain: domain,
      },
    };
    this.refForm.current.setFieldsValue(fieldValue);
  };

  addDocument = () => {
    let content = (
      <>
        <Form
          name="basic"
          ref={this.documentsFormRef}
          onFinish={this.onFinishAddDco}
          validateMessages={validateMessages}
          scrollToFirstError
        >
          <Form.List name="document">
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
          >
            Submit
          </Button>
        </Form>
      </>
    );
    this.setState({ visible: true, content, title: "Add Document" });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { current, competitive, subdomainData } = this.state;
    const { size } = this.state;
    let { id } = this.Pars;
    return (
      <>
        <DailogComponent
          setIsModalVisible={this.state.visible}
          closeModal={this.closeModal}
          content={this.state.content}
          title={this.state.title}
          loading={false}
        ></DailogComponent>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
          >
            <div className="site-page-header-ghost-wrapper">
              <PageHeader
                ghost={false}
                title="Add Proposal"
                className="form-top-heading"
              ></PageHeader>
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
            <div className="form-bg form-steps">
              {id === undefined || id === "" ? (
                <>
                  {" "}
                  <div className="steps">
                    <Steps current={current}>
                      {this.stepsAdd.map((item) => (
                        <Step key={item.title} title={item.title} />
                      ))}
                    </Steps>
                  </div>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Steps current={current}>
                    {this.steps.map((item) => (
                      <Step key={item.title} title={item.title} />
                    ))}
                  </Steps>{" "}
                </>
              )}

              <Form
                name="basic"
                onFinish={this.onFinish}
                ref={this.refForm}
                validateMessages={validateMessages}
                scrollToFirstError
              >
                {this.steps.map(({ title, content }, i) => (
                  <div
                    key={title}
                    className={i === this.state.current ? "foo fade-in" : "foo"}
                  ></div>
                ))}{" "}
                <div className="steps-action">
                  {this.state.current == 0 && (
                    <>
                      <div>
                        <Form.Item
                          label="Solicitation"
                          name={["competitive", "requestId"]}
                          rules={[{ required: true }]}
                        >
                          <Input
                            disabled={this.state.hidden}
                            placeholder="Enter Solicitation Number"
                            maxLength={50}
                          />
                        </Form.Item>
                        <Form.Item
                          label="Title"
                          name={["competitive", "title"]}
                          rules={[{ required: true }]}
                        >
                          <Input
                            disabled={this.state.hidden}
                            placeholder="Enter Title"
                            maxLength={100}
                          />
                        </Form.Item>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={8}>
                            <Form.Item
                              label="Region"
                              name={["competitive", "region"]}
                              rules={[{ required: true }]}
                            >
                              <Select
                                value={competitive.region}
                                disabled={this.state.hidden}
                                onChange={this.handlRegionChange}
                                id="rc_select_region"
                              >
                                {this.state.region.map((data: any) => {
                                  return (
                                    <Option value={data.name}>
                                      {data.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={8}>
                            <Form.Item
                              label="Domain"
                              name={["competitive", "domain"]}
                              rules={[{ required: true }]}
                            >
                              <Select
                                value={competitive.domain}
                                disabled={this.state.hidden}
                                id="rc_select_domain"
                              >
                                {this.state.domain.map((data: any) => {
                                  return (
                                    <Option value={data.name}>
                                      {data.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={8}>
                            <Form.Item
                              label="Source"
                              name={["competitive", "source"]}
                              rules={[{ required: true }]}
                            >
                              <Select
                                value={competitive.source}
                                disabled={this.state.hidden}
                              >
                                {this.props.rfpBySourceData.map((data: any) => {
                                  return (
                                    <Option value={data.name}>
                                      {data.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={8}>
                            <Form.Item
                              label="Type"
                              name={["competitive", "type"]}
                              rules={[{ required: true }]}
                            >
                              <Select
                                value={competitive.type}
                                disabled={this.state.hidden}
                              >
                                {this.props.rfpByTypeData.map((data: any) => {
                                  return (
                                    <Option
                                      disabled={this.state.readOnly}
                                      value={data.name}
                                    >
                                      {data.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={8}>
                            <Form.Item
                              label={<span> Price</span>}
                              name={["competitive", "price"]}
                            >
                              {/* <Input placeholder="Enter Price" /> */}
                              <InputNumber
                                placeholder="Enter Price"
                                minLength={0}
                                maxLength={10}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row
                          hidden={this.state.hidden}
                          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                        >
                          <Col className="gutter-row" span={24}>
                            <Form.Item
                              label={<span> Comment</span>}
                              name={["text"]}
                            >
                              <TextArea rows={4} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>
                      <div className="button-step">
                        {" "}
                        <Button onClick={this.cancel}>Cancel </Button>{" "}
                        <Button
                          style={{ marginLeft: 8 }}
                          type="primary"
                          htmlType="submit"
                          onClick={() => {}}
                        >
                          {" "}
                          Continue
                          <RightOutlined />
                        </Button>
                      </div>
                    </>
                  )}

                  {this.state.current == 1 && (
                    <>
                      <div>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Agency Name"
                              name={["competitive", "agency", "name"]}
                              rules={[{ required: true }]}
                            >
                              <Input
                                placeholder="Enter Agency Name"
                                maxLength={100}
                              />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label="Agency Email"
                              name={["competitive", "agency", "email"]}
                              rules={[{ required: true, type: "email" }]}
                            >
                              <Input
                                placeholder="Enter Agency Email"
                                maxLength={50}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label={<span> Agency Website</span>}
                              name={["competitive", "agency", "webSite"]}
                              rules={[
                                {
                                  type: "url",
                                  message: "This field must be a valid url.",
                                },
                              ]}
                            >
                              <Input
                                placeholder="Enter Agency Website"
                                maxLength={100}
                              />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label={<span> Agency Contact Number</span>}
                              name={["competitive", "agency", "contactNo"]}
                            >
                              {/* <Input placeholder="Enter Agency Contact Number" /> */}
                              <InputMask mask="(999) 999-9999">
                                {(inputProps: any) => (
                                  <Input
                                    {...inputProps}
                                    placeholder="(###) ###-####"
                                  />
                                )}
                              </InputMask>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          label={<span> Address Line 1</span>}
                          name={["competitive", "agency", "address", "line1"]}
                        >
                          <Input
                            placeholder="Enter AgAddress Line 1"
                            maxLength={100}
                          />
                        </Form.Item>
                        <Form.Item
                          label={<span> Address Line 2</span>}
                          name={["competitive", "agency", "address", "line2"]}
                        >
                          <Input
                            placeholder="Enter AgAddress Line 2"
                            maxLength={50}
                          />
                        </Form.Item>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={12}>
                            <Form.Item
                              label={<span> Address Line 3</span>}
                              name={[
                                "competitive",
                                "agency",
                                "address",
                                "line3",
                              ]}
                            >
                              <Input
                                placeholder="Enter Address Line 3"
                                maxLength={50}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              label={<span> City</span>}
                              name={[
                                "competitive",
                                "agency",
                                "address",
                                "city",
                              ]}
                            >
                              <Input
                                placeholder="Enter City"
                                maxLength={50}
                                onKeyPress={(e) => this.firstMethod(e)}
                              />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              label={<span> State</span>}
                              name={[
                                "competitive",
                                "agency",
                                "address",
                                "state",
                              ]}
                            >
                              <Input
                                placeholder="Enter State"
                                maxLength={50}
                                onKeyPress={(e) => this.firstMethod(e)}
                              />
                            </Form.Item>
                          </Col>
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              label={<span> Country</span>}
                              name={[
                                "competitive",
                                "agency",
                                "address",
                                "country",
                              ]}
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
                          <Col className="gutter-row" span={6}>
                            <Form.Item
                              label={<span> Zip Code</span>}
                              name={[
                                "competitive",
                                "agency",
                                "address",
                                "pinCode",
                              ]}
                            >
                              <Input
                                placeholder="Enter Zipcode"
                                maxLength={10}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </div>

                      <div className="button-step">
                        <Button
                          style={{ marginRight: 8 }}
                          onClick={() => this.prev()}
                        >
                          <LeftOutlined /> Back
                        </Button>{" "}
                        {id === undefined || id === "" ? (
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        ) : (
                          <Button
                            style={{ marginLeft: 8 }}
                            type="primary"
                            htmlType="submit"
                            onClick={() => {}}
                          >
                            {" "}
                            Continue
                            <RightOutlined />
                          </Button>
                        )}
                      </div>
                    </>
                  )}

                  {this.state.current == 2 && (
                    <>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={8}></Col>
                        <Col className="gutter-row" span={16}>
                          <Tooltip title="Delete Documents">
                            <Button
                              type="primary"
                              onClick={this.handleDeleteButton}
                              className="add-button fr ml1 button-doc"
                            >
                              <DeleteFilled />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Add New Document">
                            <Button
                              type="primary"
                              onClick={this.addDocument}
                              className="add-button"
                            >
                              <img src={addButton} />
                            </Button>
                          </Tooltip>
                        </Col>
                      </Row>
                      <div className="pb-10">
                        <Table1
                          columns={columnsDocument}
                          data={this.state.competitiveDocumentData}
                          checkBox={true}
                          handleSelect={this.handleSelect}
                          loading={false}
                        />
                      </div>

                      <div className="button-step">
                        {" "}
                        <Button
                          style={{ marginRight: 8 }}
                          onClick={() => this.prev()}
                        >
                          <LeftOutlined /> Back
                        </Button>{" "}
                        <Button
                          style={{ marginLeft: 8 }}
                          type="primary"
                          htmlType="submit"
                          onClick={() => {}}
                        >
                          {" "}
                          Continue
                          <RightOutlined />
                        </Button>
                      </div>
                    </>
                  )}

                  {this.state.current < this.steps.length - 1 && <></>}
                  {this.state.current === this.steps.length - 1 && (
                    <>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col className="gutter-row" span={24}>
                          <Form.Item
                            label={<span> Comment</span>}
                            name={["text"]}
                          >
                            <TextArea rows={4} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Table1
                        data={this.state.ComepetitveEditData.comments}
                        columns={columnsComment}
                        loading={false}
                      />

                      <div className="button-step">
                        <Button
                          style={{ marginRight: 8 }}
                          onClick={() => this.prev()}
                        >
                          <LeftOutlined /> Back
                        </Button>{" "}
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

function mapState(state: any) {
  const {
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
  } = state;
  const { proposalsData } = getProposals;
  const { proposalsPagesData } = getProposalsPages;
  const { proposalsByDomainData } = getProposalsByDomain;
  const { rfpByDomainData } = getRfpByDomain;
  const { rfpByStatusData } = getRfpByStatus;
  const { rfpByTypeData } = getRfpByType;
  const { rfpByContractData } = getRfpByContract;
  const { rfpByActionData } = getRfpByAction;
  const { rfpBySubmissionData } = getRfpBySumission;
  const { rfpBySourceData } = getRfpBySource;
  const { rfpByOwnerData } = getRfpByOwner;
  const { rfpByCountryrData } = getRfpByCountry;

  return {
    proposalsData,
    proposalsPagesData,
    proposalsByDomainData,
    rfpByDomainData,
    rfpByStatusData,
    rfpByTypeData,
    rfpByContractData,
    rfpByActionData,
    rfpBySubmissionData,
    rfpBySourceData,
    rfpByOwnerData,
    rfpByCountryrData,
  };
}
const actionCreators = {
  getRfpProposals: proposalsAction.getRfpProposals,
  getRfpProposalsPages: proposalsAction.getRfpProposalsPages,
  getRfpByDomain: proposalsAction.getRfpByDomain,
  getRfpProposalsByDomain: proposalsAction.getRfpProposalsByDomain,
  getRfpByStatus: proposalsAction.getRfpByStatus,
  getRfpBytype: proposalsAction.getRfpByType,
  getRfpByContract: proposalsAction.getRfpByContract,
  getRfpByAction: proposalsAction.getRfpByAction,
  getRFPBYSubmission: proposalsAction.getRfpBySubmission,
  getRFPBYSource: proposalsAction.getRfpBySource,
  getRfpByOwner: proposalsAction.getRfpByOwner,
};

export default connect(mapState, actionCreators)(AddCompetitive);
