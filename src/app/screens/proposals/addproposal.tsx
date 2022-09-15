import React, { Component } from "react";
import "antd/dist/antd.css";
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
  Spin,
  notification,
} from "antd";
import {
  RightOutlined,
  LeftOutlined,
  MergeCellsOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import FroalaEditorComponent from "react-froala-wysiwyg";
import InputMask from "react-input-mask";
import { connect } from "react-redux";
import { proposalsAction } from "../../_redux/_actions";
import { rfpService } from "../../services/rfp-service";
import { AttributeType } from "../../_redux/_constants";
import CountriesComponent from "../../component/CountriesComponent";
import moment from "moment";
import { assignWith, merge } from "lodash";
import { request } from "http";
import trash from "../../../assets/images/trash.png";
import addButton from "../../../assets/images/addButton.png";
import { Entity, ProposalRequest } from "../../_models/proposal-request.model";
import { Comment } from "../../_models/comment.model";
import { Table1 } from "../../component/table";
import { userService } from "../../services/user-service";
import { notifications } from "../../_helpers/notifications";
import { User } from "../../_globals/components";
import { MessageProp } from "../../_globals/constants/message.constants";
import history from "../../_helpers/history";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/paste";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/content/default/content.min.css";
const Option = Select.Option;
const { TextArea } = Input;
const Step = Steps.Step;
const qs = require("query-string");
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
const steps = [
  {
    title: "RFP Information",
    content: "",
  },
  {
    title: "Agency Information",
    content: "",
  },
  {
    title: "Contract Information",
    content: "",
  },
  {
    title: "Contact Information",
    content: "",
  },
];


const validateMessages = {
  required: "${label}  is required!",
};

export class AddProposal extends Component<any, any> {
  testdata: any;
  format = "MM/DD/YYYY";
  domain: string = "";
  subDomain: string = "";
  regionValue: string = " ";
  countyName="";
  stateName="";
  cityName="";
  Pars = qs.parse(window.location.search);
  refForm: any = React.createRef();
  constructor(props: any) {
    super(props);
    this.state = {
      proposalsEditData: "",
      current: 0,
      size: "default",
      keyboard: true,
      request: new ProposalRequest(),
      submissionData: "",
      contractData: "",
      countryData: "",
      subdomainData: [],
      request1: "",
      request2: "",
      request3: "",
      request0: "",
      request4: "",
      readOnly: false,
      contacts: [],
      countries: "",
      comment: {},
      commentList: [],
      hidden: true,
      hidden1: false,
      proposalsDocumentData: "",
      ownerName: "",
      loading: true,
      region: [],
      domain: [],
      edit: false,
      countriesList: [],
      statesList:[],
      citiesList:[],
      zipsList:[],
     
    };
    this.handledomainChange = this.handledomainChange.bind(this);
  }
  next = (request: any) => { };
  prev() {
    const current = this.state.current - 1;

    this.setState({ current });
  }
  direct = (current: Number) => {
    this.setState({ current });
  };
  toggle = () => {
    this.setState({
      keyboard: !this.state.keyboard,
    });
  };

  handlRegionChangeEdit = async (region: any) => {
    let response = await rfpService.getDomain(region).then().catch();
    this.setState({
      domain: response,
    });
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

  handledomainChange = async (domain: any) => {
    let response = await rfpService
      .getSubDomains(domain)
      .then()
      .catch(notifications.openErrorNotification);
    if (response != "") {
      let subDomain = response[0].name;
      this.setDomainAndSubDomain(subDomain);
      this.setState({
        subdomainData: response,
        request: { ...this.state.request, subDomain },
      });
    } else {
      this.setDomainAndSubDomain("");
      this.setState({
        subdomainData: [],
      });
    }
  };

  async componentDidMount() {
    let { id } = this.Pars;
    document.title = "Proposals";
    if (id === undefined || id === "") {
      await this.props.getRfpByDomain();
      await this.props.getRFPBYSource();
      await this.props.getRfpBytype();
      await this.props.getRfpByOwner();
      await this.getRegion();
      await this.loadCountries();
    } else {
      this.setState({ loading: true, edit : true });
      await this.getProposalById();
      await this.getRegion();
      await this.props.getRfpBytype();
      await this.props.getRFPBYSource();
      await this.props.getRfpByStatus();
      await this.props.getRfpByAction();
      await this.props.getRfpByOwner();
      await this.loadCountries();
      this.handlRegionChangeEdit(this.state.proposalsEditData.region);

      this.setState({
        readOnly: true,
        hidden: false,
        hidden1: true,
      });
    }
    await this.getSubmissionData();
    await this.getContarctData();
    this.setState({ loading: false });
  }

  componentDidCatch(error: any, info: any) {
    notifications.errorMessage(error);
  }
  getDocument = async () => {
    let { id } = this.Pars;
    rfpService
      .getDocumentsByRFP(id)
      .then((response) => {
        this.setState({
          proposalsDocumentData: response,
        });
      })
      .catch(notifications.openErrorNotification);
  };

  getProposalById = async () => {
    let { id } = this.Pars;
    this.setState(
      {
        proposalsEditData: await rfpService
          .getProposalRequest(id)
          .then()
          .catch(notifications.openErrorNotification),
      },
      async () => {
        await this.editProposal();
        let ownerName = this.state.proposalsEditData.ownerName;
        this.setState({
          request: { ...this.state.request, ownerName },
        });
      }
    );
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

  getCountry = async () => {
    this.setState({
      countries: await rfpService
        .getRfpProposalsByCountry()
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  loadCountries = async () => {
    this.setState({
      countriesList: await rfpService
      .getCountry()
      .then()
      .catch(notifications.openErrorNotification),
      loading: false,
    });
  }

  loadStates = async (country:string) =>  {
    this.setState({
      statesList: await rfpService
      .getStates(country)
      .then()
      .catch(notifications.openErrorNotification),
      loading: false,
    })
    this.countyName = country;
  }

  loadCities = async (state:string) => {
    this.setState({
      citiesList: await rfpService
      .getCities(this.countyName,state)
      .then()
      .catch(notifications.openErrorNotification),
      loading: false,
    })
    this.stateName = state;
  }

  loadZips = async (city:string) =>{
    this.setState({
      zipsList: await rfpService
      .getZipCodes(this.countyName,this.stateName,city)
      .then()
      .catch(notifications.openErrorNotification),
      loading: false
    })
  }

  getSubmissionData = async () => {
    this.setState({
      submissionData: await rfpService
        .getRfpByAttribute(AttributeType.SUBMISSION)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  getContarctData = async () => {
    this.setState({
      contractData: await rfpService
        .getRfpByAttribute(AttributeType.CONTRACT)
        .then()
        .catch(notifications.openErrorNotification),
      loading: false,
    });
  };

  editProposal = () => {
    let fieldValues = {
      request: {
        id: this.state.proposalsEditData.id,
        requestId: this.state.proposalsEditData.requestId,
        title: this.state.proposalsEditData.title,
        region: this.state.proposalsEditData.region,
        domain: this.state.proposalsEditData.domain,
        subDomain: this.state.proposalsEditData.subDomain,
        complexity: this.state.proposalsEditData.complexity,
        source: this.state.proposalsEditData.source,
        type: this.state.proposalsEditData.type,
        ownerEmail: this.state.proposalsEditData.ownerEmail,
        ownerName: this.state.proposalsEditData.ownerName,
        competitionType: this.state.proposalsEditData.competitionType,

        agency: {
          name: this.state.proposalsEditData.agency.name,
          email: this.state.proposalsEditData.agency.email,
          webSite: this.state.proposalsEditData.agency.webSite,
          contactNo: this.state.proposalsEditData.agency.contactNo,
          address: {
            line1: this.state.proposalsEditData.agency.address.line1,
            line2: this.state.proposalsEditData.agency.address.line2,
            line3: this.state.proposalsEditData.agency.address.line3,
            city: this.state.proposalsEditData.agency.address.city,
            state: this.state.proposalsEditData.agency.address.state,
            country: this.state.proposalsEditData.agency.address.country,
            pinCode: this.state.proposalsEditData.agency.address.pinCode,
          },
        },
        contractType: this.state.proposalsEditData.contractType,
        submissionType: this.state.proposalsEditData.submissionType,
        status: this.state.proposalsEditData.status,
        action: this.state.proposalsEditData.action,
        contractDetailsUrl: this.state.proposalsEditData.contractDetailsUrl,
        dueDate: moment(this.state.proposalsEditData.dueDate),
        price: this.state.proposalsEditData.price,
      },
    };

    this.state.proposalsEditData.comments.map((data: any) => {
      this.state.commentList.push(data);
    });
    this.state.proposalsEditData.contacts.map((data: any) => {
      this.state.contacts.push(data);
    });
    this.refForm.current.setFieldsValue(fieldValues);
  };

  onFinish = async (value: any) => {
    let { id } = this.Pars;
    const current = this.state.current + 1;
    this.setState({ current });
    if (current === 1) {
      if(this.state.edit){
        this.setState({
          request1: value,
          request: {
            ...this.state.request,
            ...value.request
          },
        });
      }else{
          this.setState({
            request1: value,
            request: {
              ...this.state.request,
              ...value.request
            },
          });
      }
    
    } else if (current === 2) {
      this.setState({
        request2: value,
        request: { ...this.state.request, ...value.request },
      });
    } else if (current === 3) {
      let dueDate = value.request.dueDate.format(this.format);
      this.setState({
        request3: value,
        request: { ...this.state.request, ...value.request, dueDate },
      });
    } else if (current === 4) {
      if (value.contacts != undefined) {
        this.setState({ contacts: [] });
        value.contacts.map((data: any) => {
          this.state.contacts.push(data);
        });
      }
      this.state.request.contacts = this.state.contacts;
      if (value.text != undefined && value.text.trim().length !== 0) {
        this.state.comment.text = value.text;
        this.state.comment.createdBy = User.getLoggedInUserEmailId();
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
        this.state.comment.fromDate = fullDate + " " + time;

        this.state.commentList.push(this.state.comment);
      }
      this.state.request.comments = this.state.commentList;
      if (id === undefined || id === "") {
        if(this.state.request.ownerEmail === "" || this.state.request.ownerEmail === undefined){
         this.state.request.ownerEmail = this.props.user.email;
         this.state.request.ownerName = this.props.user.name;
        }
        this.submitProposals();
      } else {
        let issueDate = this.state.proposalsEditData.issueDate;
        let audit = this.state.proposalsEditData.audit;
        this.setState({
          request: { ...this.state.request, id, issueDate, audit },
        });
        this.updateProposals();
      }
    } else {
      this.setState({
        request: value,
      });
    }
  };

  ownerNameChange = (event: string) => {
    let user = this.props.rfpByOwnerData.find((x: any) => x.email == event);
    this.setState({
      ownerName: user.name,
    });
    this.state.request.ownerName = user.name;
  };

  submitProposals() {
    this.updateLoading(true);
    rfpService
      .addProposals(this.state.request)
      .then((response) => {
        this.updateLoading(false);
        notifications.openSuccessNotification(
          MessageProp.getCreatedSuccessMessage("Proposal")
        );
        history.push({
          pathname: "/viewproposal",
          search: "?id=" + response.id,
        });
      })
      .catch((error) => {
        notifications.openErrorNotification(error);
        this.updateLoading(false);
        this.cancel();
      });
  }

  cancel = () => {
    history.push({
      pathname: "/proposals",
      search: "?past=-1",
    });
  };

  disabledDate = (current: any) => {
    return current && current < moment().startOf("day");
  };

  firstMethod = (e: any) => {
    const re = /[a-z A-Z]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  };

  updateProposals() {
    this.updateLoading(true);
    rfpService
      .updateProposalRequest(this.state.request)
      .then((response) => {
        this.updateLoading(false);
        MessageProp.getUpdatedSuccessMessage("Proposal");
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

  setDomainAndSubDomain = (subDomain: string) => {
    let fieldValues = {
      request: {
        subDomain: subDomain,
      },
    };
    this.refForm.current.setFieldsValue(fieldValues);
  };
  setRegionAndDomain = (domain: string) => {
    let fieldValue = {
      request: {
        domain: domain,
      },
    };
    this.refForm.current.setFieldsValue(fieldValue);
    this.handledomainChange(domain);
  };
  render() {
    const { current, request, subdomainData } = this.state;
    let { id } = this.Pars;
    const { user } = this.props;
    let { rfpByDomainData } = this.state.domain;
    if (rfpByDomainData != undefined) {
      rfpByDomainData = rfpByDomainData.filter((x: any) => x.name != "ALL");
    }
    const contacts = this.state.contacts;
    return (
      <>
        <Spin spinning={this.state.loading} size="large">
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
                <Steps current={current}>
                  {steps.map((item: any, i: Number) =>
                    id === undefined ? (
                      <>
                        <Step key={item.title} title={item.title} />
                      </>
                    ) : (
                      <>
                        <Step
                          key={item.title}
                          title={item.title}
                        />
                      </>
                    )
                  )}
                </Steps>
                <Form
                  name="basic"
                  onFinish={this.onFinish}
                  ref={this.refForm}
                  scrollToFirstError
                  validateMessages={validateMessages}
                >
                  {steps.map(({ title, content }, i) => (
                    <div
                      key={title}
                      className={
                        i === this.state.current ? "foo fade-in" : "foo"
                      }
                    ></div>
                  ))}

                  <div className="steps-action">
                    {this.state.current == 0 && (
                      <>
                        <div>
                          <Form.Item
                            label="Solicitation"
                            name={["request", "requestId"]}
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder="Enter Solicitation Number"
                              disabled={this.state.readOnly}
                              maxLength={50}
                            />
                          </Form.Item>
                          <Form.Item
                            label="Title"
                            name={["request", "title"]}
                            rules={[{ required: true }]}
                          >
                            <Input
                              placeholder="Enter Title"
                              disabled={this.state.readOnly}
                              maxLength={100}
                            />
                          </Form.Item>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Region"
                                name={["request", "region"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.region}
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
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Domain"
                                name={["request", "domain"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.domain}
                                  onChange={this.handledomainChange}
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
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Sub Domain"
                                name={["request", "subDomain"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.subDomain}
                                  id="rc_select_subdomain"
                                >
                                  {subdomainData.map((data: any) => {
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
                                label="Complexity Level"
                                name={["request", "complexity"]}
                              >
                                <Select value={request.complexity}>
                                  <Option value="High">High</Option>
                                  <Option value="Medium">Medium</Option>
                                  <Option value="Low">Low</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Source"
                                name={["request", "source"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.source}
                                >
                                  {this.props.rfpBySourceData.map(
                                    (data: any) => {
                                      return (
                                        <Option value={data.name}>
                                          {data.name}
                                        </Option>
                                      );
                                    }
                                  )}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Type"
                                name={["request", "type"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.type}
                                >
                                  {this.props.rfpByTypeData.map((data: any) => {
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
                              label="Assignee To"
                              name={["request", "ownerEmail"]}
                            >
                              <Select
                                value={request.ownerEmail} 
                                onChange={this.ownerNameChange}
                                defaultValue={user.name}
                              >
                                {this.props.rfpByOwnerData.map(
                                  (data: any) => {
                                    return (
                                      <Option value={data.email}>
                                        {data.name}
                                      </Option>
                                    );
                                  }
                                )}
                              </Select>
                            </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label="Competition Type"
                                name={["request", "competitionType"]}
                              >
                                <Select value={request.competitionType}>
                                  <Option value="Open Enrollment">
                                    Open Enrollment
                                  </Option>
                                  <Option value="Exclusive">Exclusive</Option>
                                  <Option value="Competitive">
                                    Competitive
                                  </Option>
                                </Select>
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
                                label={"Agency Name"}
                                name={["request", "agency", "name"]}
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
                                label={"Agency Email"}
                                name={["request", "agency", "email"]}
                                rules={[
                                  {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                  },
                                  {
                                    required: true,
                                  },
                                ]}
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
                                name={["request", "agency", "webSite"]}
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
                                name={["request", "agency", "contactNo"]}
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
                            name={["request", "agency", "address", "line1"]}
                          >
                            <Input
                              placeholder="Enter AgAddress Line 1"
                              maxLength={100}
                            />
                          </Form.Item>

                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={<span> Address Line 2</span>}
                                name={["request", "agency", "address", "line2"]}
                              >
                                <Input
                                  placeholder="Enter AgAddress Line 2"
                                  maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={<span> Address Line 3</span>}
                                name={["request", "agency", "address", "line3"]}
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
                                label={<span> Country</span>}
                                name={[
                                  "request",
                                  "agency",
                                  "address",
                                  "country",
                                ]}
                              >
                                <Select
                                 value={request.agency.address.country}
                                 onChange={this.loadStates}
                                >
                                  {this.state.countriesList
                                    ? this.state.countriesList.map((data: any) => {
                                      return (
                                        <Option value={data}>
                                          {data}
                                        </Option>
                                      );
                                    })
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label={<span> State</span>}
                                name={["request", "agency", "address", "state"]}
                              >
                                <Select
                                 value={request.agency.address.state}
                                 >
                                   {this.state.statesList
                                    ? this.state.statesList.map((data: any) => {
                                      return (
                                        <Option value={data}>
                                          {data}
                                        </Option>
                                      );
                                    })
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label={<span> City</span>}
                                name={["request", "agency", "address", "city"]}
                              >
                                <Input
                                  placeholder="Enter City"
                                  maxLength={50}
                                  onKeyPress={(e: any) => this.firstMethod(e)}
                                />
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={6}>
                              <Form.Item
                                label={<span> Zip Code</span>}
                                name={[
                                  "request",
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
                            Continue
                            <RightOutlined />
                          </Button>
                        </div>
                      </>
                    )}

                    {this.state.current == 2 && (
                      <>
                        <div>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Contract Type"}
                                name={["request", "contractType"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.contractType}
                                  disabled={this.state.readOnly}
                                >
                                  {this.state.contractData
                                    ? this.state.contractData.map(
                                      (data: any) => {
                                        return (
                                          <Option value={data.name}>
                                            {data.name}
                                          </Option>
                                        );
                                      }
                                    )
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Submission Type"}
                                name={["request", "submissionType"]}
                                rules={[{ required: true }]}
                              >
                                <Select
                                  value={request.submissionType}
                                  disabled={this.state.readOnly}
                                >
                                  {this.state.submissionData
                                    ? this.state.submissionData.map(
                                      (data: any) => {
                                        return (
                                          <Option value={data.name}>
                                            {data.name}
                                          </Option>
                                        );
                                      }
                                    )
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>

                          <Form.Item
                            label={"Contract Details Url"}
                            name={["request", "contractDetailsUrl"]}
                          >
                            <Input
                              placeholder="Enter Contract Details Url"
                              maxLength={1800}
                            />
                          </Form.Item>
                          <Row
                            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                            hidden={this.state.hidden}
                          >
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={<span> Status</span>}
                                name={["request", "status"]}
                              >
                                <Select value={request.action}>
                                  {this.props.rfpByStatusData
                                    ? this.props.rfpByStatusData.map(
                                      (data: any) => {
                                        return (
                                          <Option value={data.name}>
                                            {data.name}
                                          </Option>
                                        );
                                      }
                                    )
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={<span>Bid Decision</span>}
                                name={["request", "action"]}
                              >
                                <Select value={request.submissionType}>
                                  {this.props.rfpByActionData
                                    ? this.props.rfpByActionData.map(
                                      (data: any) => {
                                        return (
                                          <Option value={data.name}>
                                            {data.name}
                                          </Option>
                                        );
                                      }
                                    )
                                    : ""}
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="gutter-row" span={12}>
                              <Form.Item
                                label={"Due Date"}
                                name={["request", "dueDate"]}
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
                                label={<span> Contract Price</span>}
                                name={["request", "price"]}
                              >
                                <InputNumber minLength={0} maxLength={10} />
                              </Form.Item>
                            </Col>
                          </Row>
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
                            Continue
                            <RightOutlined />
                          </Button>
                        </div>
                      </>
                    )}

                    {this.state.current < steps.length - 1 && <></>}
                    {this.state.current === steps.length - 1 && (
                      <>
                        <Form.List name="contacts" initialValue={contacts}>
                          {(fields, { add, remove }) => (
                            <>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col className="gutter-row" span={8}></Col>
                                <Col className="gutter-row" span={16}>
                                  <Button
                                    type="primary"
                                    onClick={() => add()}
                                    className="add-button"
                                  >
                                    <img src={addButton} />
                                  </Button>
                                </Col>
                              </Row>
                              {fields.map((field) => (
                                <div key={field.key}>

                                  <Row
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                  >
                                    <Col className="gutter-row" span={8}>
                                      <Form.Item
                                        {...field}
                                        label="Title"
                                        name={[field.name, "title"]}
                                      >
                                        <Input maxLength={100} />
                                      </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                      <Form.Item
                                        {...field}
                                        label="Name"
                                        name={[field.name, "name"]}
                                        rules={[
                                          {
                                            required: true,
                                          },
                                        ]}
                                      >
                                        <Input maxLength={100} />
                                      </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" span={8}>
                                      <Form.Item
                                        {...field}
                                        label="Email"
                                        name={[field.name, "email"]}
                                        rules={[
                                          {
                                            type: "email",
                                            message:
                                              "The input is not valid E-mail!",
                                          },
                                          {
                                            required: false,
                                          },
                                        ]}
                                      >
                                        <Input maxLength={100} />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                  <Row
                                    gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                                  >
                                    <Col className="gutter-row" span={12}>
                                      <Form.Item
                                        {...field}
                                        label="Contact No."
                                        name={[field.name, "contactNo"]}
                                        rules={[
                                          {
                                            required: true,
                                          },
                                        ]}
                                      >
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
                                    <Col className="gutter-row" span={12}>
                                      <Button
                                        style={{ marginLeft: 8 }}
                                        type="primary"
                                        onClick={() => remove(field.name)}
                                        className="trash"
                                      >
                                        <img src={trash} />
                                      </Button>
                                   
                                    </Col>
                                  </Row>
                                 
                                </div>
                              ))}
                            </>
                          )}
                        </Form.List>
                        <Row hidden={this.state.hidden1}>
                          <Col className="gutter-row" span={24}>
                            <Form.Item label="Comment" name={["text"]}>
                              <TextArea rows={4} />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row
                          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                          hidden={this.state.hidden}
                        >
                          <Col span={12}>
                            <PageHeader
                              ghost={false}
                              title="Comments"
                              className="bordernone"
                            ></PageHeader>
                            <Table1
                              data={this.state.proposalsEditData.comments}
                              columns={columnsComment}
                              loading={false}
                            />
                          </Col>
                          <Col span={12}>
                            <PageHeader
                              ghost={false}
                              title="Comment"
                              className="bordernone"
                            ></PageHeader>
                            <Form.Item label="Comment" name={["text"]}>
                              <TextArea rows={4} />
                            </Form.Item>
                          </Col>
                        </Row>
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
        </Spin>
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
    authentication
  } = state;
  const { proposalsData } = getProposals;
  const { proposalsPagesData } = getProposalsPages;
  const { proposalsByDomainData } = getProposalsByDomain;
  const { rfpByStatusData } = getRfpByStatus;
  const { rfpByTypeData } = getRfpByType;
  const { rfpByContractData } = getRfpByContract;
  const { rfpByActionData } = getRfpByAction;
  const { rfpBySubmissionData } = getRfpBySumission;
  const { rfpBySourceData } = getRfpBySource;
  const { rfpByOwnerData } = getRfpByOwner;
  const { rfpByCountryrData } = getRfpByCountry;
  const { user } = authentication;

  return {
    proposalsData,
    proposalsPagesData,
    proposalsByDomainData,
    rfpByStatusData,
    rfpByTypeData,
    rfpByContractData,
    rfpByActionData,
    rfpBySubmissionData,
    rfpBySourceData,
    rfpByOwnerData,
    rfpByCountryrData,
    user
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
export default connect(mapState, actionCreators)(AddProposal);
